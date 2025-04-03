import { PrismaClient } from "@prisma/client";
import { Request, Response } from "express";

const prisma = new PrismaClient();

export default class ProblemController {
  async createProblem(req: Request, res: Response) {
    try {
      const { title, description, difficulty, authorId } = req.body;
      const problem = await prisma.problem.create({
        data: { title, description, difficulty, authorId },
      });

      res.status(201).json({
        success: true,
        data: problem,
        error: {},
        msg: "Problem created successfully",
      });
    } catch (err) {
      console.error(err);
      res.status(500).json({
        success: false,
        data: {},
        error: "Internal server error",
        msg: "Internal server error",
      });
    }
  }

  async getAllProblems(req: Request, res: Response) {
    try {
      const problems = await prisma.problem.findMany();
      res.status(200).json({
        success: true,
        data: problems,
        error: {},
        msg: "Problems fetched successfully",
      });
    } catch (err) {
      console.error(err);
      res.status(500).json({
        success: false,
        data: {},
        error: "Internal server error",
        msg: "Internal server error",
      });
    }
  }

  async getProblemById(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const problem = await prisma.problem.findUnique({ where: { id } });

      if (!problem) {
        return res.status(404).json({
          success: false,
          data: {},
          error: "Problem not found",
          msg: "Problem not found",
        });
      }

      res.status(200).json({
        success: true,
        data: problem,
        error: {},
        msg: "Problem fetched successfully",
      });
    } catch (err) {
      console.error(err);
      res.status(500).json({
        success: false,
        data: {},
        error: "Internal server error",
        msg: "Internal server error",
      });
    }
  }
}