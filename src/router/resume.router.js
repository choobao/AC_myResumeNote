import express from "express";
import authMiddleWare from "../middlewares/auth.middleware.js";
import { prisma } from "../utils/prisma/index.js";

const router = express.Router();

//내 이력서 생성 api
router.post("/resumes", authMiddleWare, async (req, res, next) => {
  const { userId } = req.user;
  const { title, content } = req.body; //status는 자동으로 apply로 등록

  const resume = await prisma.resumes.create({
    data: {
      userId: +userId,
      title: title,
      content: content,
    },
  });
  return res.status(201).json({ data: resume });
});

//나의 이력서 목록 조회
router.get("/resumes", authMiddleWare, async (req, res, next) => {
  const { userId } = req.user;
  //로그인 된 사용자의 아이디를 프리즈마의 users 필드와 비교해
  //본인이 쓴 이력서만 내림차순으로 조회
  const resumes = await prisma.resumes.findMany({
    where: { userId: +userId },
    select: {
      resumeId: true,
      title: true,
      createdAt: true,
      updatedAt: true,
      //상세조회에서 content 조회가능하도록
    },
    orderBy: {
      createdAt: "desc",
    },
  });
  return res.status(201).json({ data: resumes });
});

export default router;
