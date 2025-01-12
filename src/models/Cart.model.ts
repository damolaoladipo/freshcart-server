import mongoose, { Schema, Model } from "mongoose";
import { ICartDoc, IProductDoc } from "../utils/interface.util";
import { DbModels } from "../utils/enum.util";

const CartSchema = new mongoose.Schema<ICartDoc>(
  {
    user: { type: Schema.Types.ObjectId, ref: DbModels.USER },
    products: {
      type: [
        {
          id: { type: Schema.Types.ObjectId, ref: DbModels.PRODUCT, required: true },
          quantity: { type: Number, required: true, default: 1 },
        },
      ],
      default: [], 
    },
      
    coupon: { type: String, default: null },
    checkout: { type: Boolean, default: false },

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

CartSchema.methods.getAll = async function () {
  return Cart.find({});
};

CartSchema.methods.addToCart = function (productId: mongoose.Types.ObjectId, quantity: number) {
    const productIndex = this.products.findIndex((p: any) => p.productId.toString() === productId.toString());
  
    if (productIndex !== -1) {
      this.products[productIndex].quantity += quantity;
    } else {
      this.products.push({ productId, quantity });
    }
  
    return this.save();
  };

CartSchema.set("toJSON", { virtuals: true, getters: true });

CartSchema.methods.removeFromCart = function (productId: mongoose.Types.ObjectId) {
    this.products = this.products.filter((p: IProductDoc) => p.id.toString() !== productId.toString());
    return this.save();
  };

CartSchema.methods.proceedToCheckout = function () {
    this.checkout = true;
    return this.save();
  };
  
CartSchema.methods.applyCoupon = function (coupon: string) {
    this.coupon = coupon;
    return this.save();
  };
  

const Cart: Model<ICartDoc> = mongoose.model<ICartDoc>(
  DbModels.CART,
  CartSchema
);

export default Cart;
