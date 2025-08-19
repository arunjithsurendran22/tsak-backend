import { Document, Types } from 'mongoose';

export interface IUser extends Document {
  name: string;
  countryCode: string;
  mobileNumber: string;
  email :string;
  referralCode:string
  referredBy: string,
  fcmTokens: string[];    
  documentStatus: boolean;
  createdUser: Types.ObjectId | null;
  createdAt: Date | null;
  updatedUser: Types.ObjectId | null;
  updatedAt: Date | null;
}
