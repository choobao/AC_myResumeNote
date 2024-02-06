import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

export default function (user, n) {
  return jwt.sign({ userId: user.userId }, process.env.SESSION_SECRET_KEY, {
    expiresIn: n,
  });
}
