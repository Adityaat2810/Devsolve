import { Request, Response} from "express";
import UserClass from "../controller/users";

const express = require('express')

const userController = new UserClass();
const userRouter = express.Router();

userRouter.post("/signup", (req:Request, res:Response) =>
  userController.signup(req, res)
);

userRouter.post('/login',(req:Request, res:Response)=>{
    userController.login(req,res)
})
export default userRouter;