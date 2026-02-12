import Map "mo:core/Map";
import Principal "mo:core/Principal";

module {
  type OldActor = {
    // Backwards compatible change - no state change
    siteOwner : ?Principal;
    orders : Map.Map<Text, { id : Text; buyerContact : Text; btcPaymentAddress : Text; amountInBitcoin : Text; status : { #pendingPayment; #paid; #delivered; #cancelled } }>;
    userProfiles : Map.Map<Principal, { name : Text }>;
    contactMessages : Map.Map<Nat, { id : Nat; name : Text; contactDetail : Text; message : Text }>;
    contactMessageIdCounter : Nat;
  };

  // New actor type after accepting the backwards compatible change
  type NewActor = {
    siteOwner : ?Principal;
    orders : Map.Map<Text, { id : Text; buyerContact : Text; btcPaymentAddress : Text; amountInBitcoin : Text; status : { #pendingPayment; #paid; #delivered; #cancelled } }>;
    userProfiles : Map.Map<Principal, { name : Text }>;
    contactMessages : Map.Map<Nat, { id : Nat; name : Text; contactDetail : Text; message : Text }>;
    contactMessageIdCounter : Nat;
  };

  public func run(old : OldActor) : NewActor {
    old;
  };
};
