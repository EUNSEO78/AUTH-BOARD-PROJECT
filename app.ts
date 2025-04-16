import { Request, Response } from "express";
import bcrypt from "bcrypt";
import { PrismaClient } from "./generated/prisma";
const prisma = new PrismaClient();
const express = require("express");
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// users 전체 조회
app.get("/users", async (req: Request, res: Response) => {
  const users = await prisma.users.findMany();
  res.status(200).json({
    success: true,
    message: "유저저 목록 조회 성공",
    users: users.map((user) => {
      return {
        id: user.id,
        email: user.email,
        name: user.name,
      };
    }),
  });
});

// users 단일 조회
app.get("/users/:id", async (req: Request, res: Response) => {
  const { id } = req.params;
  const user = await prisma.users.findUnique({
    where: { id: +id },
  });
  if (!user)
    return res
      .status(404)
      .json({ success: false, message: "유저 정보 조회 실패" });
  res.status(200).json({
    sucess: true,
    message: "유저 정보 조회 성공",
    user: {
      id: user.id,
      email: user.email,
      name: user.name,
    },
  });
});
// users 추가 [회원가입]
app.post("/users", async (req: Request, res: Response) => {
  const { email, password, name } = req.body;
  const existingUser = await prisma.users.findUnique({
    where: { email },
  });
  if (existingUser)
    return res
      .status(409)
      .json({ success: false, message: "이미 존재하는 이메일입니다." });
  const hashedPassword = await bcrypt.hash(password, 10);
  const user = await prisma.users.create({
    data: {
      email,
      password: hashedPassword,
      name,
    },
  });
  res.status(201).json({
    success: true,
    message: "회원가입 완료",
    user: {
      id: user.id,
      email: user.email,
      name: user.name,
    },
  });
});

app.listen(3000, () => {
  console.log("✅ Server is running on port 3000");
});
