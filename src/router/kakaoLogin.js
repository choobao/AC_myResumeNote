import express from "express";
import { prisma } from "../utils/prisma/index.js";
import { Prisma } from "@prisma/client";
import dotenv from "dotenv";
import qs from "qs";
import cookieParser from "cookie-parser";
import axios from "axios";

dotenv.config(); //process.env.

const router = express.Router();

//★★★★★★기능 안되어서 1차 제출 후 수정해서 제출하겠습니다★★★★★★//

// // CLIENT_ID = 'e32eea1d3f336e14e405fa4fba361307'
// // CLIENT_SECRET = 'EnmTbf4vrow68BmqehsT1RPzCUFe8iKW'
// // REDIRECT_URL = 'http://localhost:3018/auth/kakao/callback'
// //  EnmTbf4vrow68BmqehsT1RPzCUFe8iKW 클라이언트 secret key

// // 1. get/카카오로그인 페이지 연결
// router.get("/kakao", async (req, res, next) => {
//   const kakaoLoginURL = `https://kauth.kakao.com/oauth/authorize?client_id=${process.env.CLIENT_ID}&redirect_uri=${process.env.REDIRECT_URL}&response_type=code`;
//   console.log(kakaoLoginURL);

//   useEffect(() => {
//     fetch("data/allGroup.json", {
//       headers: {
//         Accept: "application / json",
//       },
//       method: "GET",
//     })
//       .then((res) => res.json())
//       .then((data) => {
//         setAllGroupData(data.data.searchedList);
//         setTotalGroup(data.data.total);
//       });
//   });

//   const response = await fetch(kakaoLoginURL);
//   const data = await response.json();
//   console.log(data);

//   return res.status(200).json({ message: "dd" });
//   //   return res.redirect(kakaoLoginURL);
// });

// router.get("/kakao/callback", async (req, res) => {
//   console.log(req.cookies);
//   const code = req.query.code;

//   console.log({
//     grant_type: "authorization_code",
//     client_id: process.env.CLIENT_ID,
//     redirect_uri: process.env.REDIRECT_URL,
//     code,
//   });

//   return res.status(200).json({ message: "dd" });
// });

export default router;
