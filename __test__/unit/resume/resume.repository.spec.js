import { jest } from "@jest/globals";
import { PostRepository } from "../../../src/repositories/repository.js";

let mockPrisma = {
  resumes: {
    findMany: jest.fn(),
    findFirst: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  },
};

let postsRepository = new PostRepository(mockPrisma);

describe("Posts Repository Unit Test", () => {
  // 각 test가 실행되기 전에 실행됩니다.
  beforeEach(() => {
    jest.resetAllMocks(); // 모든 Mock을 초기화합니다.
  });

  test("findAllResumes Method", async () => {
    const mockReturn = "findMany String";
    mockPrisma.resumes.findMany.mockReturnValue(mockReturn);

    const resumes = await postsRepository.findAllResumes();

    //mockReturn과 posts는 최종적으로 같은값인지 확인
    expect(resumes).toBe(mockReturn);

    //findMany함수는 1번만 호출된다.
    expect(postsRepository.prisma.resumes.findMany).toHaveBeenCalledTimes(1);
  });

  test("createPost Method", async () => {
    // 최종적으로 createPost 메서드의 반환값 설정
    const mockReturn = "create Resume Return String";
    mockPrisma.resumes.create.mockReturnValue(mockReturn);

    //createPost 메서드를 실험하기 위한 데이터 전달
    const createResumeParams = {
      userId: "createResumeUserId",
      userInfoId: "createResumeuserInfoId",
      title: "createResumeTitle",
      content: "createResumeContent",
    };

    const createResumeData = await postsRepository.createPost(
      createResumeParams.userId,
      createResumeParams.userInfoId,
      createResumeParams.title,
      createResumeParams.content,
    );

    //create 메서드의 반환값은 return 값과 동일하다.
    expect(createResumeData).toEqual(mockReturn);

    // create 메서드는 한번만 실행된다.
    expect(mockPrisma.resumes.create).toHaveBeenCalledTimes(1);

    //createPost 메서드를 실행할때, create 메서드는 전달한 데이터가 순서대로 전달된다.
    expect(mockPrisma.resumes.create).toHaveBeenCalledWith({
      data: {
        userId: createResumeParams.userId,
        userInfoId: createResumeParams.userInfoId,
        title: createResumeParams.title,
        content: createResumeParams.content,
      },
    });
  });

  test("findResumeById Method", async () => {
    const mockReturn = "findFirst String";
    mockPrisma.resumes.findFirst.mockReturnValue(mockReturn);

    const findResume = {
      userId: "findResumeUserId",
      resumeId: "findResumeResumeId",
    };

    const resumes = await postsRepository.findResumeById(
      findResume.userId,
      findResume.resumeId,
    );

    //mockReturn과 posts는 최종적으로 같은값인지 확인
    expect(resumes).toBe(mockReturn);

    //함수는 1번만 호출된다.
    expect(postsRepository.prisma.resumes.findFirst).toHaveBeenCalledTimes(1);
  });

  test("findResumeByid Method", async () => {
    const mockReturn = "findMany String";
    mockPrisma.resumes.findMany.mockReturnValue(mockReturn);

    const findResume = {
      userId: "findResumeUserId",
    };

    const resumes = await postsRepository.findResumeByid(findResume.userId);

    //mockReturn과 posts는 최종적으로 같은값인지 확인
    expect(resumes).toEqual(mockReturn);

    //함수는 1번만 호출된다.
    expect(postsRepository.prisma.resumes.findMany).toHaveBeenCalledTimes(1);
  });

  test("updateResume Method", async () => {
    // 최종적으로 updateResume 메서드의 반환값 설정
    const mockReturn = "update Resume Return String";
    mockPrisma.resumes.update.mockReturnValue(mockReturn);

    // updateResume 메서드를 실험하기 위한 데이터 전달
    const updateResumeParams = {
      userId: "updateResumeUserId",
      resumeId: "updateResumeId",
      title: "updateResumeTitle",
      content: "updateResumeContent",
    };

    const updatedResumeData = await postsRepository.updateResume(
      updateResumeParams.userId,
      updateResumeParams.resumeId,
      updateResumeParams.title,
      updateResumeParams.content,
    );

    // update 메서드의 반환값은 return 값과 동일하다.
    expect(updatedResumeData).toEqual(mockReturn);

    // update 메서드는 한 번만 실행된다.
    expect(mockPrisma.resumes.update).toHaveBeenCalledTimes(1);

    // updateResume 메서드를 실행할 때, update 메서드는 전달한 데이터가 순서대로 전달된다.
    expect(mockPrisma.resumes.update).toHaveBeenCalledWith({
      where: {
        userId: +updateResumeParams.userId,
        resumeId: +updateResumeParams.resumeId,
      },
      data: {
        title: updateResumeParams.title,
        content: updateResumeParams.content,
      },
    });
  });

  test("deleteResume Method", async () => {
    // 최종적으로 deleteResume 메서드의 반환값 설정
    const mockReturn = "delete Resume Return String";
    mockPrisma.resumes.delete.mockReturnValue(mockReturn);

    // deleteResume 메서드를 실험하기 위한 데이터 전달
    const deleteResumeParams = {
      userId: "deleteResumeUserId",
      resumeId: "deleteResumeId",
    };

    const deletedResumeData = await postsRepository.deleteResume(
      deleteResumeParams.userId,
      deleteResumeParams.resumeId,
    );

    // delete 메서드의 반환값은 return 값과 동일하다.
    expect(deletedResumeData).toEqual(mockReturn);

    // delete 메서드는 한 번만 실행된다.
    expect(mockPrisma.resumes.delete).toHaveBeenCalledTimes(1);
  });
});
