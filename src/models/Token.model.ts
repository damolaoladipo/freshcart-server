import mongoose, { model, Model, Schema } from "mongoose";
import { IToken } from "../utils/interface.util";
import { DbModels, TokenExpiry } from "../utils/enum.util";

const TokenSchema = new mongoose.Schema<IToken>({
  user: [{ type: Schema.Types.ObjectId, required: true, ref: DbModels.USER }],
  token: { type: String, required: true },
  expiry: { 
    type: String, 
    enum: Object.values(TokenExpiry), 
    default: TokenExpiry.SHORT_TERM, 
    required: true 
},
  createdAt: { type: Date, default: Date.now },
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
