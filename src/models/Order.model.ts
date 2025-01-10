import mongoose, { Schema, Model } from "mongoose";
import { IOrderDoc } from "../utils/interface.util";
import { DbModels } from "../utils/enum.util";

const OrderSchema = new mongoose.Schema<IOrderDoc>(
  {
    user: [{ type: Schema.Types.ObjectId, ref: DbModels.USER }],
    address: {
      street: { type: String, required: true },
      city: { type: String, required: true },
      state: { type: String, required: true },
      postalCode: { type: String, required: true },
      country: { type: String, required: true },
    },
    orderDate: { type: Date, default: Date.now },
    status: { type: String, default: "pending" },
    totalAmount: { type: Number, required: true },
    
    orderItems: [
      {
        productId: { type: Schema.Types.ObjectId, ref: DbModels.PRODUCT, required: true },
        quantity: { type: Number, required: true },
      },
    ],
    payment: {
      method: { type: String, required: true },
      status: { type: String, required: true },
      transactionId: { type: String, ref: DbModels.TRANSACTION, required: true },
    },
    shipment: {
      carrier: { type: String, required: true },
      trackingNumber: { type: String, required: true },
      status: { type: String, required: true },
      shipmentDate: { type: String, required: true },
    },
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


OrderSchema.methods.getAll = async function () {
  return Order.find({});
};
OrderSchema.statics.findByName = async function (name: string) {
  const order = Order.findOne({ name });
  return Order ?? null;
};

OrderSchema.methods.placeOrder = async function () {
    return this.save();
  };
  
  OrderSchema.methods.updateStatus = async function (status: string) {
    this.status = status;
    return this.save();
  };

const Order: Model<IOrderDoc> = mongoose.model<IOrderDoc>(
  DbModels.ORDER,
  OrderSchema
);

export default Order;
