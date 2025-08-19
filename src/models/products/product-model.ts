import { Document, Types } from "mongoose";

export interface IProduct extends Document {
  _id: Types.ObjectId;
  name: string;
  description: string;
  price: number;
  images: string[];
  stock: number;
  documentStatus: boolean;
  createdUser: Types.ObjectId | null;
  createdAt: Date | null;
  updatedUser: Types.ObjectId | null;
  updatedAt: Date | null;
}
