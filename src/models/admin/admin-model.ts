import { Document, Types } from 'mongoose';

export enum AdminTypes {
  SuperAdmin = 'SuperAdmin',
  Manager = 'Manager',
  Employee = 'Employee',
  DeliveryBoy = 'DeliveryBoy',
}

export interface IAdmin extends Document {
  _id: Types.ObjectId;
  documentStatus: boolean;
  adminUserName: string;
  adminUserType: AdminTypes;
  email: string;
  password: string;
  createdUser: Types.ObjectId | null;
  createdAt: Date | null;
  updatedUser: Types.ObjectId | null;
  updatedAt: Date | null;
}
