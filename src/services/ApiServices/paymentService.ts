import axios from "axios";
import { BASE_URL } from "@/constants/api";

const ngrokSkipWarning = { headers: { "bypass-tunnel-reminder": "true" } };

export async function createInvoice(invoiceRequest:any) {
  const response = await axios.post(
    `${BASE_URL}/api/payments/create-invoice`,
    invoiceRequest,
    ngrokSkipWarning
  );
  return response.data;
}

export async function transferMoney(transferRequest:any) {
  const response = await axios.post(
    `${BASE_URL}/api/payments/transfer-money`,
    transferRequest,
    ngrokSkipWarning
  );
  return response.data;
}

export async function getTransactionsByWalletSenderId(walletSenderId: number) {
    const response = await axios.get(
      `${BASE_URL}/api/payments/transactions/${walletSenderId}`,
      ngrokSkipWarning
    );
    return response.data;
  }

export async function handleWebhook(webhookData:any) {
  const response = await axios.post(
    `${BASE_URL}/api/payments/webhook`,
    webhookData,
    ngrokSkipWarning
  );
  return response.data;
}
