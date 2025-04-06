import { PrismaClient } from "@prisma/client";
import { Queue } from "bullmq";
import { redis } from "./redisConnection";

const prisma = new PrismaClient();

export default class DbInterface {
  subbmissionQueue = new Queue("submission-processing", {
    connection: redis,
    defaultJobOptions: {
      attempts: 3,
      backoff: {
        type: "exponential",
        delay: 1000,
      }
    }
  })

  getUnprocessedOutboxEntries = async() => {
    try{
      return await prisma.$transaction(async (tx)=>{
        try{
          const unprocessedEntries = await tx.outboxSubmission.findMany({
            where: {
              processed: false,
            },
            select:{
              id: true,
              submissionId: true,
              processed: true

            },
            take: 10,   // process in batches
            orderBy: {
              createdAt: 'asc',  // old first
            },
          })

          if(unprocessedEntries.length === 0){
            return {processed:0};
          }

          console.log(`Found ${unprocessedEntries.length} unprocessed outbox entries`);

          // add them to queue
          const successfullIds = [];
          for(const entry of unprocessedEntries){
            try{
              await this.subbmissionQueue.add(
                'process-submission',
                {
                  outboxId: entry.id,
                  submissionId: entry.submissionId
                }
              )

              successfullIds.push(entry.id);

            }catch(err){
              console.error(`Failed to add outbox entry ${entry.id} to queue:`, err);

            }
          }

          // for successfull ids => mark them as processed
          if(successfullIds.length > 0){
            await tx.outboxSubmission.updateMany({
              where: {
                id: {
                    in: successfullIds
                }
              },
              data: {
                processed: true
              }
            })
          }

          console.log(`Successfully processed ${successfullIds.length} outbox entries`);
          return { processed: successfullIds.length };

        }catch(err){
          console.log(`Failed to process outbox entries:`, err);
        }
      })
    }catch(err){
      console.error(err);
    }
  }
}