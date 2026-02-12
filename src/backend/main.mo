import Map "mo:core/Map";
import Text "mo:core/Text";
import Runtime "mo:core/Runtime";
import Principal "mo:core/Principal";
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

  public type UserProfile = {
    name : Text;
  };

  let orders = Map.empty<OrderId, Order>();
  let userProfiles = Map.empty<Principal, UserProfile>();

  type ContactMessage = {
    id : Nat;
    name : Text;
    contactDetail : Text;
    message : Text;
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

  public shared ({ caller }) func createOrder(id : OrderId, buyerContact : Text, btcPaymentAddress : BitcoinAddress, amountInBitcoin : Text) : async () {
    // Public function - anyone including guests can create orders (e-commerce checkout)
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
    // Public function - anyone can view order details (needed for payment confirmation)
    switch (orders.get(id)) {
      case (null) {
        Runtime.trap("Order does not exist");
      };
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
      case (null) { Runtime.trap("This order does not exist."); };
      case (?order) { { order with status = newStatus } };
    };
    orders.add(id, updatedOrder);
  };

  public shared ({ caller }) func createContactMessage(name : Text, contactDetail : Text, message : Text) : async () {
    // Public function - anyone including guests can submit contact messages
    let newMessage : ContactMessage = {
      id = contactMessageIdCounter;
      name;
      contactDetail;
      message;
    };

    contactMessages.add(contactMessageIdCounter, newMessage);
    contactMessageIdCounter += 1;
  };

  public query ({ caller }) func getContactMessages() : async [ContactMessage] {
    checkAdminOrOwner(caller);
    let entries = contactMessages.toArray();
    entries.map(func((_, msg)) { msg });
  };
};
