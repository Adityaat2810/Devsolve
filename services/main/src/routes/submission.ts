import { Request, Response } from "express";
import SubmissionClass from "../controller/submission";
const express = require('express')

const submissionRoute = express.Router()
const submissinController = new SubmissionClass()

submissionRoute.post('/saveSolution', (req:Request, res:Response) => {
  submissinController.saveSolutionToDb(req, res)
})


export default submissionRoute;