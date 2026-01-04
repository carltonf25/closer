export type SetupPaymentMethodResult = {
  success: boolean;
  customerId?: string;
  setupIntentClientSecret?: string;
  message?: string;
};

export type ChargeLeadResult = {
  success: boolean;
  invoiceId?: string;
  paymentIntentId?: string;
  message?: string;
};
