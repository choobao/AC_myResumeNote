import express from "express";
import { prisma } from "../utils/prisma/index.js";
import dotenv from "dotenv";
import axios from "axios";
import jwt from "jsonwebtoken";
import { PostsController } from "../controllers/controller.js";

dotenv.config(); //process.env.

const router = express.Router();

// 1. get/ 인가코드 받기
router.get("/kakao", kakaoStart);

//2. post/인가코드 보내서 토큰받기
router.get("/kakao/callback", getKaKaoToken);

router.get("/kakao/logout", async (req, res, next) => {
  const kakaoLoginout = `https://kauth.kakao.com/oauth/logout?client_id=${process.env.CLIENT_ID}&logout_redirect_uri=http://localhost:3018/api/kakao/logout/callback`;

  return res.redirect(kakaoLoginout);
});

export default router;
