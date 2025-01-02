import mongoose, { Schema, Types, Model } from "mongoose";
import { IPaymentPartnerDoc } from "../utils/interface.util";
import slugify from "slugify";
import { DbModels } from "../utils/enum.util";

const PaymentPartnerSchema = new mongoose.Schema<IPaymentPartnerDoc>(
  {
    name: { type: String, required: true, unique: true, },
    apiKey: { type: String, required: true },
    apiSecret: { type: String, required: true },
    webhookUrl: { type: String, required: true },
    supportedCurrencies: { type: [String], required: true, validate: (value: string[]) => value.length > 0 },
    settings: { type: Schema.Types.Mixed, default: {} },
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

PaymentPartnerSchema.set("toJSON", { virtuals: true, getters: true });
PaymentPartnerSchema.pre<IPaymentPartnerDoc>("save", async function (next) {
  this.slug = slugify(this.name, { lower: true, replacement: "-" });
  next();
});

PaymentPartnerSchema.pre<IPaymentPartnerDoc>("insertMany", async function (next) {
  this.slug = slugify(this.name, { lower: true, replacement: "-" });
  next();
});

PaymentPartnerSchema.methods.getAll = async function () {
  return PaymentPartner.find({});
};

PaymentPartnerSchema.statics.findByName = async function (name: string) {
  const paymentPartner = PaymentPartner.findOne({ name });
  return paymentPartner ?? null;
};

PaymentPartnerSchema.methods.createPaymentPartner = async function () {
    return this.save();
  };
  
PaymentPartnerSchema.methods.updatePaymentPartner = async function (data: Partial<IPaymentPartnerDoc>) {
    Object.assign(this, data);
    return this.save();
  };

const PaymentPartner: Model<IPaymentPartnerDoc> = mongoose.model<IPaymentPartnerDoc>(
  DbModels.PAYMENTPARTNERS,
  PaymentPartnerSchema
);

export default PaymentPartner;
