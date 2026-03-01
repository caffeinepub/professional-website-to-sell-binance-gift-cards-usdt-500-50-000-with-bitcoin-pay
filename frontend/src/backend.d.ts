import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export interface ContactMessage {
    id: bigint;
    name: string;
    isRead: boolean;
    contactDetail: string;
    message: string;
}
export interface AdminStats {
    cancelledOrders: bigint;
    totalOrders: bigint;
    paidOrders: bigint;
    pendingOrders: bigint;
    totalContactMessages: bigint;
    totalUsdtRevenue: bigint;
    deliveredOrders: bigint;
}
export type BitcoinAddress = string;
export interface Order {
    id: OrderId;
    status: OrderStatus;
    btcPaymentAddress: BitcoinAddress;
    denomination: bigint;
    buyerContact: string;
    amountInBitcoin: string;
    usdtAmount: bigint;
}
export interface UserProfile {
    name: string;
}
export type OrderId = string;
export enum OrderStatus {
    cancelled = "cancelled",
    paid = "paid",
    pendingPayment = "pendingPayment",
    delivered = "delivered"
}
export enum UserRole {
    admin = "admin",
    user = "user",
    guest = "guest"
}
export interface backendInterface {
    assignCallerUserRole(user: Principal, role: UserRole): Promise<void>;
    bulkUpdateOrderStatus(ids: Array<OrderId>, newStatus: OrderStatus): Promise<void>;
    claimSiteOwner(): Promise<void>;
    createContactMessage(name: string, contactDetail: string, message: string): Promise<void>;
    createOrder(id: OrderId, buyerContact: string, btcPaymentAddress: BitcoinAddress, amountInBitcoin: string, denomination: bigint, usdtAmount: bigint): Promise<void>;
    getAdminStats(): Promise<AdminStats>;
    getAllOrders(): Promise<Array<Order>>;
    getCallerUserProfile(): Promise<UserProfile | null>;
    getCallerUserRole(): Promise<UserRole>;
    getContactMessages(): Promise<Array<ContactMessage>>;
    getOrder(id: OrderId): Promise<Order>;
    getOrdersByDenomination(): Promise<Array<[bigint, bigint]>>;
    getSiteOwner(): Promise<Principal | null>;
    getUnreadContactMessageCount(): Promise<bigint>;
    getUserProfile(user: Principal): Promise<UserProfile | null>;
    isCallerAdmin(): Promise<boolean>;
    isOwner(): Promise<boolean>;
    markContactMessageAsRead(id: bigint): Promise<void>;
    saveCallerUserProfile(profile: UserProfile): Promise<void>;
    updateOrderStatus(id: OrderId, newStatus: OrderStatus): Promise<void>;
}
