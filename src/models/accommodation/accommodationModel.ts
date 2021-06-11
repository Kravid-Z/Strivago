import { Schema, model } from "mongoose";
import { IAccommodation } from "../../types";

const accommodationSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    maxGuests: {
      type: Number,
      required: true,
    },
    city: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

export default model<IAccommodation>("Accommodation", accommodationSchema);
