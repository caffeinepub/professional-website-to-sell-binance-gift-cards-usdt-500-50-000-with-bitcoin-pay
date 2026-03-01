import Map "mo:core/Map";
import Nat "mo:core/Nat";
import Principal "mo:core/Principal";

module {
  public func run(old : {
    siteOwner : ?Principal;
    orders : Map.Map<Text, { id : Text; buyerContact : Text; btcPaymentAddress : Text; amountInBitcoin : Text; status : { #pendingPayment; #paid; #delivered; #cancelled } }>;
    userProfiles : Map.Map<Principal, { name : Text }>;
    contactMessageIdCounter : Nat;
    contactMessages : Map.Map<Nat, { id : Nat; name : Text; contactDetail : Text; message : Text }>;
  }) : {
    siteOwner : ?Principal;
    orders : Map.Map<Text, { id : Text; buyerContact : Text; btcPaymentAddress : Text; amountInBitcoin : Text; status : { #pendingPayment; #paid; #delivered; #cancelled }; denomination : Nat; usdtAmount : Nat }>;
    userProfiles : Map.Map<Principal, { name : Text }>;
    contactMessageIdCounter : Nat;
    contactMessages : Map.Map<Nat, { id : Nat; name : Text; contactDetail : Text; message : Text; isRead : Bool }>;
  } {
    let migratedOrders = old.orders.map<Text, { id : Text; buyerContact : Text; btcPaymentAddress : Text; amountInBitcoin : Text; status : { #pendingPayment; #paid; #delivered; #cancelled } }, { id : Text; buyerContact : Text; btcPaymentAddress : Text; amountInBitcoin : Text; status : { #pendingPayment; #paid; #delivered; #cancelled }; denomination : Nat; usdtAmount : Nat }>(
      func(_id, order) {
        { order with denomination = 0; usdtAmount = 0 };
      }
    );

    let migratedContactMessages = old.contactMessages.map<Nat, { id : Nat; name : Text; contactDetail : Text; message : Text }, { id : Nat; name : Text; contactDetail : Text; message : Text; isRead : Bool }>(
      func(_id, msg) {
        { msg with isRead = false };
      }
    );

    {
      old with
      orders = migratedOrders;
      contactMessages = migratedContactMessages;
    };
  };
};
