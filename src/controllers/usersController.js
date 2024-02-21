import { UsersService } from "../services/usersService.js";

export class UsersController {
  usersService = new UsersService();
  // constructor(usersService) {
  //   this.usersService = usersService;
  // }

  signUp = async (req, res, next) => {
    try {
      const {
        email,
        password,
        passwordCheck,
        name,
        age,
        gender,
        profileImage,
      } = req.body;

      const isExistUser = await this.usersService.checkExistingUser(email);

      if (isExistUser)
        return res
          .status(409)
          .json({ message: "이미 존재하는 이메일 입니다." });

      if (password !== passwordCheck)
        return res
          .status(400)
          .json({ message: "입력하신 비밀번호를 다시 확인해주십시오." });

      if (password.length < 6)
        return res.status(400).json({ message: "비밀번호가 너무 짧습니다." });

      const { user, userInfo } = await this.usersService.signUpUser(
        email,
        password,
        name,
        age,
        gender,
        profileImage,
      );
      return res.status(201).json({ message: "회원가입을 축하드립니다." });
    } catch (err) {
      next(err);
    }
  };

  signIn = async (req, res, next) => {
    try {
      const { email, password } = req.body;

      const user = await this.usersService.signInUser(email, password);

      console.log(user);
      //일치하면 쿠키 내보내기
      res.cookie("authorization", `Bearer ${user[0]}`);
      res.cookie("refreshToken", `Bearer ${user[1]}`);
      return res.status(201).json({ message: "로그인 성공~!" });
    } catch (err) {
      next(err);
    }
  };

  usersInfo = async (req, res, next) => {
    try {
      const { userId } = req.user;

      const user = await this.usersService.userInfo({
        userId,
      });

      return res.status(200).json({ data: user });
    } catch (err) {
      next(err);
    }
  };
}
