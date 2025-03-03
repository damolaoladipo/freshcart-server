import mongoose, { Schema, Model } from "mongoose";
import { IRoleDoc } from "../utils/interface.util";
import slugify from "slugify";
import { DbModels, Permissions, UserType } from "../utils/enum.util";

const RolesSchema = new mongoose.Schema<IRoleDoc>(
  {
    user: { type: Schema.Types.ObjectId, ref: DbModels.USER },
    name: { type: String, default: UserType.USER, enum: UserType, required: true },
    description: { type: String, maxLength: 200, default: "" },
    slug: { type: String, default: "" },
    users: [{ type: Schema.Types.ObjectId, ref: DbModels.USER }],
    permissions: [{ type: String, enum: Object.values(Permissions), 
      default: Permissions.VIEW_PRODUCTS, }],
  },
  {
    timestamps: true,
    versionKey: "_version",
    toJSON: {
      transform(doc: any, ret) {
        ret.id = ret._id;
        delete ret.__v;
      },
    },
  }
);

RolesSchema.set("toJSON", { virtuals: true, getters: true });
RolesSchema.pre<IRoleDoc>("save", async function (next) {
  this.slug = slugify(this.name, { lower: true, replacement: "-" });
  next();
});
RolesSchema.pre<IRoleDoc>("insertMany", async function (next) {
  this.slug = slugify(this.name, { lower: true, replacement: "-" });
  next();
});
RolesSchema.methods.getAll = async function () {
  return Role.find({});
};
RolesSchema.statics.findByName = async function (name: string) {
  const role = Role.findOne({ name });
  return role ?? null;
};

const Role: Model<IRoleDoc> = mongoose.model<IRoleDoc>(
  DbModels.ROLE,
  RolesSchema
);

export default Role;
