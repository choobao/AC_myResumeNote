import express from "express";
import authMiddleWare from "../middlewares/auth.middleware.js";
import { UsersController } from "../controllers/usersController.js";

const router = express.Router();

const usersController = new UsersController();

//회원가입 api
router.post("/sign-up", usersController.signUp);

//로그인 api
router.post("/sign-in", usersController.signIn);

//내 정보조회 api
router.get("/users", authMiddleWare, usersController.usersInfo);

export default router;
