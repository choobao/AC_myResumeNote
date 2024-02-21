// import { prisma } from "../utils/prisma/index.js";

export class PostRepository {
  constructor(prisma) {
    this.prisma = prisma;
  }

  findAllResumes = async () => {
    const resumes = await this.prisma.resumes.findMany();
    return resumes;
  };

  createPost = async (userId, userInfoId, title, content) => {
    const createdResume = await this.prisma.resumes.create({
      data: {
        userId,
        userInfoId,
        title,
        content,
      },
    });
    return createdResume;
  };

  findResumeById = async (userId, resumeId) => {
    console.log("유저 아이디:", userId, resumeId);
    const resume = await this.prisma.resumes.findFirst({
      where: { userId: +userId, resumeId: +resumeId },
    });
    return resume;
  };

  findResumeByid = async (userId) => {
    console.log("유저 아이디:", userId);
    const resume = await this.prisma.resumes.findMany({
      where: { userId: +userId },
    });
    return resume;
  };

  updateResume = async (userId, resumeId, title, content) => {
    const resume = await this.prisma.resumes.update({
      where: {
        userId: +userId,
        resumeId: +resumeId,
      },
      data: {
        title,
        content,
      },
    });
    return resume;
  };

  deleteResume = async (userId, resumeId) => {
    const deletedResume = await this.prisma.resumes.delete({
      where: {
        userId: +userId,
        resumeId: +resumeId,
      },
    });
    return deletedResume;
  };
}
