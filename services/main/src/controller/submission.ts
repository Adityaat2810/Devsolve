import { PrismaClient } from "@prisma/client";
import e, { Request, Response } from "express";

const prisma = new PrismaClient();

export default class SubmissionClass {
  async saveSolutionToDb(req:Request,res:Response){
    let {code, language, problemId, userId } = req.body;
    if (!code || !language || !problemId || !userId) {
      return res.status(400).json({ message: "Missing required fields" });
    }
    try{
      const result = await prisma.$transaction(
        async(tx)=>{
          const submission = await tx.submission.create({
            data: {
              code,
              language,
              problemId,
              userId
            }
          });

          console.log("Submission created:", submission);

          await tx.outboxSubmission.create({
            data: {
              submissionId: submission.id,
              eventType:"SUBMISSION_CREATED",
              payload:JSON.stringify(submission)
            }
          });

          console.log("Outbox submission created:", submission);

          return submission;
        },
        { timeout: 10_000 } // timeout for transaction is 10 sec
      )

      return res.status(200).json({
        message: "Solution saved successfully",
        success: true,
        data: result,
        error:null
      });

    }catch (error) {
      console.error("Error saving solution to DB:", error);
      return res.status(500).json({
        message: "Internal server error",
        success: false,
        error: "Error saving solution to DB",
        data:{}
      });
    }

  }
}