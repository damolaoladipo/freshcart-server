import mongoose, { Schema, Types, Model } from "mongoose";
import { ICartDoc } from "../utils/interface.util";
import slugify from "slugify";
import { DbModels, UserType } from "../utils/enum.util";

const CartSchema = new mongoose.Schema<ICartDoc>(
  {
    name: { type: String, default: UserType.USER, enum: UserType, required: true },
    description: { type: String, maxLength: 200, default: "" },
    slug: { type: String, default: "" },
    users: [{ type: Schema.Types.ObjectId, ref: DbModels.USER }],
    permissions: [{ type: String }],
  },
  {
    timestamps: true,
    versionKey: "_version",
    toJSON: {
      transform(doc: any, ret) {
        ret.id = ret._id;
      },
    },
  }
);

CartSchema.set("toJSON", { virtuals: true, getters: true });
CartSchema.pre<ICartDoc>("save", async function (next) {
  this.slug = slugify(this.name, { lower: true, replacement: "-" });
  next();
});
CartSchema.pre<ICartDoc>("insertMany", async function (next) {
  this.slug = slugify(this.name, { lower: true, replacement: "-" });
  next();
});
CartSchema.methods.getAll = async function () {
  return Cart.find({});
};
CartSchema.statics.findByName = async function (name: string) {
  const Cart = Cart.findOne({ name });
  return Cart ?? null;
};

const Cart: Model<ICartDoc> = mongoose.model<ICartDoc>(
  DbModels.Cart,
  CartSchema
);

export default Cart;
