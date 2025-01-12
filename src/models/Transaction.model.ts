import mongoose, { Schema, Model } from "mongoose";
import { ITransactionDoc } from "../utils/interface.util";
import { Currency, DbModels, PaymentPartners, PaymentStatus } from "../utils/enum.util";

const TransactionSchema = new mongoose.Schema<ITransactionDoc>(
  {
    user: { type: Schema.Types.ObjectId, ref: DbModels.USER },
    order: { type: Schema.Types.ObjectId, ref: DbModels.ORDER, required: true },
    amount: { type: Number, required: true },
    method: { type: String, required: true },
    currency: { type: String, enum: Currency, 
      default: Currency.NGN, required: true },
    paymentPartner: { type: String, enum: PaymentPartners, 
      default: PaymentPartners.PAYSTACK, required: true },
    status: { type: String, enum: PaymentStatus, 
      default:PaymentStatus.PENDING, required: true },
    date: { type: Date, default: Date.now },
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
