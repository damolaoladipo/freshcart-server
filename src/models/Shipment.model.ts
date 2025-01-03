import mongoose, { Schema, Model } from "mongoose";
import { IShipmentDoc } from "../utils/interface.util";
import { DbModels} from "../utils/enum.util";
import AddressSchema from "./Address.model";

const ShipmentSchema = new mongoose.Schema<IShipmentDoc>(
  {
    user: [{ type: Schema.Types.ObjectId, ref: DbModels.USER }],
    order: { type: Schema.Types.ObjectId, ref: DbModels.ORDER, required: true },
    address: { type: AddressSchema, required: true },
    trackingNumber: { type: String, required: true },
    status: { type: String, default: "Pending" },
    shipmentDate: { type: Date, required: true },
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

ShipmentSchema.methods.getAll = async function () {
  return Shipment.find({});
};

ShipmentSchema.methods.updateShipmentStatus = async function (status: string) {
    this.status = status;
    return this.save();
  };
  
  ShipmentSchema.methods.updateTrackingNumber = async function (trackingNumber: string) {
    this.trackingNumber = trackingNumber;
    return this.save();
  };

const Shipment: Model<IShipmentDoc> = mongoose.model<IShipmentDoc>(
  DbModels.SHIPMENT,
  ShipmentSchema
);

export default Shipment;
