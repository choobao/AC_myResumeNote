import express from "express";
import authMiddleWare from "../middlewares/auth.middleware.js";
import { prisma } from "../utils/prisma/index.js";
import { Prisma } from "@prisma/client";

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

//나의 이력서 정보 수정
router.post("/resumes/:resumeId", authMiddleWare, async (req, res, next) => {
  const { userId } = req.user;
  const { resumeId } = req.params;
  const { title, content } = req.body;

  //수정할 이력서 선택
  const myResume = await prisma.resumes.findFirst({
    where: { resumeId: +resumeId },
  });
  if (!myResume)
    return res
      .status(404)
      .json({ message: "사용자정보 또는 이력서 조회에 실패했습니다." });

  await prisma.resumes.update({
    where: {
      userId: +userId,
      resumeId: +resumeId,
    },
    data: {
      title: title,
      content: content,
    },
  });
  return res
    .status(200)
    .json({ message: "이력서가 성공적으로 수정되었습니다." });
  //이력서필드를 req정보를 바탕으로 업데이트, userID가 일치하는것 확인 두가지를 트랜잭션 사용
  //   await prisma.$transaction(
  //     async (tx) => {
  //       await tx.resumes.update({
  //         data: {
  //             title, content
  //         },
  //         where: {
  //           userId: +userId,

  //         },
  //       });
  //     },
  //     {
  //       isolationLevel: Prisma.TransactionIsolationLevel.ReadCommitted,
  //     }
  //   );
});
export default router;
