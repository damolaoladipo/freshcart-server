import mongoose, { model, Model } from "mongoose";
import { IToken } from "../utils/interface.util";
import { DbModels } from "../utils/enum.util";

const TokenSchema = new mongoose.Schema<IToken>({
  token: { type: String, required: true },
  userId: { type: mongoose.Schema.Types.ObjectId, required: true, ref: DbModels.USER},
  createdAt: { type: Date, default: Date.now, expires: "30d" },
});

const Token: Model<IToken> = model<IToken>(
    DbModels.SESSIONTOKEN,
    TokenSchema
);

export default Token;
