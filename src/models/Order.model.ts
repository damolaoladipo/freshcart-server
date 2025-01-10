import mongoose, { Schema, Model } from "mongoose";
import { IOrderDoc } from "../utils/interface.util";
import { DbModels, OrderStatus } from "../utils/enum.util";

const OrderSchema = new mongoose.Schema<IOrderDoc>(
  {
    user: [{ type: Schema.Types.ObjectId, ref: DbModels.USER, required: true }],
    address: [{ type: String,  ref: DbModels.ADDRESS, required: true }],
    orderItems: [{ type: Schema.Types.ObjectId, ref: DbModels.ORDERITEM, required: true }],
    payment: [{ type: Schema.Types.ObjectId, ref: DbModels.TRANSACTION, required: true }],
    shipment: [{ type: Schema.Types.ObjectId, ref: DbModels.SHIPMENT, required: true }],
    orderDate: { type: Date, default: Date.now },
    status: { type: String, enum: Object.values(OrderStatus), default: OrderStatus.PENDING },
    totalAmount: { type: Number, required: true },
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
