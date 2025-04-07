// worker/submissionWorker.ts
import { Worker } from "bullmq";
import { PrismaClient } from "@prisma/client";
import { redisConnection } from "../reddisconnection";

const prisma = new PrismaClient();

export class SubmissionWorker {
  private worker: Worker;

  constructor() {
    this.worker = new Worker("submission-processing", this.processJob.bind(this), {
      connection: redisConnection,
      concurrency: 5,
      limiter: {
        max: 10,
        duration: 1000,
      },
    });

    this.worker.on("completed", (job) => {
      console.log(`Job ${job.id} completed`);
    });

    this.worker.on("failed", (job, err) => {
      console.error(`Job ${job?.id} failed:`, err);
    });
  }

  private async processJob(job: any) {
    try {
      const { outboxId, submissionId } = job.data;

      if (!outboxId || !submissionId) {
        throw new Error("Missing required job parameters");
      }

      console.log("get data ",outboxId,'   ',submissionId)

      // await processSubmission(submissionId, outboxId);

      // await this.markSubmissionProcessed(outboxId);

      return { success: true };
    } catch (error) {
      console.error(`Error processing job ${job.id}:`, error);
      throw error;
    }
  }

  private async markSubmissionProcessed(outboxId: string) {

  }

  public async close() {
    await this.worker.close();
  }
}
