import axios from "axios";
import { BASE_URL } from "@/constants/api";

const ngrokSkipWarning = { headers: { "bypass-tunnel-reminder": "true" } };

export async function createCheckoutSession(checkoutSessionRequest:any) {
  const response = await axios.post(
    `${BASE_URL}/api/payments/stripe-checkout`,
    checkoutSessionRequest,
    ngrokSkipWarning
  );
  return response.data;
}

export async function createInvoice(invoiceRequest: any) {
  const response = await axios.post(
    `${BASE_URL}/api/payments/create-invoice`,
    invoiceRequest,
    ngrokSkipWarning
  );
  return response.data;
}

export async function transferMoney(transferRequest: any) {
  const response = await axios.post(
    `${BASE_URL}/api/payments/transfer-money`,
    transferRequest,
    ngrokSkipWarning
  );
  return response.data;
}

export async function getTransactionsByWalletSenderId(walletUserId: number) {
  const response = await axios.get(
    `${BASE_URL}/api/payments/transactions/${walletUserId}`,
    ngrokSkipWarning
  );
  return response.data;
}

export async function getAllTransactions() {
  const response = await axios.get(
    `${BASE_URL}/api/payments/transactions`,
    ngrokSkipWarning
  );
  return response.data;
}

export async function handleWebhook(webhookData: any) {
  const response = await axios.post(
    `${BASE_URL}/api/payments/webhook`,
    webhookData,
    ngrokSkipWarning
  );
  return response.data;
}
