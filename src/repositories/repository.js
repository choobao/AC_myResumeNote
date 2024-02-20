import { prisma } from "../utils/prisma/index.js";

export class PostRepository {
  findAllresumes = async () => {
    const resumes = await prisma.resumes.findMany();
    return resumes;
  };

  createPost = async (userId, userInfoId, title, content) => {
    const createdResume = await prisma.resumes.create({
      data: {
        userId,
        userInfoId,
        title,
        content,
      },
    });

    findResumeById = async (userId, resumeId) => {
      const resume = await prisma.resumes.findFirst({
        where: { userId: +userId, resumeId: +resumeId },
      });
      return resume;
    };

    return createdResume;
  };
}
