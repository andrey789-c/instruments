import { apiClient } from "./apiClient";

export interface SubscriptionStatus {
  active: boolean;
  expiresAt: string | null;
  plan: 'FREE' | 'PRO' | 'ENTERPRISE';
}

export interface PaymentInitResponse {
  paymentUrl: string;
  invId: number;
}

export interface InitPaymentDto {
  plan: 'PRO' | 'ENTERPRISE';
}

class SubscriptionApi {
  private readonly basePath = '/subscription';

  async getStatus(): Promise<SubscriptionStatus> {
    return apiClient.get<SubscriptionStatus>(`${this.basePath}/status`);
  }

  async initPayment(data: InitPaymentDto = { plan: 'PRO' }): Promise<PaymentInitResponse> {
    return apiClient.post<PaymentInitResponse>(`${this.basePath}/init`, data);
  }
}

export const subscriptionApi = new SubscriptionApi();