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