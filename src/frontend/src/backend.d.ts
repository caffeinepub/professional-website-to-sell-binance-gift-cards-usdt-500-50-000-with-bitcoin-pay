import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export type BitcoinAddress = string;
export interface Order {
    id: OrderId;
    status: OrderStatus;
    btcPaymentAddress: BitcoinAddress;
    buyerContact: string;
    amountInBitcoin: string;
}
export type OrderId = string;
export enum OrderStatus {
    cancelled = "cancelled",
    paid = "paid",
    pendingPayment = "pendingPayment",
    delivered = "delivered"
}
export interface backendInterface {
    createOrder(id: OrderId, buyerContact: string, btcPaymentAddress: BitcoinAddress, amountInBitcoin: string): Promise<void>;
    getAllOrders(): Promise<Array<Order>>;
    getOrder(id: OrderId): Promise<Order>;
    updateOrderStatus(id: OrderId, newStatus: OrderStatus): Promise<void>;
}
