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
  findAllResumes = async () => {
    const resumes = await this.postRepository.findAllResumes();

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
  findResumeByParams = async (userId, resumeId) => {
    const resume = await this.postRepository.findResumeByParams(
      userId,
      resumeId,
    );

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

  //나의 이력서 목록 조회
  findResumeByid = async (userId) => {
    const resumes = await this.postRepository.findResumeByid(userId);
    console.log(userId);
    return {
      userId: +resumes.userId,
      userInfoId: +resumes.userInfoId,
      title: resumes.title,
      status: resumes.status,
      createdAt: resumes.createdAt,
      updatedAt: resumes.updatedAt,
    };
  };

  //나의 이력서 정보 수정
  updateResume = async (userId, resumeId, title, content) => {
    const resume = await this.postRepository.findResumeById(userId, resumeId);
    if (!resume) throw new Error("존재하지 않는 게시글 입니다.");

    const updatedResume = await this.postRepository.updateResume(
      userId,
      resumeId,
      title,
      content,
    );

    return {
      userId: +updatedResume.userId,
      userInfoId: +updatedResume.userInfoId,
      title: updatedResume.title,
      content: updatedResume.content,
      createdAt: updatedResume.createdAt,
      updatedAt: updatedResume.updatedAt,
    };
  };

  //내 이력서 삭제
  deleteResume = async (userId, resumeId) => {
    const resume = await this.postRepository.findResumeById(userId, resumeId);
    if (!resume) throw new Error("존재하지 않는 게시글 입니다.");

    await this.postRepository.deleteResume(resumeId, userId);

    return {
      userId: +resume.userId,
      userInfoId: +resume.userInfoId,
      title: resume.title,
      content: resume.content,
      createdAt: resume.createdAt,
      updatedAt: resume.updatedAt,
    };
  };
}
