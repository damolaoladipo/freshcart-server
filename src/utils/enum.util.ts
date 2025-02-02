export enum ENVType {
    PRODUCTION = 'production',
    STAGING = 'staging',
    DEVELOPMENT = 'development'
    }

export enum AppChannel {
    WEB = "web",
    MOBILE = "mobile",
    DESKTOP = "desktop",
    WATCH = "watch"
    }
    
export enum UserType {
    USER = "user",
    SUPER = "superadmin",
    ADMIN = "admin",
    MERCHANT = "merchant",
    GUEST = "guest"
    }

export enum Permissions {
        VIEW_PRODUCTS = "view_products",
        ADD_TO_CART = "add_to_cart",
        REMOVE_FROM_CART = "remove_from_cart",
        PLACE_ORDER = "place_order",
        CANCEL_ORDER = "cancel_order",
        VIEW_ORDER_HISTORY = "view_order_history",
        MANAGE_PRODUCTS = "manage_products",
        VIEW_CUSTOMERS = "view_customers",
        MANAGE_CUSTOMERS = "manage_customers",
        ACCESS_DASHBOARD = "access_dashboard",
        MANAGE_PAYMENTS = "manage_payments"
    }
    
    
export enum DbModels {
    USER = "User",
    ROLE = "Role",
    MERCHANT = "Merchant",
    GUEST = "Guest",
    TOKEN = "Token",
    ADDRESS = "Address",
    PRODUCT = "Product",
    CATEGORY = "Category",
    CART = "Cart",
    ORDER = "Order",
    ORDERITEM = "OrderItem",    
    SHIPMENT = "Shipment",
    TRANSACTION = "Transaction",
    PAYMENTPARTNERS = "PaymentPartners",
    NOTIFICATION = "Notification",
    WISHLIST = "Wishlist"
}

export enum OrderStatus {
    PENDING = "pending",
    PROCESSING = "processing",
    SHIPPED = "shipped",
    DELIVERED = "delivered",
    CANCELLED = "cancelled",
    RETURNED = "returned"
}

export enum ShippingStatus {
    PENDING = "pending", 
    IN_TRANSIT = "in_transit",
    SHIPPED = 'SHIPPED', 
    DELIVERED = "delivered",
    CANCELLED = "cancelled", 
    RETURNED = "returned"
}

export enum PaymentStatus {
    PENDING = "pending", 
    COMPLETED = "completed", 
    FAILED = "failed", 
    REFUNDED = "refunded", 
    PARTIAL = "partial",
    CANCELLED = "cancelled" 
}

export enum NotificationStatus {
    SENT = "sent", 
    DELIVERED = "delivered", 
    READ = "read",
    UNREAD = "unread",
    FAILED = "failed", 
    PENDING = "pending" 
}

export enum Merchants {
    GREEN_FARM = "Green Farm",
    NATURES_BASKET = "Nature's Basket",
    ORGANIC_VALLEY = "Organic Valley",
    FRESH_AND_GREEN = "Fresh & Green",
    HEALTHY_HARVEST = "Healthy Harvest",
    VEGGIE_DELIGHT = "Veggie Delight",
    EARTHY_GOODS = "Earthy Goods",
    FARM_TO_FORK = "Farm to Fork",
    WHOLESOME_MARKET = "Wholesome Market",
    PURELY_PLANT = "Purely Plant"
}

export enum Carriers {
    FREE = "Free",
    UPS = "UPS",
    FEDEX = "FedEx",
    DHL = "DHL",
    USPS = "USPS",
    AMAZON_CARRIER = "Amazon Carrier",
    DHL_EXPRESS = "DHL Express",
    CANADA_POST = "Canada Post",
    ROYAL_MAIL = "Royal Mail",
    AUSTRALIA_POST = "Australia Post",
    SF_EXPRESS = "SF Express",
    JNE = "JNE"
}

export enum TokenExpiry {
    SHORT_TERM = "15m",   
    SHORT_TERM_24H = "24h",  
    MEDIUM_TERM = "7d",      
    LONG_TERM = "30d",     
    VERY_LONG_TERM = "90d", 
    PERMANENT = "never"     
}

export enum Currency {
    NGN = "NGN", 
    USD = "USD",
    EUR = "EUR",
    GBP = "GBP",
    JPY = "JPY",
    AUD = "AUD",
    CAD = "CAD",
    CHF = "CHF",
    CNY = "CNY",
    INR = "INR",
    ZAR = "ZAR"
}


export enum PaymentPartners {
    PAYSTACK = "Paystack",
    FLUTTERWAVE = "Flutterwave",
    STRIPE = "Stripe",
    PAYPAL = "PayPal",
    SQUARE = "Square",
    ALIPAY = "Alipay",
    WECHAT_PAY = "WeChat Pay"
}

