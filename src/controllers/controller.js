import { PostsService } from "../services/service.js";

// Post의 컨트롤러(Controller)역할을 하는 클래스
export class PostsController {
  postsService = new PostsService(); // Post 서비스를 클래스를 컨트롤러 클래스의 멤버 변수로 할당합니다.

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
      const resumes = await this.postsService.findAllresumes();

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
      const resumeId = req.params;

      return res.status(200).json({ data: posts });
    } catch (err) {
      next(err);
    }
  };

  postMyResume = async (req, res, next) => {
    try {
      return res.status(200).json({ data: posts });
    } catch (err) {
      next(err);
    }
  };

  deleteMyResume = async (req, res, next) => {
    try {
      return res.status(200).json({ data: posts });
    } catch (err) {
      next(err);
    }
  };

  //   getPosts = async (req, res, next) => {
  //     try {
  //       // 서비스 계층에 구현된 findAllPosts 로직을 실행합니다.
  //       const posts = await this.postsService.findAllPosts();

  //       return res.status(200).json({ data: posts });
  //     } catch (err) {
  //       next(err);
  //     }
  //   };

  //   createPost = async (req, res, next) => {
  //     try {
  //       const { nickname, password, title, content } = req.body;

  //       // 서비스 계층에 구현된 createPost 로직을 실행합니다.
  //       const createdPost = await this.postsService.createPost(
  //         nickname,
  //         password,
  //         title,
  //         content,
  //       );

  //       return res.status(201).json({ data: createdPost });
  //     } catch (err) {
  //       next(err);
  //     }
  //   };
}
