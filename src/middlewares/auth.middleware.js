import { prisma } from "../utils/prisma/index.js";

//쿠키가 아닌 세션을 통해 로그인 토큰 확인하기
//jwt 안씁니다.
export default async function (req, res, next) {
  try {
    const { userId } = req.session;
    if (!userId) throw new Error("로그인이 필요합니다.");

    const user = await prisma.users.findFirst({
      where: { userId: +userId },
    });
    if (!user) {
      throw new Error("토큰 사용자가 존재하지않습니다.");
    }

    req.user = user;
    next();
  } catch (err) {
    return res.status(400).json({ message: err.message });
  }
}
