import { Router } from "express";
import AccommodationRouter from "./accommodation";



const mainRouter: Router = Router();

mainRouter.use("/accommodation", AccommodationRouter);

export default mainRouter;