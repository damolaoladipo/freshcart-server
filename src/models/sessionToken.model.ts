import mongoose, { model, Model } from "mongoose";
import { ISessionToken } from "../utils/interface.util";
import { DbModels } from "../utils/enum.util";

const SessionTokenSchema = new mongoose.Schema<ISessionToken>({
  token: { type: String, required: true },
  userId: { type: mongoose.Schema.Types.ObjectId, required: true, ref: DbModels.USER},
  createdAt: { type: Date, default: Date.now, expires: "30d" },
});

const SessionToken: Model<ISessionToken> = model<ISessionToken>(
    DbModels.SESSIONTOKEN,
    SessionTokenSchema
);

export default SessionToken;
