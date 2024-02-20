import express from "express";
import ResumeRouter from "./resume.router.js";

const router = express.Router();

router.use("/resumes/", ResumeRouter);

export default router;
