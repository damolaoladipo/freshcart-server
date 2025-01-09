import mongoose, { Schema, Model } from "mongoose";
import { IProductDoc } from "../utils/interface.util";
import slugify from "slugify";
import { DbModels } from "../utils/enum.util";

const ProductSchema = new mongoose.Schema<IProductDoc>(
  {
    name: { type: String, required: true },
    description: { type: String, maxLength: 600 },
    price: { type: Number, required: true },
    category: { type: String, required: true },
    tag: { type: [String], default: [], required: true },
    stockQuantity: { type: Number, required: true },
    imageURLs: { type: [String], required: true },
    merchant: { type: String, required: true },
    // addToCart: { type: Boolean, default: false },
    like: { type: Number, default: 0 },
    inStock: { type: Boolean, default: true },
    discount: { type: Number, default: 0 },
    // count: { type: Number, default: 0 },
    slug: { type: String, default: "" },
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

// ProductSchema.virtual("inStock").get(function (this: IProductDoc {
//   return this.stockQuantity > 0;
// });

ProductSchema.pre<IProductDoc>("save", async function (next) {
  this.slug = slugify(this.name, { lower: true, replacement: "-" });
  next();
});

ProductSchema.pre<IProductDoc>("insertMany", async function (next) {
  this.slug = slugify(this.name, { lower: true, replacement: "-" });
  next();
});

ProductSchema.methods.getAllProducts = async function () {
  return Product.find({});
};

ProductSchema.statics.findByName = async function (name: string) {
  const role = Product.findOne({ name });
  return role ?? null;
};

ProductSchema.methods.addToCartz = function (productId: mongoose.Types.ObjectId, quantity: number) {
    const productIndex = this.products.findIndex((p: IProductDoc) => p.id.toString() === productId.toString());
  
    if (productIndex !== -1) {
      this.products[productIndex].quantity += quantity;
    } else {
      this.products.push({ productId, quantity });
    }
  
    return this.save();
  };

ProductSchema.methods.updateStock = async function (quantity: number) {
  this.stockQuantity = Math.max(0, this.stockQuantity - quantity);
  await this.save();
};

ProductSchema.methods.applyDiscount = async function (discountPercentage: number) {
  this.discount = discountPercentage;
  this.price = this.price - (this.price * (discountPercentage / 100));
  await this.save();
};

ProductSchema.methods.removeDiscount = async function () {
  this.price = this.price / (1 - (this.discount / 100));
  this.discount = 0;
  await this.save();
};


ProductSchema.methods.addTag = async function (tag: string) {
  if (!this.tag.includes(tag)) {
    this.tag.push(tag);
    await this.save();
  }
};

ProductSchema.methods.removeTag = async function (tag: string) {
  this.tag = this.tag.filter((t: string) => t !== tag);
  await this.save();
};

ProductSchema.methods.isInStock = function () {
  return this.stockQuantity > 0;
};

const Product: Model<IProductDoc> = mongoose.model<IProductDoc>(
  DbModels.PRODUCT,
  ProductSchema
);

export default Product;
