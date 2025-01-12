import mongoose, { Schema } from "mongoose";
import { DbModels } from "../utils/enum.util";
import { IAddress } from "../utils/interface.util";

const AddressSchema = new Schema<IAddress>(
  {
    user: { type: Schema.Types.ObjectId, ref: DbModels.USER },
    street: { type: String, required: true },
    city: { type: String, required: true },
    state: { type: String, required: true },
    postalCode: { type: String, required: true },
    country: { type: String, required: true },
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

const Address = mongoose.model(DbModels.ADDRESS, AddressSchema);

export default Address;
