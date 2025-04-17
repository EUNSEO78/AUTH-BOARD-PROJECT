import { Request, Response } from "express";
import bcrypt from "bcrypt";
import { PrismaClient } from "../generated/prisma";

const prisma = new PrismaClient();
const express = require("express");
const loginRouter = express.Router();

// users 로그인 [로그인/Login]
loginRouter.post("/", async (req: Request, res: Response) => {
  const { email, password } = req.body;
  const user = await prisma.users.findUnique({
    where: { email },
  });

  if (!user)
    return res.status(404).json({ success: false, message: "로그인 실패" });

  const isPasswordValid = await bcrypt.compare(password, user.password);
  if (!isPasswordValid)
    return res.status(401).json({ success: false, message: "로그인 실패" });

  res.json({
    success: true,
    message: "로그인 성공",
    user: {
      email: user.email,
      name: user.name,
    },
  });
});

export default loginRouter;
