import { PostRepository } from "../repositories/repository.js";

export class PostsService {
  postRepository = new PostRepository();

  //이력서 생성
  createPost = async (userId, userInfoId, title, content) => {
    const resumes = await this.postRepository.createPost(
      userId,
      userInfoId,
      title,
      content,
    );

    return {
      userId: +resumes.userId,
      userInfoId: +resumes.userInfoId,
      title: resumes.title,
      content: resumes.content,
      createdAt: resumes.createdAt,
      updatedAt: resumes.updatedAt,
    };
  };

  //모든 이력서 조회
  findAllresumes = async () => {
    const resumes = await this.postRepository.findAllresumes();

    resumes.sort((a, b) => {
      return b.createdAt - a.createdAt;
    });

    return resumes.map((resume) => {
      return {
        userId: resume.userId,
        resumeId: resume.resumeId,
        userInfoId: resume.userInfoId,
        title: resume.title,
        status: resume.status,
        createdAt: resume.createdAt,
        updatedAt: resume.updatedAt,
      };
    });
  };

  //나의 이력서 상세 조회
  findResumeById = async (userId, resumeId) => {
    const resume = await this.postRepository.findResumeById(userId, resumeId);

    return {
      userId: resume.userId,
      resumeId: resume.resumeId,
      userInfoId: resume.userInfoId,
      title: resume.title,
      status: resume.status,
      content: resume.content,
      createdAt: resume.createdAt,
      updatedAt: resume.updatedAt,
    };
  };
}
