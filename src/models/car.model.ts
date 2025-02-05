import mongoose, { Schema, type Document } from "mongoose"
import { v4 as uuidv4 } from "uuid"
import { IBrand } from "./brand.model"
import { IUser } from "./user.model"

export interface ICar extends Document {
  id: string
  name: string
  brand: IBrand["_id"]
  year: number
  price: number
  owner: IUser["_id"]
  renter: IUser["_id"]
}

const CarSchema: Schema = new Schema({
  id: { type: String, default: uuidv4, unique: true },
  name: { type: String, required: [true, "Name is required"] },
  brand: { type: Schema.Types.ObjectId, ref: "Brand", required: [true, "Brand is required"] },
  year: {
    type: Number,
    required: [true, "Year is required"],
    min: [1900, "Year must be at least 1900"],
    max: [new Date().getFullYear() + 1, "Year cannot be in the future"],
  },
  price: {
    type: Number,
    required: [true, "Price is required"],
    min: [0, "Price must be positive"],
  },
  owner: { type: Schema.Types.ObjectId, ref: "User" },
  renter: { type: Schema.Types.ObjectId, ref: "User" },
  },
  { versionKey: false, timestamps: true },
)

export default mongoose.model<ICar>("Car", CarSchema)

