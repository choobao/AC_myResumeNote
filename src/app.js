import express from "express";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import UsersRouter from "./router/users.router.js";
import errorMiddleware from "./middlewares/error.handling.middleware.js";
import ResumeRouter from "./router/resume.router.js";

dotenv.config(); //process.env.(변수이름)

const app = express();
const PORT = 3018;

app.use(express.json());
app.use(cookieParser());
app.use("/api", [UsersRouter, ResumeRouter]);

app.use(errorMiddleware);

app.listen(PORT, () => {
  console.log(PORT, "포트로 서버가 열렸습니다.");
});
