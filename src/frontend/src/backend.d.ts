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
    contactDetail: string;
    message: string;
}
export type BitcoinAddress = string;
export interface Order {
    id: OrderId;
    status: OrderStatus;
    btcPaymentAddress: BitcoinAddress;
    buyerContact: string;
    amountInBitcoin: string;
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
    claimSiteOwner(): Promise<void>;
    createContactMessage(name: string, contactDetail: string, message: string): Promise<void>;
    createOrder(id: OrderId, buyerContact: string, btcPaymentAddress: BitcoinAddress, amountInBitcoin: string): Promise<void>;
    getAllOrders(): Promise<Array<Order>>;
    getCallerUserProfile(): Promise<UserProfile | null>;
    getCallerUserRole(): Promise<UserRole>;
    getContactMessages(): Promise<Array<ContactMessage>>;
    getOrder(id: OrderId): Promise<Order>;
    getSiteOwner(): Promise<Principal | null>;
    getUserProfile(user: Principal): Promise<UserProfile | null>;
    isCallerAdmin(): Promise<boolean>;
    isOwner(): Promise<boolean>;
    saveCallerUserProfile(profile: UserProfile): Promise<void>;
    updateOrderStatus(id: OrderId, newStatus: OrderStatus): Promise<void>;
}
