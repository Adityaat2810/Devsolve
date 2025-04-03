import problemRouter from "./problems";
import userRouter from "./users";
import submissionRoute from "./submission"

const express = require("express");
const router = express.Router();

router.use("/problems", problemRouter);
router.use('/users',userRouter);
router.use('/submit',submissionRoute);

export default router;
