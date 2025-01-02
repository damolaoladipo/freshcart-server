import mongoose, { Schema, Types, Model } from "mongoose";
import { ITransactionDoc } from "../utils/interface.util";
import slugify from "slugify";
import { DbModels, UserType } from "../utils/enum.util";

const TransactionSchema = new mongoose.Schema<ITransactionDoc>(
  {
    order: { type: Schema.Types.ObjectId, ref: DbModels.ORDER, required: true },
    amount: { type: Number, required: true },
    method: { type: String, required: true },
    currency: { type: String, required: true },
    paymentPartner: { type: String, required: true },
    date: { type: Date, default: Date.now },
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

TransactionSchema.methods.getAll = async function () {
  return Transaction.find({});
};
TransactionSchema.statics.findByName = async function (name: string) {
  const transaction = Transaction.findOne({ name });
  return Transaction ?? null;
};

TransactionSchema.methods.processTransaction = async function () {
    return this.save();
  };
  
  TransactionSchema.methods.updatePaymentStatus = async function (status: string) {
    this.status = status;
    return this.save();
  };
  

const Transaction: Model<ITransactionDoc> = mongoose.model<ITransactionDoc>(
  DbModels.TRANSACTION,
  TransactionSchema
);

export default Transaction;
