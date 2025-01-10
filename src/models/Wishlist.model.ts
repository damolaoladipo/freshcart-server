import mongoose, { Schema, Model } from "mongoose";
import { IProductDoc, IWishlistDoc } from "../utils/interface.util";
import { DbModels } from "../utils/enum.util";

const WishListSchema = new mongoose.Schema<IWishlistDoc>(
  {  
    user: [{ type: Schema.Types.ObjectId, ref: DbModels.USER }],
    products: [{ type: String, ref: DbModels.PRODUCT, required: true }],
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


WishListSchema.methods.getAll = async function () {
  return Wishlist.find({});
};
WishListSchema.statics.findByName = async function (name: string) {
  const wishlist = Wishlist.findOne({ name });
  return wishlist ?? null;
};

const Wishlist: Model<IWishlistDoc> = mongoose.model<IWishlistDoc>(
  DbModels.WISHLIST,
  WishListSchema
);

WishListSchema.methods.addProduct = async function (productId: mongoose.Types.ObjectId, quantity: number) {
    const existingProduct = this.products.find(
      (product: IProductDoc) => product.id.toString() === productId.toString()
    );
  
    if (existingProduct) {
      existingProduct.quantity += quantity; 
    } else {
      this.products.push({ productId, quantity });
    }
  
    return this.save();
  };

WishListSchema.methods.removeProduct = async function (productId: mongoose.Types.ObjectId) {
    this.products = this.products.filter(
      (product: IProductDoc) => product.id.toString() !== productId.toString()
    );
    return this.save();
  };

WishListSchema.methods.updateProductQuantity = async function (
  productId: mongoose.Types.ObjectId,
  quantity: number
) {
  const existingProduct = this.products.find(
    (product: IProductDoc) => product.id.toString() === productId.toString()
  );

  if (existingProduct) {
    existingProduct.quantity = quantity;
    return this.save();
  }
};


export default Wishlist;
