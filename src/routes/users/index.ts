import express, { Request, Response, NextFunction } from "express";
import UserModel from "../../models/user/userModel";
import { jwtAuthMiddleware } from "../../common/utils/auth/index";

const usersRouter = express.Router();

usersRouter.get(
  "/",
  jwtAuthMiddleware,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      res.send(req.user);
    } catch (error) {
      next(error);
    }
  }
);

usersRouter.delete(
  "/",
  jwtAuthMiddleware,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      await req.user.deleteOne();
      res.status(204).send();
    } catch (error) {
      next(error);
    }
  }
);

usersRouter.put(
  "/",
  jwtAuthMiddleware,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      console.log(req.body);

      // req.user.name = req.body.name

      const updates = Object.keys(req.body);

      updates.forEach((u) => (req.user[u] = req.body[u]));

      await req.user.save();

      res.status(204).send();
    } catch (error) {
      next(error);
    }
  }
);

export default usersRouter;
