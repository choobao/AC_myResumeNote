import express from "express";
import { prisma } from "../utils/prisma/index.js";
import { Prisma } from "@prisma/client";
import dotenv from "dotenv";
import qs from "qs";
import cookieParser from "cookie-parser";
import axios from "axios";
import jwt from "jsonwebtoken";

dotenv.config(); //process.env.

const router = express.Router();

// 1. get/ 인가코드 받기
router.get("/kakao", async (req, res, next) => {
  const kakaoLoginURL = `https://kauth.kakao.com/oauth/authorize?client_id=${process.env.CLIENT_ID}&redirect_uri=${process.env.REDIRECT_URL}&response_type=code`;

  return res.redirect(kakaoLoginURL);
  //redirect_uri=callback 으로 동의받는 과정없이 바로 쿼리로 인가코드를 날리는데???
  //카카오계정 세션이 있어서 그런듯?
});

//2. post/인가코드 보내서 토큰받기
router.get("/kakao/callback", async (req, res, next) => {
  const code = req.query.code;
  console.log(code);
  //   console.log("인가코드:", code); //인가코드가 담겨있음

  const tokenRequest = await axios.post(
    "https://kauth.kakao.com/oauth/token",
    {
      grant_type: "authorization_code",
      client_id: "e32eea1d3f336e14e405fa4fba361307",
      redirect_uri: process.env.REDIRECT_URL,
      code,
      client_secret: "EnmTbf4vrow68BmqehsT1RPzCUFe8iKW",
    },
    {
      headers: {
        "content-type": "application/x-www-form-urlencoded;charset=utf-8",
      },
    }
  );
  //   console.log("토큰데이터:", tokenRequest.data);

  //3. 카카오사용자 이름, 이메일 통해 prisma users 안에 정보 저장하고 인증쿠키 발행하기
  const { access_token } = tokenRequest.data;
  console.log(access_token);
  const profileRequest = await axios({
    method: "GET",
    url: "https://kapi.kakao.com/v2/user/me",
    headers: {
      Authorization: `Bearer ${access_token}`,
    },
  });

  const { email, profile } = profileRequest.data.kakao_account;
  const name = profile.nickname;
  const users = await prisma.users.upsert({
    where: { email },
    update: { email },
    create: { email, password: "default" },
  });

  const userJWT = jwt.sign(
    { userId: users.userId },
    process.env.SESSION_SECRET_KEY
  );
  res.cookie("authorization", `Bearer ${userJWT}`);

  //   //엑세스 토큰 이용해 사용자 정보 가져오기
  //   const getData = await axios.post("https://kapi.kakao.com/v2/user/me", {
  //     headers: {
  //       "content-type": "application/x-www-form-urlencoded;charset=utf-8",
  //       Authorization: `Bearer ${tokenRequest.data.access_token}`,
  //     },
  //   });
  //   console.log("사용자정보:", getData.data);

  return res.status(200).json({ message: "로그인 성공" });
});

router.get("/kakao/logout", async (req, res, next) => {
  const kakaoLoginout = `https://kauth.kakao.com/oauth/logout?client_id=${process.env.CLIENT_ID}&logout_redirect_uri=http://localhost:3018/api/kakao/logout/callback`;

  return res.redirect(kakaoLoginout);
});

export default router;
