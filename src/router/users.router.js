import express from "express";
import bcrypt from "bcrypt";
import { prisma } from "../utils/prisma/index.js";
import { Prisma } from "@prisma/client";
import jwt from "jsonwebtoken";
import authMiddleWare from "../middlewares/auth.middleware.js";

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

//로그인 api
// 1. 이메일, 비밀번호로 **로그인을 요청**합니다.
// 2. 이메일 또는 비밀번호 중 **하나라도 일치하지 않는다면,** 알맞은 Http Status Code와 에러 메세지를 반환해야 합니다.
// 3. **로그인 성공 시**, JWT AccessToken을 생성하여 반환합니다.
//     - Access Token
//         - Payload: userId를 담고 있습니다.
//         - 유효기한: 12시간
router.post("/sign-in", async (req, res, next) => {
  const { email, password } = req.body;

  const user = await prisma.users.findFirst({ where: { email } });

  if (!user)
    //일치하는 users가 존재하지 않음
    return res.status(401).json({ message: "존재하지 않는 이메일입니다." });
  if (!(await bcrypt.compare(password, user.password)))
    //users.password값을 비크립트로 비교했는데 비밀번호 일치하지않음
    return res.status(401).json({ message: "비밀번호가 일치하지 않습니다." });

  //jwt는 header/payload/sign으로 이루어져있음
  const token = jwt.sign({ userId: user.userId }, "custom-secret-key", {
    expiresIn: "12hr",
  });

  //bearer token을 cookie에 할당
  res.cookie("authorization", `Bearer ${token}`);
  return res.status(200).json({ message: "로그인 성공~!" });
});

//내 정보조회 api
router.get("/users", authMiddleWare, async (req, res, next) => {
  const { userId } = req.user;

  const user = await prisma.users.findFirst({
    where: { userId: +userId },
    select: {
      userId: true,
      email: true,
      createdAt: true,
      updatedAt: true,
      userInfos: {
        //중첩 select
        select: {
          name: true,
          age: true,
          gender: true,
          profileImage: true,
        },
      },
    },
  });

  return res.status(200).json({ data: user });
});

export default router;
