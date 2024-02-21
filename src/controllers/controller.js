import { PostsService } from "../services/service.js";

// Post의 컨트롤러(Controller)역할을 하는 클래스
export class PostsController {
  // postsService = new PostsService(); // Post 서비스를 클래스를 컨트롤러 클래스의 멤버 변수로 할당합니다.

  constructor(postsService) {
    this.postsService = postsService;
  }

  createResume = async (req, res, next) => {
    try {
      const { userId, userInfoId } = req.user;
      const { title, content } = req.body;

      const createdResume = await this.postsService.createPost(
        userId,
        userInfoId,
        title,
        content,
      );
      return res.status(201).json({ data: createdResume });
    } catch (err) {
      next(err);
    }
  };

  //모든 이력서 목록 조회
  getAllResume = async (req, res, next) => {
    try {
      const resumes = await this.postsService.findAllResumes();

      return res.status(200).json({ data: resumes });
    } catch (err) {
      next(err);
    }
  };

  //나의 이력서 상세 조회
  getMyResume = async (req, res, next) => {
    try {
      const { userId } = req.user;
      const { resumeId } = req.params;

      const resumes = await this.postsService.findResumeById(userId, resumeId);
      return res.status(200).json({ data: resumes });
    } catch (err) {
      next(err);
    }
  };

  //나의 이력서 목록 조회
  getMyAllResume = async (req, res, next) => {
    try {
      const { userId } = req.user;

      const resumes = await this.postsService.findResumeByid(userId);

      return res.status(200).json({ data: resumes });
    } catch (err) {
      next(err);
    }
  };

  //나의 이력서 정보 수정
  postMyResume = async (req, res, next) => {
    try {
      const { userId } = req.user;
      const { resumeId } = req.params;
      const { title, content } = req.body;

      const resume = await this.postsService.updateResume(
        userId,
        resumeId,
        title,
        content,
      );
      return res.status(201).json({ data: resume });
    } catch (err) {
      next(err);
    }
  };

  deleteMyResume = async (req, res, next) => {
    try {
      const { userId } = req.user;
      const { resumeId } = req.params;

      const resume = await this.postsService.deleteResume(userId, resumeId);
      return res.status(201).json({ data: resume });
    } catch (err) {
      next(err);
    }
  };
}
