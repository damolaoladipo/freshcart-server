import mongoose, { Schema, Model } from "mongoose";
import { IOrderItemDoc } from "../utils/interface.util";
import { DbModels } from "../utils/enum.util";

const OrderItemSchema = new mongoose.Schema<IOrderItemDoc>(
  {
    product: { type: Schema.Types.ObjectId, ref: DbModels.PRODUCT, required: true },
    order: { type: Schema.Types.ObjectId, ref: DbModels.ORDER, required: true },
    quantity: { type: Number, required: true, min: 1 },
    pricePerUnit: { type: Number, required: true },
    totalPrice: { type: Number, default: 0 },
    discount: { type: Number, default: 0 },
    status: { type: String, enum: ["Pending", "Processing", "Shipped", "Delivered"], default: "Pending" },
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

OrderItemSchema.set("toJSON", { virtuals: true, getters: true });

OrderItemSchema.pre<IOrderItemDoc>("save", async function (next) {
  this.totalPrice = this.quantity * this.pricePerUnit - (this.discount || 0);
  next();
});

OrderItemSchema.statics.findByOrder = async function (orderId: string) {
  return OrderItem.find({ order: orderId }).populate("product");
};


OrderItemSchema.methods.getAll = async function () {
  return OrderItem.find({});
};

OrderItemSchema.methods.placeOrderItem = async function () {
    return this.save();
  };
  
  OrderItemSchema.methods.updateStatus = async function (status: string) {
    this.status = status;
    return this.save();
  };

const OrderItem: Model<IOrderItemDoc> = mongoose.model<IOrderItemDoc>(
  DbModels.ORDERITEM,
  OrderItemSchema
);

export default OrderItem;
