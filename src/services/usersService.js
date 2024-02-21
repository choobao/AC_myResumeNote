import { UsersRepository } from "../repositories/usersRepository.js";
import bcrypt from "bcrypt";
import JWT from "../utils/jwt.sign.js";

export class UsersService {
  // usersRepository = new UsersRepository();

  constructor(usersRepository) {
    this.usersRepository = usersRepository;
  }
  checkExistingUser = async (email) => {
    const isExistUser = await this.usersRepository.checkExistingUser(email);
    return isExistUser;
  };

  signUpUser = async (email, password, name, age, gender, profileImage) => {
    const hashedPassword = await bcrypt.hash(password, 10);

    const { user, userInfo } = await this.usersRepository.createUser(
      email,
      hashedPassword,
      name,
      age,
      gender,
      profileImage,
    );

    return { user, userInfo };
  };

  signInUser = async (email, password) => {
    //유저 아이디 값 없을시 에러메시지 => 프리즈마에서 찾아온 유저 이메일
    const user = await this.usersRepository.checkExistingUser(email);

    if (!user) {
      throw new Error("이메일이 존재하지않습니다.");
    }

    //비크립트로 비밀번호 확인 후 틀리면 에러메시지 => 찾아온 유저.비밀번호
    if (!(await bcrypt.compare(password, user.password))) {
      throw new Error("비밀번호가 일치하지 않습니다.");
    }
    //다 통과하면 jwt 발급하기.
    const accessToken = JWT(user, "12h");
    const refreshToken = JWT(user, "7d");
    //발급한 jwt를 쿠키로 리턴하기
    return [accessToken, refreshToken];
  };

  userInfo = async ({ userId }) => {
    const [user, userInfo] = await this.usersRepository.userInfo({
      userId,
    });

    return {
      userId: user.userId,
      email: user.email,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
      name: userInfo.name,
      age: userInfo.age,
      gender: userInfo.gender,
      profileImage: userInfo.profileImage,
    };
  };
}
