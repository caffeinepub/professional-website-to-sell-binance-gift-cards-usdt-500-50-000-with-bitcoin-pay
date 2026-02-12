import Map "mo:core/Map";
import Text "mo:core/Text";
import Runtime "mo:core/Runtime";

actor {
  type BitcoinAddress = Text;
  type OrderId = Text;

  type OrderStatus = {
    #pendingPayment;
    #paid;
    #delivered;
    #cancelled;
  };

  type Order = {
    id : OrderId;
    buyerContact : Text;
    btcPaymentAddress : BitcoinAddress;
    amountInBitcoin : Text;
    status : OrderStatus;
  };

  let orders = Map.empty<OrderId, Order>();

  public shared ({ caller }) func createOrder(id : OrderId, buyerContact : Text, btcPaymentAddress : BitcoinAddress, amountInBitcoin : Text) : async () {
    if (orders.containsKey(id)) { Runtime.trap("Order already exists") };

    let newOrder = {
      id;
      buyerContact;
      btcPaymentAddress;
      amountInBitcoin;
      status = #pendingPayment;
    };
    orders.add(id, newOrder);
  };

  public query ({ caller }) func getOrder(id : OrderId) : async Order {
    switch (orders.get(id)) {
      case (null) { Runtime.trap("Order does not exist") };
      case (?order) { order };
    };
  };

  public query ({ caller }) func getAllOrders() : async [Order] {
    let entries = orders.toArray();
    entries.map(func((_, order)) { order });
  };

  public shared ({ caller }) func updateOrderStatus(id : OrderId, newStatus : OrderStatus) : async () {
    let updatedOrder = switch (orders.get(id)) {
      case (null) { Runtime.trap("This order does not exist.") };
      case (?order) { { order with status = newStatus } };
    };
    orders.add(id, updatedOrder);
  };
};
