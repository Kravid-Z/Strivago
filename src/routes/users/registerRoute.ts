import express, { Request, Response, NextFunction } from "express";
import UserModel from "../../models/user/userModel";

const registerRoute = express.Router();

registerRoute.post(
  "/",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const newUser = new UserModel(req.body);
      const { _id } = await newUser.save();

      res.status(201).send(_id);
    } catch (error) {
      next(error);
    }
  }
);

export default registerRoute;
