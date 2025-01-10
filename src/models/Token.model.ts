import mongoose, { model, Model, Schema } from "mongoose";
import { IToken } from "../utils/interface.util";
import { DbModels } from "../utils/enum.util";

const TokenSchema = new mongoose.Schema<IToken>({
  user: [{ type: Schema.Types.ObjectId, required: true, ref: DbModels.USER }],
  token: { type: String, required: true },
  createdAt: { type: Date, default: Date.now, expires: "30d" },
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

const Token: Model<IToken> = model<IToken>(
    DbModels.SESSIONTOKEN,
    TokenSchema
);

export default Token;
