import { jest } from "@jest/globals";
import { PostsService } from "../../../src/services/service.js";

// PostsRepository는 아래의 5개 메서드만 지원하고 있습니다.
let mockPostsRepository = {
  findAllResumes: jest.fn(),
  findResumeById: jest.fn(),
  findResumeByid: jest.fn(),
  createPost: jest.fn(),
  updateResume: jest.fn(),
  deleteResume: jest.fn(),
};

// postsService의 Repository를 Mock Repository로 의존성을 주입합니다.
let postsService = new PostsService(mockPostsRepository);

describe("Posts Service Unit Test", () => {
  // 각 test가 실행되기 전에 실행됩니다.
  beforeEach(() => {
    jest.resetAllMocks(); // 모든 Mock을 초기화합니다.
  });

  test("findAllResumes Method", async () => {
    const sampleResume = [
      {
        userId: 1,
        resumeId: 1,
        userInfoId: 1,
        title: "제목",
        status: "apply",
        createdAt: "생성 날짜",
        updatedAt: "업데이트 날짜",
      },
      {
        userId: 2,
        resumeId: 3,
        userInfoId: 2,
        title: "제목",
        status: "apply",
        createdAt: "생성 날짜",
        updatedAt: "업데이트 날짜",
      },
    ];

    mockPostsRepository.findAllResumes.mockReturnValue(sampleResume);

    const allResumes = await postsService.findAllResumes();

    expect(allResumes).toEqual(
      sampleResume.sort((a, b) => {
        return b.createdAt - a.createdAt;
      }),
    );

    expect(mockPostsRepository.findAllResumes).toHaveBeenCalledTimes(1);
  });

  test("deleteResume Method By Success", async () => {
    const sampleResume = {
      userId: 2,
      resumeId: 3,
      userInfoId: 2,
      title: "제목",
      content: "내용",
      status: "apply",
      createdAt: "생성 날짜",
      updatedAt: "업데이트 날짜",
    };

    mockPostsRepository.findResumeById.mockReturnValue(sampleResume);

    const deledtedResume = await postsService.deleteResume(2, 3);

    expect(mockPostsRepository.findResumeById).toHaveBeenCalledTimes(1);
    expect(mockPostsRepository.findResumeById).toHaveBeenCaleedWith(
      sampleResume.userId,
      sampleResume.resumeId,
    );

    expect(mockPostsRepository.deleteResume).toHaveBeenCalledTimes(1);
    expect(mockPostsRepository.deleteResume).toHaveBeenCaleedWith(
      sampleResume.userId,
      sampleResume.resumeId,
    );

    expect(deledtedResume).toEqual({
      userId: sampleResume.userId,
      resumeId: sampleResume.resumeId,
      userInfoId: sampleResume.userInfoId,
      title: sampleResume.title,
      content: sampleResume.content,
      status: sampleResume.status,
      createdAt: sampleResume.createdAt,
      updatedAt: sampleResume.updatedAt,
    });
  });

  test("deleteResume Method By Not Found Post Error", async () => {
    const sampleResume = null;
    mockPostsRepository.findResumeById.mockReturnValue(sampleResume);

    try {
      await postsService.deleteResume(232, 5354);
    } catch (err) {
      expect(mockPostsRepository.findResumeById).toHaveBeenCalledTimes(1);
      expect(mockPostsRepository.findResumeById).toHaveBeenCaleedWith(123123);

      expect(mockPostsRepository.deleteResume).toHaveBeenCalledTimes(0);

      expect(err.message).toEqual("존재하지 않는 게시글 입니다.");
    }
  });
});
