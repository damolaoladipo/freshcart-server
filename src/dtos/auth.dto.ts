import { ObjectId } from "mongoose";

export interface RegisterDTO {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    
    username?: string;
    avatar?: string;
    phoneNumber?: string;
    phoneCode?: string;
    countryPhone?: string;
}

export interface MapRegisteredUserDTO {
  id: ObjectId;
  firstName: string;
  lastName: string;
  email: string;

  username: string;
  avatar: string;
  phoneNumber: String;
  phoneCode: String;
  countryPhone: String;
  
  userType: String;
  role: any;

  isSuper: boolean;
  isAdmin: boolean;	
  isMerchant: boolean;	
  isGuest: boolean;
  isUser: boolean;	
  isActive: boolean;	
}
