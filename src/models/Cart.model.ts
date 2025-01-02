import mongoose, { Schema, Types, Model } from "mongoose";
import { ICartDoc } from "../utils/interface.util";
import slugify from "slugify";
import { DbModels, UserType } from "../utils/enum.util";

const CartSchema = new mongoose.Schema<ICartDoc>(
  {
    users: [{ type: Schema.Types.ObjectId, ref: DbModels.USER }],
    products: [
        {
          productId: { type: Schema.Types.ObjectId, ref: DbModels.PRODUCT, required: true },
          quantity: { type: Number, required: true },
        },
      ],
    coupon: { type: String, default: null },
    checkout: { type: Boolean, default: false },

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

CartSchema.methods.addToCart = function (productId: mongoose.Types.ObjectId, quantity: number) {
    const productIndex = this.products.findIndex((p) => p.productId.toString() === productId.toString());
  
    if (productIndex !== -1) {
      this.products[productIndex].quantity += quantity; // Update quantity if product already in cart
    } else {
      this.products.push({ productId, quantity });
    }
  
    return this.save();
  };

CartSchema.methods.removeFromCart = function (productId: mongoose.Types.ObjectId) {
    this.products = this.products.filter((p) => p.productId.toString() !== productId.toString());
    return this.save();
  };
  
CartSchema.methods.applyCoupon = function (coupon: string) {
    this.coupon = coupon;
    return this.save();
  };
  
CartSchema.methods.proceedToCheckout = function () {
    this.checkout = true;
    return this.save();
  };

const Cart: Model<ICartDoc> = mongoose.model<ICartDoc>(
  DbModels.CART,
  CartSchema
);

export default Cart;
