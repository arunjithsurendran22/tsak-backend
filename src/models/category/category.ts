import { Model, Schema, model } from 'mongoose';
import { ICategory } from './category-model';

const categorySchema: Schema<ICategory> = new Schema<ICategory>({
  documentStatus: { type: Boolean, required: true, default: true },
  categoryName: { type: String, required: true, trim: true },
  createdUser: { type: Schema.Types.ObjectId, ref: 'cln_users', default: null },
  createdAt: { type: Date, default: null },
  updatedUser: { type: Schema.Types.ObjectId, ref: 'cln_users', default: null },
  updatedAt: { type: Date, default: null },
});

// Middleware to update the `updatedAt` field before saving
categorySchema.pre<ICategory>('save', function (next) {
  this.createdAt = new Date();
  next();
});

// Create and export the model
const CATEGORY: Model<ICategory> = model<ICategory>('cln_categories', categorySchema);

export default CATEGORY;
