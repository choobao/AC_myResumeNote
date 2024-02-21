import { prisma } from "../utils/prisma/index.js";
import { Prisma } from "@prisma/client";

export class UsersRepository {
  // constructor(prisma) {
  //   this.prisma = prisma;
  // }

  checkExistingUser = async (email) => {
    const isExistUser = await prisma.users.findFirst({
      where: { email },
    });
    return isExistUser;
  };

  createUser = async (
    email,
    hashedPassword,
    name,
    age,
    gender,
    profileImage,
  ) => {
    const [user, userInfo] = await prisma.$transaction(
      async (tx) => {
        const createdUser = await tx.users.create({
          data: {
            email,
            password: hashedPassword,
          },
        });

        const createdUserInfo = await tx.userInfos.create({
          data: {
            userId: createdUser.userId,
            name,
            age,
            gender,
            profileImage,
          },
        });

        return [createdUser, createdUserInfo];
      },
      {
        isolationLevel: Prisma.TransactionIsolationLevel.ReadCommitted,
      },
    );

    return { user, userInfo };
  };

  userInfo = async ({ userId }) => {
    const user = await prisma.users.findFirst({
      where: { userId: +userId },
    });

    const userInfo = await prisma.userInfos.findFirst({
      where: { userId: +userId },
    });
    return [user, userInfo];
  };
}
