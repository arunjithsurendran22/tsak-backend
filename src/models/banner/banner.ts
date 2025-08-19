import { Model, Schema, model, models } from "mongoose";
import { IBanner } from "./banner-model";

const bannerSchema: Schema<IBanner> = new Schema<IBanner>(
  {
    documentStatus: { type: Boolean, required: true, default: true },

    offerTitle: { type: String, required: true, trim: true }, // ✅ new
    title: { type: String, required: true, trim: true },
    description: { type: String, required: true, trim: true },
    images: { type: [String], required: true },
    buttonTitle: { type: String, required: true, trim: true },

    createdUser: { type: Schema.Types.ObjectId, ref: "cln_users", default: null },
    createdAt: { type: Date, default: null },
    updatedUser: { type: Schema.Types.ObjectId, ref: "cln_users", default: null },
    updatedAt: { type: Date, default: null },
  },
  { versionKey: false }
);

// timestamps (manual, since you're not using mongoose timestamps)
bannerSchema.pre<IBanner>("save", function (next) {
  const now = new Date();
  if (!this.createdAt) this.createdAt = now;
  this.updatedAt = now;
  next();
});

// reuse model in dev & pin collection name
const BANNER: Model<IBanner> =
  models.BANNER || model<IBanner>("BANNER", bannerSchema, "cln_banners");

export default BANNER;
