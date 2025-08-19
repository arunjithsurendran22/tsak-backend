import { Document, Types } from 'mongoose';

export interface ICategory extends Document {
  _id: Types.ObjectId;
  documentStatus: boolean;
  categoryName: string;
  createdUser: Types.ObjectId | null;
  createdAt: Date | null;
  updatedUser: Types.ObjectId | null;
  updatedAt: Date | null;
}
