
import { Document, Types } from 'mongoose';

export interface IDeliveryUser extends Document {
  _id: Types.ObjectId;
  documentStatus: boolean;
  email: string;
  password: string;
  createdAt: Date | null;
  updatedAt: Date  | null;
  createdUser: Types.ObjectId | null;
  updatedUser:  Types.ObjectId | null;
}