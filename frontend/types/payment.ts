export type PaymentMethod = "credit-card" | "paypal" | "bank-transfer" | "cash-on-delivery";

export interface PaymentDetails {
  method: PaymentMethod;
  cardNumber?: string;
  expiryDate?: string;
  cvv?: string;
  nameOnCard?: string;
}