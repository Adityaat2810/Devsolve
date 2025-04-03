import ProblemController from "../controller/problems";
import  { Request, Response } from "express";
const express = require("express");

const problemRouter = express.Router();
const problemController = new ProblemController();

problemRouter.post("/", (req: Request, res: Response) =>
  problemController.createProblem(req, res)
);

problemRouter.get("/", (req: Request, res: Response) =>
  problemController.getAllProblems(req, res)
);

problemRouter.get("/:id", (req: Request, res: Response) =>
  problemController.getProblemById(req, res)
);

export default problemRouter;