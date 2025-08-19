import { Model, Schema, model, models } from "mongoose";
import { IProduct } from "./product-model";


const productSchema: Schema<IProduct> = new Schema<IProduct>(
  {
    documentStatus: { type: Boolean, required: true, default: true },

    name: { type: String, required: true, trim: true },
    description: { type: String, required: true, trim: true },
    price: { type: Number, required: true },
    images: { type: [String], required: true },
    stock: { type: Number, required: true, default: 0 },

    createdUser: { type: Schema.Types.ObjectId, ref: "cln_users", default: null },
    createdAt: { type: Date, default: null },
    updatedUser: { type: Schema.Types.ObjectId, ref: "cln_users", default: null },
    updatedAt: { type: Date, default: null },
  },
  { versionKey: false }
);

productSchema.pre<IProduct>("save", function (next) {
  const now = new Date();
  if (!this.createdAt) this.createdAt = now;
  this.updatedAt = now;
  next();
});

const PRODUCT: Model<IProduct> =
  models.PRODUCT || model<IProduct>("PRODUCT", productSchema, "cln_products");

export default PRODUCT;
