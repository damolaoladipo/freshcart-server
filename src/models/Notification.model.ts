import mongoose, { Schema, Types, Model } from "mongoose";
import { INotificationDoc } from "../utils/interface.util";
import { DbModels, NotificationStatus } from "../utils/enum.util";

const NotificationSchema = new mongoose.Schema<INotificationDoc>(
  {
    user: { type: Schema.Types.ObjectId, ref: DbModels.USER, required: true },
    message: { type: String, required: true },
    status: { type: String, enum: Object.values(NotificationStatus),
      default: NotificationStatus.PENDING },
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

NotificationSchema.methods.getAll = async function () {
  return Notification.find({});
};

NotificationSchema.methods.readNotification = async function () {
    this.status = "read";
    return this.save();
  };

const Notification: Model<INotificationDoc> = mongoose.model<INotificationDoc>(
  DbModels.NOTIFICATION,
  NotificationSchema
);

export default Notification;
