import mongoose, { Schema, Model } from "mongoose";
import { IUserDoc } from "../utils/interface.util";
import slugify from "slugify";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { DbModels } from "../utils/enum.util";
import Address from "./Address.model";

const UserSchema = new Schema(
  {
    firstName: { type: String, default: "" },
    lastName: { type: String, default: "" },
    email: { type: String, required: true, unique: true, match: /.+\@.+\..+/ },
    password: { type: String, required: true, default: "", select: true },

    username: { type: String, default: "", unique: true },
    avatar: { type: String, default: "" },
    phoneNumber: { type: String, default: "" },
    phoneCode: { type: String, default: "+234" },
    countryPhone: { type: String, default: "" },
    userType: { type: String, default: "" },
    accountStatus: { type: String, default: "" },
    emailCode: { type: String, default: "" },


    isSuper: { type: Boolean, default: false },
    isAdmin: { type: Boolean, default: false },
    isMerchant: { type: Boolean, default: false },
    IsGuest: { type: Boolean, default: false },
    isUser: { type: Boolean, default: false },
    isActive: { type: Boolean, default: true },

    role: { type: Schema.Types.ObjectId, ref: DbModels.ROLE },

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

UserSchema.set("toJSON", { virtuals: true, getters: true });
UserSchema.pre<IUserDoc>("save", async function (next) {
  if (this.isModified("password")) {
    const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  }
  
  this.slug = slugify(this.email, { lower: true, replacement: "-" });

  next();
});

UserSchema.methods.matchPassword = async function (password: string) {
  let result: boolean = false;
  if (this.password && this.password !== "") {
    result = await bcrypt.compare(password, this.password);
  }
  return result;
};

UserSchema.methods.getAuthToken = async function () {

  let token: string = "";

  if (!process.env.JWT_SECRET ) {
    
    throw new Error("JWT_SECRET is not defined.");
  }
  if (!process.env.JWT_EXPIRY) {
    throw new Error("JWT_EXPIRY is not defined.");
  }
   token = await jwt.sign(
    {
      id: this._id,
      email: this.email,
      isSuper: this.isSuper,
      isAdmin: this.isAdmin,
      isMerchant: this.isMerchant,
      isGuest: this.IsGuest,
      isUser: this.isUser,
      role: this.role,
    },
    process.env.JWT_SECRET,
    {
      algorithm: "HS512",
      expiresIn: process.env.JWT_EXPIRY,
    }
  );

  return token;
};

UserSchema.statics.getUsers = async () => {
  return await User.find({});
};

UserSchema.methods.findById = async (id: any) => {
  const user = await User.findOne({ _id: id });
  return User ? User : null;
};

const User: Model<IUserDoc> = mongoose.model<IUserDoc>(DbModels.USER, UserSchema);

export default User;
