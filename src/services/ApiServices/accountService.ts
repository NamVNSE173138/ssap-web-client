import axios from "axios";
import getEndpoint from "../getEndpoint";

const ngrokSkipWarning = { headers: { "bypass-tunnel-reminder": "true" } };

// Fetch all accounts
export async function getAllAccounts() {
  const response = await axios.get(
    `${getEndpoint()}/api/accounts`,
    ngrokSkipWarning
  );
  return response.data;
}

export async function getAccountById(id: number) {
  const response = await axios.get(
    `${getEndpoint()}/api/accounts/${id}`,
    ngrokSkipWarning
  );
  return response.data;
}

export async function addAccount(accountData: any) {
  const response = await axios.post(
    `${getEndpoint()}/api/accounts/Add`,
    accountData,
    ngrokSkipWarning
  );
  return response.data;
}

export async function updateAccount(accountData: any) {
  const response = await axios.put(
    `${getEndpoint()}/api/accounts/${accountData.id}`,
    accountData,
    ngrokSkipWarning
  );
  return response.data;
}

export async function deleteAccount(id: number) {
  const response = await axios.delete(
    `${getEndpoint()}/api/accounts/${id}`,
    ngrokSkipWarning
  );
  return response.data;
}
