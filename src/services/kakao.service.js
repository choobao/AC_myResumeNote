const getKakao = async (tokenRequest) => {
  await axios.post(
    "https://kauth.kakao.com/oauth/token",
    {
      grant_type: "authorization_code",
      client_id: "e32eea1d3f336e14e405fa4fba361307",
      redirect_uri: process.env.REDIRECT_URL,
      code,
      client_secret: "EnmTbf4vrow68BmqehsT1RPzCUFe8iKW",
    },
    {
      headers: {
        "content-type": "application/x-www-form-urlencoded;charset=utf-8",
      },
    },
  );

  //3. 카카오사용자 이름, 이메일 통해 prisma users 안에 정보 저장하고 인증쿠키 발행하기
  const { access_token } = tokenRequest.data;
  console.log(access_token);
  const profileRequest = await axios({
    method: "GET",
    url: "https://kapi.kakao.com/v2/user/me",
    headers: {
      Authorization: `Bearer ${access_token}`,
    },
  });

  const { email, profile } = profileRequest.data.kakao_account;
  const name = profile.nickname;
  const users = await prisma.users.upsert({
    where: { email },
    update: { email },
    create: { email, password: "default" },
  });

  const userJWT = jwt.sign(
    { userId: users.userId },
    process.env.SESSION_SECRET_KEY,
  );
  res.cookie("authorization", `Bearer ${userJWT}`);
};
