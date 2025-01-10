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
    
export enum DbModels {
    USER = "User",
    ROLE = "Role",
    MERCHANT = "Merchant",
    GUEST = "Guest",
    SESSIONTOKEN = "SessionToken",
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
