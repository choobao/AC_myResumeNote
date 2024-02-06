import express from "express";
import bcrypt from "bcrypt";
import { prisma } from "../utils/prisma/index.js";
import { Prisma } from "@prisma/client";
import jwt from "jsonwebtoken";
import authMiddleWare from "../middlewares/auth.middleware.js";
import dotenv from "dotenv";
import JWT from "../utils/jwt.sign.js";
// import qs from "qs";
// import axios from "axios";

dotenv.config(); //process.env.(변수이름)

const router = express.Router();

//회원가입 api
router.post("/sign-up", async (req, res, next) => {
  try {
    const { email, password, passwordCheck, name, age, gender, profileImage } =
      req.body;

    const isExistUser = await prisma.users.findFirst({
      where: { email },
    });

    //중복이메일 검사
    if (isExistUser)
      return res.status(409).json({ message: "이미 존재하는 이메일 입니다." });
    if (password !== passwordCheck)
      return res
        .status(400)
        .json({ message: "입력하신 비밀번호를 다시 확인해주십시오." });
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
      },
    );

    return res
      .status(201)
      .json({ message: "회원가입을 축하드립니다.", data: [userInfo] });
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
  try {
    const { email, password } = req.body;

    const user = await prisma.users.findFirst({ where: { email } });

    if (!user)
      //일치하는 users가 존재하지 않음
      return res.status(401).json({ message: "존재하지 않는 이메일입니다." });
    if (!(await bcrypt.compare(password, user.password)))
      //users.password값을 비크립트로 비교했는데 비밀번호 일치하지않음
      return res.status(401).json({ message: "비밀번호가 일치하지 않습니다." });

    //jwt는 header/payload/sign으로 이루어져있음
    const accessToken = JWT(user, "12h");
    const refreshToken = JWT(user, "7d");
    console.log(accessToken);
    //bearer token을 cookie에 할당
    res.cookie("authorization", `Bearer ${accessToken}`);
    res.cookie("refreshToken", `Bearer ${refreshToken}`);
    return res.status(422).json({ message: "로그인 성공~!" });
  } catch (err) {
    next(err);
  }
});

// //엑세스토큰 재발급 받기
// router.post("/refreshToken", async (req, res, next) => {
//   try {
//     const { refreshToken } = req.cookies;

//     if (!refreshToken) throw new Error("리프레시토큰이 존재하지 않습니다.");

//     const [tokenType, token] = refreshToken.split(" ");
//     //리프레시토큰이 맞으면 엑세스토큰 쿠키로 새로 넣어주기
//     if (tokenType !== "Bearer")
//       throw new Error("토큰 타입이 Bearer 형식이 아닙니당");

//     const decodedToken = jwt.verify(token, "custom-secret-key");
//     console.log(decodedToken);
//   } catch (err) {
//     if ((err.name = "jwt expired"))
//       return res.status(401).json({ message: "토큰이 만료되었습니다." });

//     return res.status(400).json({ message: err.message });
//   }
// });

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

// router.get("/kakao", (req, res, next) => {
//   const kakaoLoginURL = `https://kauth.kakao.com/oauth/authorize?client_id=${process.env.CLIENT_ID}&redirect_uri=${process.env.REDIRECT_URL}&response_type=code`;

//   return res.redirect(kakaoLoginURL);
// });

// router.get("/kakao/callback", async (req, res) => {
//   const code = req.query.code;
//   const tokenRequest = await axios({
//     method: "POST",
//     url: "https://kauth.kakao.com/oauth/token",
//     headers: {
//       "content-type": "application/x-www-form-urlencoded",
//     },
//     data: {
//       grant_type: "authorization_code",
//       client_id: process.env.CLIENT_ID,
//       redirect_uri: process.env.REDIRECT_URL,
//       code,
//     },
//   });
//   const { access_token } = tokenRequest.data;
//   const profileRequest = await axios({
//     method: "GET",
//     url: "https://kapi.kakao.com/v2/user/me",
//     headers: {
//       Authorization: `Bearer ${access_token}`,
//     },
//   });
//   const { email, profile } = profileRequest.data.kakao_account;
//   const name = profile.nickname;
//   const users = await prisma.users.upsert({
//     where: { email },
//     update: { email },
//     create: { email, password: "default" },
//   });
//   const userJWT = jwt.sign(
//     { userId: users.id },
//     process.env.SESSION_SECRET_KEY
//   );
//   res.cookie("authorization", `Bearer ${userJWT}`);
//   return res.status(200).json({ message: "로그인 성공" });
// });

export default router;
