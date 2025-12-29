import { apiClient } from "../core/apiClient";

export interface CreateCheckoutSession {
  reservationId: number;
  amount: number;
  currency: string;
  productName?: string;
  productDescription?: string;
  userEmail: string;
}

export interface CheckoutSessionResponse {
  sessionId: string;
  sessionUrl: string;
  publishableKey: string;
}

export const paymentService = {
  createCheckoutSession: async (
    data: CreateCheckoutSession
  ): Promise<CheckoutSessionResponse> => {
    return apiClient.post<CheckoutSessionResponse>(
      "/api/payments/create-checkout-session",
      data
    );
  },

  confirmPayment: async (sessionId: string): Promise<any> => {
    return apiClient.post("/api/payments/confirm", { sessionId });
  },

  redirectToCheckout: (sessionUrl: string): void => {
    window.location.href = sessionUrl;
  },
};
