import problemRouter from "./problems";
import userRouter from "./users";

const express = require("express");
const router = express.Router();

router.use("/problems", problemRouter);
router.use('/users',userRouter);

export default router;
