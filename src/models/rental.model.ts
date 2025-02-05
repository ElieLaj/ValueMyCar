import mongoose, { Schema, type Document } from "mongoose"
import { v4 as uuidv4 } from "uuid"
import type { ICar } from "./car.model"
import type { IUser } from "./user.model"

export interface IRental extends Document {
  id: string
  car: ICar["_id"]
  renter: IUser["_id"]
  owner: IUser["_id"]
  startDate: Date
  endDate: Date
  totalPrice: number
  status: "pending" | "active" | "completed" | "cancelled"
}

const RentalSchema: Schema = new Schema({
  id: { type: String, default: uuidv4, unique: true },
  car: { type: Schema.Types.ObjectId, ref: "Car", required: true },
  renter: { type: Schema.Types.ObjectId, ref: "User", required: true },
  owner: { type: Schema.Types.ObjectId, ref: "User", required: true },
  startDate: { type: Date, required: true },
  endDate: { type: Date, required: true },
  totalPrice: { type: Number, required: true, min: 0 },
  status: {
    type: String,
    enum: ["pending", "active", "completed", "cancelled"],
    default: "pending",
  },
})

export default mongoose.model<IRental>("Rental", RentalSchema)

