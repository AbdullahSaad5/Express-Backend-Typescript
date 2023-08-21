import mongoose from "mongoose";
import bcrypt from "bcrypt";

const vehicleSchema = new mongoose.Schema(
  {
    vin: {
      type: String,
      required: [true, "VIN is required"],
      unique: [true, "VIN must be unique"],
      minLength: [17, "VIN must be 17 characters"],
      maxLength: [17, "VIN must be 17 characters"],
    },
    make: {
      type: String,
      required: [true, "Make is required"],
    },
    model: {
      type: String,
      required: [true, "Model is required"],
    },
    year: {
      type: Number,
      required: [true, "Year is required"],
    },
    color: {
      type: String,
      required: [true, "Color is required"],
    },
    mileage: {
      type: Number,
      required: [true, "Mileage is required"],
    },
    price: {
      type: Number,
      required: [true, "Price is required"],
    },
    images: {
      type: [String],
    },
  },
  { timestamps: true }
);

export const Vehicle = mongoose.model("Vehicle", vehicleSchema);
