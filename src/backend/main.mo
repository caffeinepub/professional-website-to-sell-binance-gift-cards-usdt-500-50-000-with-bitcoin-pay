import Map "mo:core/Map";
import Text "mo:core/Text";
import Runtime "mo:core/Runtime";
import Principal "mo:core/Principal";
import MixinAuthorization "authorization/MixinAuthorization";
import AccessControl "authorization/access-control";

actor {
  // Initialize authorization
  let accessControlState = AccessControl.initState();
  include MixinAuthorization(accessControlState);

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

  // Public function - accessible to anyone (guests, users, admins)
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

  // Public query - accessible to anyone (guests, users, admins)
  public query ({ caller }) func getOrder(id : OrderId) : async Order {
    switch (orders.get(id)) {
      case (null) { Runtime.trap("Order does not exist") };
      case (?order) { order };
    };
  };

  // Admin-only function - requires admin role
  public query ({ caller }) func getAllOrders() : async [Order] {
    if (not (AccessControl.isAdmin(accessControlState, caller))) {
      Runtime.trap("Access denied: Only the site owner can access the admin panel. Please log in using Internet Identity with the owner account.");
    };

    let entries = orders.toArray();
    entries.map(func((_, order)) { order });
  };

  // Admin-only function - requires admin role
  public shared ({ caller }) func updateOrderStatus(id : OrderId, newStatus : OrderStatus) : async () {
    if (not (AccessControl.isAdmin(accessControlState, caller))) {
      Runtime.trap("Access denied: Only the site owner can update order status. Please log in using Internet Identity with the owner account.");
    };

    let updatedOrder = switch (orders.get(id)) {
      case (null) { Runtime.trap("This order does not exist."); };
      case (?order) { { order with status = newStatus } };
    };
    orders.add(id, updatedOrder);
  };
};
