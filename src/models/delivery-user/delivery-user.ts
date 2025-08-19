import { Model, Schema, model } from 'mongoose';
import { IDeliveryUser } from './delivery-user-model';

const deliveryUser: Schema = new Schema<IDeliveryUser>(
  {
    documentStatus: { type: Boolean, required: true, default: true },
    email: { type: String, required: true },
    password: { type: String, required: true },
    createdUser: { type: Schema.Types.ObjectId, default: null },
    createdAt: { type: Date, default: null },
    updatedUser: { type: Schema.Types.ObjectId, default: null },
    updatedAt: { type: Date, default: null },
  },
  {
    timestamps: true,
  },
);

const DELIVERY_USER: Model<IDeliveryUser> = model<IDeliveryUser>('cln_delivery_users', deliveryUser);

export default DELIVERY_USER;