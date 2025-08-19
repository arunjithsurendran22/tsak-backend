import { Document, Types } from "mongoose";

export interface IBanner extends Document {
  _id: Types.ObjectId;
  offerTitle: string; 
  title: string;
  description: string;
  images: string[];      // Array of image URLs
  buttonTitle: string;   // CTA button label
  documentStatus: boolean;
  createdUser: Types.ObjectId | null;
  createdAt: Date | null;
  updatedUser: Types.ObjectId | null;
  updatedAt: Date | null;
}