import problemRouter from "./problems";

const express = require("express");
const router = express.Router();

router.use("/problem", problemRouter);
export default router;
