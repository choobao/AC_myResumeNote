import express from "express";
import authMiddleWare from "../middlewares/auth.middleware.js";
import { PostsController } from "../controllers/controller.js";

const router = express.Router();

const postsController = new PostsController();

//내 이력서 생성 api
router.post("/", authMiddleWare, postsController.createResume);

//모든 이력서 목록 조회
router.get("/", postsController.getAllResume);

//나의 이력서 목록 조회
router.get("/", authMiddleWare, postsController.getMyAllResume);

//나의 이력서 상세 조회
router.get("/:resumeId", authMiddleWare, postsController.getMyResume);

//나의 이력서 정보 수정
router.post("/:resumeId", authMiddleWare, postsController.postMyResume);

//나의 이력서 정보 삭제
router.delete("/:resumeId", authMiddleWare, postsController.deleteMyResume);

export default router;
