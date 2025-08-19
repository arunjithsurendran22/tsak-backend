import { Model, Schema, model } from 'mongoose';
import { IUser } from './user-model';

const userSchema: Schema = new Schema<IUser>({
  name: { type: String, required: false },
  countryCode: { type: String, required: true },
  mobileNumber: { type: String, required: true },
  email :{ type: String, default: '' },
  referralCode: { type: String, required: false },
  referredBy: { type: String, default: '' },
  fcmTokens: { type: [String], default: [] },
  documentStatus: { type: Boolean, required: true, default: true },
  createdUser: { type: Schema.Types.ObjectId, default: null },
  createdAt: { type: Date, default: null },
  updatedUser: { type: Schema.Types.ObjectId, default: null },
  updatedAt: { type: Date, default: null },
});

// Middleware to auto-update `createdAt`
userSchema.pre<IUser>('save', function (next) {
  this.createdAt = new Date();
  next();
});

const USER: Model<IUser> = model<IUser>('cln_users', userSchema);

export default USER;
