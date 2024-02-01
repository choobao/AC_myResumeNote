import { prisma } from "../utils/prisma/index.js";
import jwt from "jsonwebtoken";

export default async function (req, res, next) {
  try {
    const { authorization } = req.cookies;

    if (!authorization)
      throw new Error("요청한 사용자의 토큰이 존재하지 않습니다.");

    const [tokenType, token] = authorization.split(" ");

    if (tokenType !== "Bearer")
      throw new Error("토큰 타입이 Bearer 형식이 아닙니당");
    //★jwt 유효기간이 지난경우 if문 구축(미완성)

    const decodedToken = jwt.verify(token, "custom-secret-key");
    const userId = decodedToken.userId;

    const user = await prisma.users.findFirst({
      where: { userId: +userId },
      select: {
        userId: true,
        userInfos: {
          select: {
            userInfoId: true,
          },
        },
      },
    });

    user.userInfoId = user.userInfos.userInfoId;

    if (!user) {
      throw new Error("토큰 사용자가 존재하지않습니다.");
    }
    console.log(user);
    req.user = user;
    next();
  } catch (err) {
    if ((err.name = "jwt expired"))
      return res.status(401).json({ message: "토큰이 만료되었습니다." });

    return res.status(400).json({ message: err.message });
  }
}
