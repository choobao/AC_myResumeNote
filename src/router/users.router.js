import express from "express";

const router = express.Router();

//회원가입 api
router.post("/sign-up", async (req, res, next) => {
  try {
  } catch (err) {
    next(err);
  }
});

export default router;
