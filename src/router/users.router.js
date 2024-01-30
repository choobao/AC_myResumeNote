import express from "express";
import bcrypt from "bcrypt";
import { prisma } from "../utils/prisma/index.js";
import { Prisma } from "@prisma/client";

const router = express.Router();

//회원가입 api
router.post("/sign-up", async (req, res, next) => {
  try {
    const { email, password, name, age, gender, profileImage } = req.body;

    const isExistUser = await prisma.users.findFirst({
      where: { email },
    });

    //중복이메일 검사
    if (isExistUser)
      return res.status(409).json({ message: "이미 존재하는 이메일 입니다." });
    if (password.length < 6)
      return res.status(400).json({ message: "비밀번호가 너무 짧습니다." });

    //비크립트 이용해 비밀번호 암호화해서 저장
    const hashedPassword = await bcrypt.hash(password, 10);

    const [user, userInfo] = await prisma.$transaction(
      async (tx) => {
        const user = await tx.users.create({
          data: {
            email,
            password: hashedPassword,
          },
        });

        const userInfo = await tx.userInfos.create({
          data: {
            userId: user.userId, //유저아이디는 생성된 유저의 유저 아이디 정보를 확인해서 만듬
            name,
            age,
            gender,
            profileImage,
          },
        });

        return [user, userInfo];
      },
      {
        //격리레벨설정하기 : readCommitted
        isolationLevel: Prisma.TransactionIsolationLevel.ReadCommitted,
      }
    );

    return res.status(201).json({ data: [userInfo] });
  } catch (err) {
    next(err);
  }
});

export default router;
