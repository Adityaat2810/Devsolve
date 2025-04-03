import { Request, Response } from "express";
import router from "./routes";

const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");

dotenv.config();
const app = express();

app.use(cors());
app.use(express.json());
app.use('/api/v1',router)

app.get("/", (req:Request, res:Response) => {
  res.send("Server is running...");
});


const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
