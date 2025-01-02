import mongoose, { Schema, Types, Model } from "mongoose";
import { INotificationDoc } from "../utils/interface.util";
import { DbModels, UserType } from "../utils/enum.util";

const NotificationSchema = new mongoose.Schema<INotificationDoc>(
  {
    user: { type: Schema.Types.ObjectId, ref: DbModels.USER, required: true },
    message: { type: String, required: true },
    status: { type: String, default: "unread" },
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
