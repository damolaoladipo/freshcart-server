import { Document, ObjectId } from "mongoose";

export type Nullable<T> = T | null;
export interface IRoleDoc extends Document {
  user: ObjectId
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
    email: string
    password: string;
    
    username: string;
    avatar: string;
    phoneNumber: string;
    phoneCode: string;
    countryPhone: string;
    userType: string;
    Token: any;
    TokenExpire: any
    accountStatus: string;
    emailCode: string;
    slug: string;
    
    isSuper: boolean;
    isAdmin: boolean;	
    isMerchant: boolean;	
    isGuest: boolean;
    isUser: string;	
    isActive: boolean;
    loginLimit: number;	
    
    merchant: ObjectId | any;
    guest: ObjectId | any;
    role: ObjectId | any;
    cart: Array<ObjectId | any>;	
    wishlist: Array<ObjectId | any>;	
    address: Array<IAddress>;

    matchPassword: (password: string) => boolean;
    getAuthToken: () => string;
    getResetToken: () => string
}

export interface IAddress {
    user: ObjectId
    street: string;
    city: string;
    state: string;
    postalCode: string;
    country: string;

    createdAt: string;
    updatedAt: string;
    _version: number;
    _id: ObjectId;
    id: ObjectId;
  }


  export interface IResult {
    [x: string]: any;
    error: boolean;
    message: string;
    code: number;
    data: any;
  }
  
export interface IToken extends Document {
    user: ObjectId;
    token: string;
    expiry: string
    createdAt: Date;
    removeToken: () => void;

    updatedAt: string;
    _version: number;
    _id: ObjectId;
    id: ObjectId;
  }

export interface IRandoChar {

}

export interface IProductDoc extends Document {
  name: string;
  description: string;
  price: number;
  category: string;
  tag: string[];
  stockQuantity: number;
  image: string[];
  
  merchant: string
  inStock: boolean;
  discount: number;
  count: number;
  slug: string

  createdAt: string;
  updatedAt: string;
  _version: number;
  _id: ObjectId;
  id: ObjectId;
  
  // getAllProducts: () => void
  getAllProducts(): Array<IProductDoc>;
  addToCart: (userId: string) => void;
  like: (userId: ObjectId) => void;
  updateStock: (quantity: number) => Promise<void>;
  applyDiscount: (discountPercentage: number) => Promise<void>;
  removeDiscount: () => Promise<void>;
  addTag: (tag: string) => Promise<void>;
  removeTag: (tag: string) => Promise<void>;
  isInStock: () => boolean;
}


export interface ICartDoc extends Document {
  user: ObjectId;
  products: IProductDoc[]
  coupon: string | null;
  checkout: boolean;

  
  addToCart: (id: ObjectId, quantity: number) => Promise<ICartDoc>;
  removeFromCart: (productId: ObjectId) => Promise<ICartDoc>;
  applyCoupon: (coupon: string) => Promise<ICartDoc>;
  proceedToCheckout(): Promise<ICartDoc>;

  createdAt: string;
  updatedAt: string;
  _version: number;
  _id: ObjectId;
  id: ObjectId;
}


export interface ICartProduct {
  id: IProductDoc | ObjectId;
  quantity: number;
}

export interface IOrderDoc extends Document {
  user: ObjectId | IUserDoc;
  address: IAddress
  orderDate: Date;
  status: string;
  totalAmount: number;
  cartItems: { productId: ObjectId; quantity: number }[];
  payment: {
    method: string;
    status: string;
    transactionId: ObjectId;
  };
  shipment: {
    carrier: string;
    trackingNumber: string;
    status: string;
    shipmentDate: Date;
  };

  placeOrder: () => Promise<IOrderDoc>;
  updateStatus: (status: string) => Promise<IOrderDoc>;

  createdAt: string;
  updatedAt: string;
  _version: number;
  _id: ObjectId;
  id: ObjectId;
}



export interface IOrderItemDoc extends Document {
  user: ObjectId
  product: ObjectId;
  order: ObjectId;
  quantity: number;
  pricePerUnit: number;
  totalPrice: number;
  discount: number;
  status: string;

  createdAt: Date;
  updatedAt: Date;
  _version: number;
  _id: ObjectId;
  id: ObjectId;

  remove: () => void;
}

export interface ITransactionDoc extends Document {
  user: ObjectId
  order: ObjectId;
  amount: number;
  method: string;
  currency: string;
  paymentPartner: string;
  status: string
  date: Date;
  
  processTransaction: () => Promise<ITransactionDoc>;
  updatePaymentStatus: (status: string) => Promise<ITransactionDoc>;

  createdAt: string;
  updatedAt: string;
  _version: number;
  _id: ObjectId;
  id: ObjectId;
}



export interface IPaymentPartnerDoc extends Document {
  name: string;
  apiKey: string;
  apiSecret: string;
  webhookUrl: string;
  supportedCurrencies: string[];
  settings: { [key: string]: any };
  slug: string

  processPayment(paymentDetails: any): Promise<any>;
  processRefund(amount: number, refundDetails: any): Promise<any>;
  createPaymentPartner: () => Promise<IPaymentPartnerDoc>;
  updatePaymentPartner: (data: Partial<IPaymentPartnerDoc>) => Promise<IPaymentPartnerDoc>;

  createdAt: string;
  updatedAt: string;
  _version: number;
  _id: ObjectId;
  id: ObjectId;
}



export interface IWishlistDoc extends Document {
  user: ObjectId;
  products: Array<IProductDoc>;

  addProduct: (productId: ObjectId, quantity: number) => Promise<IWishlistDoc>;
  removeProduct: (productId: string) => Promise<IWishlistDoc>;
  updateProductQuantity: (productId: string, quantity: number) => Promise<IWishlistDoc>;

  createdAt: string;
  updatedAt: string;
  _version: number;
  _id: ObjectId;
  id: ObjectId;
}



export interface IShipmentDoc extends Document {
  user: ObjectId;
  order: ObjectId;
  carrier: string
  address: IAddress
  trackingNumber: string;
  status: string;
  shipmentDate: Date;
  updateShipmentStatus: (status: string) => Promise<IShipmentDoc>;
  updateTrackingNumber: (trackingNumber: string) => Promise<IShipmentDoc>;

  createdAt: string;
  updatedAt: string;
  _version: number;
  _id: ObjectId;
  id: ObjectId;
}


export interface INotificationDoc extends Document {
  user: ObjectId;
  message: string;
  status: string;
  readNotification: () => Promise<INotificationDoc>;
  removeNotification: () => Promise<INotificationDoc>;

  createdAt: string;
  updatedAt: string;
  _version: number;
  _id: ObjectId;
  id: ObjectId;
}



export interface IDoc extends Document {
  createdAt: string;
  updatedAt: string;
  _version: number;
  _id: ObjectId;
  id: ObjectId;
}

export interface ITokenPayload {
  userId: string;
  exp: number;
}

export interface IPaymentGateway {
  initializePayment(paymentData: {
    email: string;
    amount: number;
    currency: string
    reference: string;
    callback_url: string;
  }): Promise<IResult>;

  verifyPayment(reference: string): Promise<IResult>;
}
