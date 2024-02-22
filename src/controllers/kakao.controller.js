// 1. get/ 인가코드 받기
const kakaoStart = async (req, res, next) => {
  const kakaoLoginURL = `https://kauth.kakao.com/oauth/authorize?client_id=${process.env.CLIENT_ID}&redirect_uri=${process.env.REDIRECT_URL}&response_type=code`;

  return res.redirect(kakaoLoginURL);
};

//2. post/인가코드 보내서 토큰받기
const getKaKaoToken = async (req, res, next) => {
  const code = req.query.code;

  return res.status(200).json({ message: "로그인 성공" });
};

export { kakaoStart, getKaKaoToken };
