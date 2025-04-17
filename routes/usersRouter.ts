import { Request, Response } from "express";
import bcrypt from "bcrypt";
import { PrismaClient } from "../generated/prisma";
import userService from "../services/userService";

const prisma = new PrismaClient();
const express = require("express");
const usersRouter = express.Router();

// users 전체 조회
usersRouter.get("/", async (req: Request, res: Response) => {
  const users = await userService.getAll();
  res.json({
    success: true,
    message: "유저 목록 조회 성공",
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
usersRouter.get("/:id", async (req: Request, res: Response) => {
  const user = await userService.getById(req.params.id);
  if (!user)
    return res
      .status(404)
      .json({ success: false, message: "유저 정보 조회 실패" });
  res.json({
    success: true,
    message: "유저 정보 조회 성공",
    user: {
      id: user.id,
      email: user.email,
      name: user.name,
    },
  });
});
// users 추가 [회원가입/register]
usersRouter.post("/", async (req: Request, res: Response) => {
  const { email, password, name } = req.body;
  const existingUser = await prisma.users.findUnique({
    where: { email },
  });
  if (existingUser)
    return res
      .status(409)
      .json({ success: false, message: "이미 존재하는 이메일입니다." });
  const hashedPassword = await bcrypt.hash(password, 10);
  const user = await userService.create(email, name, hashedPassword);
  res.json({
    success: true,
    message: "회원가입 완료",
    user: {
      id: user.id,
      email: user.email,
      name: user.name,
    },
  });
});

export default usersRouter;
