import mongoose, { Schema, Document } from 'mongoose';
import { v4 as uuidv4 } from 'uuid';
import { ICar } from './car.model';

export interface IBrand extends Document {
  id: string;
  name: string;
  country: string;
  cars: ICar["_id"][];
}

const BrandSchema: Schema = new Schema({
    id: { type: String, default: uuidv4, unique: true },
    name: { type: String, required: [true, 'Name is required'], unique: true },
    country: { type: String, required: [true, 'Country is required'] },
    cars: [{ type: Schema.Types.ObjectId, ref: "Car" }],
},
    { versionKey: false, timestamps: true }
);

export default mongoose.model<IBrand>('Brand', BrandSchema);
