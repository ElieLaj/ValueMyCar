import mongoose, { Schema, type Document } from "mongoose"
import { v4 as uuidv4 } from "uuid"

export interface ICar extends Document {
  id: string
  name: string
  brandId: string
  year: number
  price: number
}

const CarSchema: Schema = new Schema({
  id: { type: String, default: uuidv4, unique: true },
  name: { type: String, required: [true, "Name is required"] },
  brandId: { type: String, required: [true, "BrandId is required"] },
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
  },
  { versionKey: false, timestamps: true },
)

export default mongoose.model<ICar>("Car", CarSchema)

