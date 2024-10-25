import axios from "axios";
import { BASE_URL } from "@/constants/api";

const ngrokSkipWarning = { headers: { "bypass-tunnel-reminder": "true" } };

// Fetch all accounts
export async function getAllAccounts() {
  const response = await axios.get(
    `${BASE_URL}/api/accounts`,
    ngrokSkipWarning
  );
  return response.data;
}

export async function getAccountById(id: number) {
  const response = await axios.get(
    `${BASE_URL}/api/accounts/${id}`,
    ngrokSkipWarning
  );
  return response.data;
}

export async function addAccount(accountData: any) {
  const response = await axios.post(
    `${BASE_URL}/api/accounts/Add`,
    accountData,
    ngrokSkipWarning
  );
  return response.data;
}

export async function updateAccount(accountData: any) {
  const response = await axios.put(
    `${BASE_URL}/api/accounts/${accountData.id}`,
    accountData,
    ngrokSkipWarning
  );
  return response.data;
}

export async function deleteAccount(id: number) {
  const response = await axios.delete(
    `${BASE_URL}/api/accounts/${id}`,
    ngrokSkipWarning
  );
  return response.data;
}
