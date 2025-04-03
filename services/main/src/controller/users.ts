import { PrismaClient } from "@prisma/client";
import { Request, Response } from "express";
import { hash, compare } from "../scrypt";
import jwt from "jsonwebtoken";

const prisma = new PrismaClient();

export default class UserClass {
  // signup route
  async signup(req: Request, res: Response) {
    try {
      const { name, email, password } = req.body;
      const hashedPassword = await hash(password)
      const existingUser = await prisma.user.findUnique({
        where: { email },
      });
      if (existingUser) {
        return res.status(400).json({
          success: false,
          data: {},
          error: "User already exists",
          msg: "User already exists",
        });
      }

      const user = await prisma.user.create({
        data: { name, email, passwordHash: hashedPassword },
      });

      res.status(201).json({
        success: true,
        data: user,
        error: {},
        msg: "User created successfully",
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

  async login(req: Request, res: Response) {
    try {
      const { email, password } = req.body;
      const user = await prisma.user.findUnique({
        where: { email },
      });

      if (!user) {
        return res.status(401).json({
          success: false,
          data: {},
          error: "Invalid credentials",
          msg: "Invalid credentials",
        });
      }

      const isPasswordValid = await compare(password, user.passwordHash);
      if (!isPasswordValid) {
        return res.status(401).json({
          success: false,
          data: {},
          error: "Invalid credentials",
          msg: "Invalid credentials",
        });
      }

      let JWT_SECRET="hii"

      const token = jwt.sign({ id: user.id, email:user.email, role:user.role }, JWT_SECRET, {
        expiresIn: "1h",
      });

      res.status(200).json({
        success: true,
        data: {
            id: user.id,
            token
        },
        error: {},
        msg: "Login successful",
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