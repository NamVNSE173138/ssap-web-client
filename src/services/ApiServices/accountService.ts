import axios from "axios";
import { BASE_URL } from "@/constants/api";

const ngrokSkipWarning = { headers: { "bypass-tunnel-reminder": "true" } };

// Fetch all accounts
export async function getAllAccounts() {
  const response = await axios.get(
    `${BASE_URL}/api/accounts`,
    ngrokSkipWarning,
  );
  return response.data;
}

export async function getAccountById(id: number) {
  const response = await axios.get(
    `${BASE_URL}/api/accounts/${id}`,
    ngrokSkipWarning,
  );
  return response.data;
}

export async function getApplicationsByScholarship(scholarshipId: number) {
  const response = await axios.get(
    `${BASE_URL}/api/applications/get-by-scholarship/${scholarshipId}`,
    ngrokSkipWarning,
  );
  return response.data;
}

export async function addAccount(accountData: any) {
  const response = await axios.post(
    `${BASE_URL}/api/accounts/Add`,
    accountData,
    ngrokSkipWarning,
  );
  return response.data;
}

export async function changeAvatar(id: number, accountData: any) {
  const response = await axios.post(
    `${BASE_URL}/api/accounts/${id}/change-avatar`,
    accountData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    },
  );
  return response.data;
}

export async function updateAccount(accountData: any) {
  const response = await axios.put(
    `${BASE_URL}/api/accounts/${accountData.id}`,
    accountData,
    ngrokSkipWarning,
  );
  return response.data;
}

export const changePassword = async (id: number, payload: any) => {
  const response = await axios.post(
    `${BASE_URL}/api/accounts/${id}/change-password`,
    payload,
    ngrokSkipWarning,
  );
  return response.data;
};

export async function deleteAccount(id: number) {
  const response = await axios.delete(
    `${BASE_URL}/api/accounts/${id}`,
    ngrokSkipWarning,
  );
  return response.data;
}

export async function getAllWallets() {
  const response = await axios.get(
    `${BASE_URL}/api/accounts/wallets`,
    ngrokSkipWarning,
  );
  return response.data;
}

export async function getAccountWallet(id: number) {
  const response = await axios.get(
    `${BASE_URL}/api/accounts/${id}/wallet`,
    ngrokSkipWarning,
  );
  return response.data;
}

export async function createWallet(id: number, createWalletDto: any) {
  const response = await axios.post(
    `${BASE_URL}/api/accounts/${id}/wallet`,
    createWalletDto,
    ngrokSkipWarning,
  );
  return response.data;
}

export async function updateWalletBalance(
  id: number,
  updateWalletBalanceDto: any,
) {
  const response = await axios.put(
    `${BASE_URL}/api/accounts/${id}/wallet`,
    updateWalletBalanceDto,
    ngrokSkipWarning,
  );
  return response.data;
}

export async function updateWalletBankInformation(
  id: number,
  updateWalletBankInformationDto: any,
) {
  const response = await axios.put(
    `${BASE_URL}/api/accounts/${id}/wallet/bank-information`,
    updateWalletBankInformationDto,
    ngrokSkipWarning,
  );
  return response.data;
}

export async function forgotPassword(email: string) {
  const response = await axios.post(
    `${BASE_URL}/api/accounts/forgot-password`,
    { Email: email },
    ngrokSkipWarning,
  );
  return response.data;
}

export async function verifyOtp(email: string, otp: string) {
  const response = await axios.post(
    `${BASE_URL}/api/accounts/verify-otp`,
    { Email: email, Otp: otp },
    ngrokSkipWarning,
  );
  return response.data;
}

export async function sendOtp(email: any) {
  const response = await axios.post(
    `${BASE_URL}/api/accounts/send-otp`,
    { Email: email },
    ngrokSkipWarning,
  );
  return response.data;
}

