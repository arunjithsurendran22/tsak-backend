import { Model, Schema, model } from 'mongoose';
import { IAdmin, AdminTypes } from './admin-model';

const adminSchema: Schema<IAdmin> = new Schema<IAdmin>({
  documentStatus: { type: Boolean, required: true, default: true },
  adminUserName: { type: String, required: true, default: '' },
  adminUserType: { 
    type: String, 
    enum: Object.values(AdminTypes), 
    required: true, 
    default: AdminTypes.SuperAdmin 
  },
  email: { type: String, required: true },
  password: { type: String, required: true },
  createdUser: { type: Schema.Types.ObjectId, default: null },
  createdAt: { type: Date, default: Date.now },
  updatedUser: { type: Schema.Types.ObjectId, default: null },
  updatedAt: { type: Date, default: Date.now },
});

// Middleware to update the updatedAt timestamp automatically
adminSchema.pre<IAdmin>('save', function (next) {
  this.updatedAt = new Date();
  next();
});

const ADMIN: Model<IAdmin> = model<IAdmin>('cln_admins', adminSchema);

export default ADMIN;
