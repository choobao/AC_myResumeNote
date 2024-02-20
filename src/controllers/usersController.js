import { UsersService } from "../services/usersService.js";

export class UsersController {
  usersService = new UsersService();

  signUp = async (req, res, next) => {
    try {
    } catch (err) {
      next(err);
    }
  };

  signIn = async (req, res, next) => {
    try {
    } catch (err) {
      next(err);
    }
  };

  usersInfo = async (req, res, next) => {
    try {
    } catch (err) {
      next(err);
    }
  };
}
