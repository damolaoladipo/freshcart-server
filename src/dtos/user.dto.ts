export interface CreateUserDTO {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    username?: string;
    phoneCode?: string;
    phoneNumber?: string;
    avatar?: string;
    userType: string;
    role: string;
    isSuper: boolean;
    isAdmin:boolean;
    isMerchant: boolean;
    isGuest: boolean;
    isUser: boolean;
  }
  
export interface EditUserDTO {
    firstName?: string;
    lastName?: string;
    email?: string;
    password?: string;
    username?: string;
    avatar?: string;
    phoneCode?: string;
    phoneNumber?: string;
  }
  