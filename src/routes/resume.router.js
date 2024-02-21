import express from "express";
import { prisma } from "../utils/prisma/index.js";
import authMiddleWare from "../middlewares/auth.middleware.js";
import { PostsController } from "../controllers/controller.js";
import { PostsService } from "../services/service.js";
import { PostRepository } from "../repositories/repository.js";

const router = express.Router();

//의존성 주입 작업
const postRepository = new PostRepository(prisma);
const postService = new PostsService(postRepository);
const postsController = new PostsController(postService);

// const postsController = new PostsController();

//내 이력서 생성 api
router.post("/", authMiddleWare, postsController.createResume);

//모든 이력서 목록 조회
router.get("/", postsController.getAllResume);

//나의 이력서 목록 조회
router.get("/my", authMiddleWare, postsController.getMyAllResume);

//나의 이력서 상세 조회
router.get("/my/:resumeId", authMiddleWare, postsController.getMyResume);

//나의 이력서 정보 수정
router.post("/my/:resumeId", authMiddleWare, postsController.postMyResume);

//나의 이력서 정보 삭제
router.delete("/my/:resumeId", authMiddleWare, postsController.deleteMyResume);

export default router;
