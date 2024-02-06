import express from "express";
import authMiddleWare from "../middlewares/auth.middleware.js";
import { prisma } from "../utils/prisma/index.js";
import { Prisma } from "@prisma/client";

const router = express.Router();

//내 이력서 생성 api
router.post("/resumes", authMiddleWare, async (req, res, next) => {
  try {
    const { userId, userInfoId } = req.user;

    const { title, content } = req.body; //status는 자동으로 apply로 등록

    const resume = await prisma.resumes.create({
      data: {
        userId: +userId,
        userInfoId: +userInfoId,
        title: title,
        content: content,
      },
    });
    return res.status(201).json({ data: resume });
  } catch (err) {
    next(err);
  }
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

//모든 이력서 목록 조회
router.get("/resumes", async (req, res, next) => {
  const { orderKey, orderValue } = req.query;
  console.log(req.query);
  console.log(req.query.orderKey);

  const Value = orderValue.toLowerCase() === "asc" ? "asc" : "desc";

  const resumes = await prisma.resumes.findMany({
    where: { userId: +orderKey },
    include: {
      userId: true,
      resumeId: true,
      status: true,
      title: true,
      createdAt: true,
      updatedAt: true,
      userInfos: {
        select: {
          name: true,
        },
      },
      //상세조회에서 content 조회가능하도록
    },
    orderBy: {
      createdAt: Value,
    },
  });
  return res.status(201).json({ data: resumes });
});

//나의 이력서 상세 조회
router.get("/resumes/:resumeId", authMiddleWare, async (req, res, next) => {
  const { userId } = req.user;
  const { resumeId } = req.params;

  const myResume = await prisma.resumes.findFirst({
    where: { resumeId: +resumeId },
  });
  if (!myResume)
    return res
      .status(404)
      .json({ message: "사용자정보 또는 이력서 조회에 실패했습니다." });
  const resume = await prisma.resumes.findFirst({
    where: {
      userId: +userId,
      resumeId: +resumeId,
    },
    include: {
      resumeId: true,
      userId: true,
      status: true,
      title: true,
      content: true,
      createdAt: true,
      updatedAt: true,
      Users: {
        select: {
          email: true,
        },
      },
    },
  });
  return res.status(201).json({ data: resume });
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
});

//나의 이력서 정보 삭제
router.delete("/resumes/:resumeId", authMiddleWare, async (req, res, next) => {
  try {
    const { userId } = req.user;
    const { resumeId } = req.params;

    //삭제할 이력서 선택
    const myResume = await prisma.resumes.findFirst({
      where: { resumeId: +resumeId },
    });
    if (!myResume)
      return res
        .status(404)
        .json({ message: "사용자정보 또는 이력서 조회에 실패했습니다." });

    await prisma.resumes.delete({
      where: {
        userId: +userId,
        resumeId: +resumeId,
      },
    });
    return res
      .status(200)
      .json({ message: "이력서가 성공적으로 삭제되었습니다." });
  } catch (err) {
    next(err);
  }
});
export default router;
