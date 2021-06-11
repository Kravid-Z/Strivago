import { Response, Request } from "express";
import { IAccommodation } from "../../types/index";
import Accommodation from "../../models/accommodation/accommodationModel";

export const getAccommodation = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const accommodations: IAccommodation[] = await Accommodation.find();
    res.status(200).json({ accommodations });
  } catch (error) {
    throw error;
    console.log(error);
  }
};

export const addAccommodation = async (
  req: Request,
  res: Response,
  next: any
): Promise<void> => {
  try {
    const body = req.body as Pick<
      IAccommodation,
      "name" | "description" | "maxGuests" | "city"
    >;

    const accommodation: IAccommodation = new Accommodation({
      name: body.name,
      description: body.description,
      maxGuests: body.maxGuests,
      city: body.city,
    });

    const newAccommodation: IAccommodation = await accommodation.save();
    const allAccommodations: IAccommodation[] = await Accommodation.find();

    res.status(201).json({
      message: "Accommodation added",
      accommodation: newAccommodation,
    });
  } catch (error) {
    throw error;
    console.log(error);
    next(error);
  }
};
