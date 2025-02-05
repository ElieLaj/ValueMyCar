import mongoose, { Schema, type Document } from "mongoose"
import { v4 as uuidv4 } from "uuid"
import bcrypt from "bcrypt"
import { ICar } from "./car.model"
import { IRental } from "./rental.model"

export enum UserRole {
  USER = "user",
  ADMIN = "admin",
  SUPERADMIN = "superadmin",
}

export interface IUser extends Document {
  id: string
  email: string
  password: string
  role: UserRole
  comparePassword(candidatePassword: string): Promise<boolean>
  cars: ICar["_id"]
  rents: IRental["_id"]
}

const UserSchema: Schema = new Schema({
  id: { type: String, default: uuidv4, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: Object.values(UserRole), default: UserRole.USER },
  cars: [{ type: Schema.Types.ObjectId, ref: "Car" }],
  rents: [{ type: Schema.Types.ObjectId, ref: "Rental" }],
})

UserSchema.pre<IUser>("save", async function (next) {
  if (!this.isModified("password")) return next()

  const salt = await bcrypt.genSalt(10)
  this.password = await bcrypt.hash(this.password, salt)
  next()
})

UserSchema.methods.comparePassword = async function (candidatePassword: string): Promise<boolean> {
  return bcrypt.compare(candidatePassword, this.password)
}

export default mongoose.model<IUser>("User", UserSchema)

