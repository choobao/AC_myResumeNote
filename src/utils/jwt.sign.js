import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import { prisma } from "../utils/prisma/index.js";

dotenv.config();

export default async function (user, n) {
  return jwt.sign({ userId: user.userId }, process.env.SESSION_SECRET_KEY, {
    expiresIn: n,
  });
}
