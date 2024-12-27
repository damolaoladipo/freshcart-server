import { Document, Model, ObjectId } from "mongoose";

export type Nullable<T> = T | null;
export interface IRoleDoc extends Document {
  name: string;
  description: string;
  slug: string;
  users: Array<ObjectId | any>;
  permissions: Array<string>;

  //generics
  createdAt: string;
  updatedAt: string;
  _id: ObjectId;
  id: ObjectId;

  // functions
  getAll(): Array<IRoleDoc>;
  findByName(name: string): IRoleDoc | null;
}


export interface IUserDoc extends Document {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    
    username: string;
    avatar: string;
    phoneNumber: string;
    phoneCode: string;
    countryPhone: string;
    userType: string;
    resetPasswordToken: string;
    accountStatus: string;
    emailCode: string;
    slug: string;
    
    isSuper: boolean;
    isAdmin: boolean;	
    isMerchant: boolean;	
    IsGuest: boolean;
    isUser: boolean;	
    isActive: boolean;	
    
    merchant: ObjectId | any;
    Guest: ObjectId | any;
    role: ObjectId | any;
    cart: Array<ObjectId | any>;	
    wishlist: Array<ObjectId | any>;	
    address: Array<IAddress>;
}

export interface IAddress {
    street: string;
    city: string;
    state: string;
    postalCode: string;
    country: string;
  }
  