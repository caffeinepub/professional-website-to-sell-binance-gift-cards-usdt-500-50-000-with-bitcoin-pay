import Map "mo:core/Map";
import Text "mo:core/Text";
import Runtime "mo:core/Runtime";
import Principal "mo:core/Principal";
import Iter "mo:core/Iter";
import Nat "mo:core/Nat";
import MixinAuthorization "authorization/MixinAuthorization";
import AccessControl "authorization/access-control";
import Migration "migration";

(with migration = Migration.run)
actor {
  var siteOwner : ?Principal = null;
  let accessControlState = AccessControl.initState();

  include MixinAuthorization(accessControlState);

  type BitcoinAddress = Text;
  type OrderId = Text;

  public type OrderStatus = {
    #pendingPayment;
    #paid;
    #delivered;
    #cancelled;
  };

  public type Order = {
    id : OrderId;
    buyerContact : Text;
    btcPaymentAddress : BitcoinAddress;
    amountInBitcoin : Text;
    status : OrderStatus;
    denomination : Nat;
    usdtAmount : Nat;
  };

  public type UserProfile = {
    name : Text;
  };

  let orders = Map.empty<OrderId, Order>();
  let userProfiles = Map.empty<Principal, UserProfile>();

  public type ContactMessage = {
    id : Nat;
    name : Text;
    contactDetail : Text;
    message : Text;
    isRead : Bool;
  };

  var contactMessageIdCounter = 0;
  let contactMessages = Map.empty<Nat, ContactMessage>();

  public query ({ caller }) func isOwner() : async Bool {
    switch (siteOwner) {
      case (null) { false };
      case (?owner) { Principal.equal(caller, owner) };
    };
  };

  public query ({ caller }) func getSiteOwner() : async ?Principal {
    siteOwner;
  };

  public shared ({ caller }) func claimSiteOwner() : async () {
    if (siteOwner != null) {
      Runtime.trap("Site owner has already been claimed");
    };
    siteOwner := ?caller;
  };

  func checkAdminOrOwner(caller : Principal) {
    let isOwner = switch (siteOwner) {
      case (null) { false };
      case (?owner) { Principal.equal(caller, owner) };
    };
    if (not isOwner and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Only admins or the site owner can perform this action");
    };
  };

  public query ({ caller }) func getCallerUserProfile() : async ?UserProfile {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view profiles");
    };
    userProfiles.get(caller);
  };

  public query ({ caller }) func getUserProfile(user : Principal) : async ?UserProfile {
    if (caller != user and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Can only view your own profile");
    };
    userProfiles.get(user);
  };

  public shared ({ caller }) func saveCallerUserProfile(profile : UserProfile) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can save profiles");
    };
    userProfiles.add(caller, profile);
  };

  public shared func createOrder(
    id : OrderId,
    buyerContact : Text,
    btcPaymentAddress : BitcoinAddress,
    amountInBitcoin : Text,
    denomination : Nat,
    usdtAmount : Nat,
  ) : async () {
    if (orders.containsKey(id)) { Runtime.trap("Order already exists") };

    let newOrder : Order = {
      id;
      buyerContact;
      btcPaymentAddress;
      amountInBitcoin;
      status = #pendingPayment;
      denomination;
      usdtAmount;
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
    checkAdminOrOwner(caller);
    let entries = orders.toArray();
    entries.map(func((_, order)) { order });
  };

  public shared ({ caller }) func updateOrderStatus(id : OrderId, newStatus : OrderStatus) : async () {
    checkAdminOrOwner(caller);

    let updatedOrder = switch (orders.get(id)) {
      case (null) { Runtime.trap("This order does not exist.") };
      case (?order) { { order with status = newStatus } };
    };
    orders.add(id, updatedOrder);
  };

  public shared ({ caller }) func bulkUpdateOrderStatus(ids : [OrderId], newStatus : OrderStatus) : async () {
    checkAdminOrOwner(caller);

    for (id in ids.values()) {
      switch (orders.get(id)) {
        case (null) {};
        case (?order) {
          orders.add(id, { order with status = newStatus });
        };
      };
    };
  };

  public query ({ caller }) func getOrdersByDenomination() : async [(Nat, Nat)] {
    checkAdminOrOwner(caller);

    let denominationCounts = Map.empty<Nat, Nat>();

    for ((_, order) in orders.entries()) {
      let count = switch (denominationCounts.get(order.denomination)) {
        case (null) { 0 };
        case (?existingCount) { existingCount };
      };
      denominationCounts.add(order.denomination, count + 1);
    };

    denominationCounts.toArray();
  };

  public shared func createContactMessage(name : Text, contactDetail : Text, message : Text) : async () {
    let newMessage : ContactMessage = {
      id = contactMessageIdCounter;
      name;
      contactDetail;
      message;
      isRead = false;
    };

    contactMessages.add(contactMessageIdCounter, newMessage);
    contactMessageIdCounter += 1;
  };

  public query ({ caller }) func getContactMessages() : async [ContactMessage] {
    checkAdminOrOwner(caller);
    let entries = contactMessages.toArray();
    entries.map(func((_, msg)) { msg });
  };

  public shared ({ caller }) func markContactMessageAsRead(id : Nat) : async () {
    checkAdminOrOwner(caller);

    switch (contactMessages.get(id)) {
      case (null) { Runtime.trap("Cannot mark as read: Message does not exist") };
      case (?message) {
        contactMessages.add(id, { message with isRead = true });
      };
    };
  };

  public query ({ caller }) func getUnreadContactMessageCount() : async Nat {
    checkAdminOrOwner(caller);

    var unreadCount = 0;
    for ((_, message) in contactMessages.entries()) {
      if (not message.isRead) {
        unreadCount += 1;
      };
    };
    unreadCount;
  };

  public type AdminStats = {
    totalOrders : Nat;
    pendingOrders : Nat;
    paidOrders : Nat;
    deliveredOrders : Nat;
    cancelledOrders : Nat;
    totalUsdtRevenue : Nat;
    totalContactMessages : Nat;
  };

  public query ({ caller }) func getAdminStats() : async AdminStats {
    checkAdminOrOwner(caller);

    let ordersArray = orders.toArray();
    var totalOrders = ordersArray.size();
    var pendingOrders = 0;
    var paidOrders = 0;
    var deliveredOrders = 0;
    var cancelledOrders = 0;
    var totalUsdtRevenue = 0;

    for ((_, order) in orders.entries()) {
      switch (order.status) {
        case (#pendingPayment) { pendingOrders += 1 };
        case (#paid) { paidOrders += 1 };
        case (#delivered) {
          deliveredOrders += 1;
          totalUsdtRevenue += order.usdtAmount;
        };
        case (#cancelled) { cancelledOrders += 1 };
      };
    };

    {
      totalOrders;
      pendingOrders;
      paidOrders;
      deliveredOrders;
      cancelledOrders;
      totalUsdtRevenue;
      totalContactMessages = contactMessages.size();
    };
  };
};
