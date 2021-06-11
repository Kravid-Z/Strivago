import { Router } from "express";
import {
  getAccommodation,
  //getAccommodationById,
  addAccommodation,
  //updateAccommodation,
  //deleteAccommodation,
} from "../../controllers/accommodation/index";

const accommodationRouter: Router = Router();

accommodationRouter.get("/", getAccommodation);

//accommodationRouter.get("//:id", getAccommodationById);

accommodationRouter.post("/", addAccommodation);

//accommodationRouter.put("//:id", updateAccommodation);

//accommodationRouter.delete("//:id", deleteAccommodation);

export default accommodationRouter;
