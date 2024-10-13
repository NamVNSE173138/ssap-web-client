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

export async function getAllAccountsWithRole() {
  const response = await axios.get(
    `${getEndpoint()}/api/accounts/with-role`,
    ngrokSkipWarning
  );
  return response.data;
}

// Fetch an account by ID
export async function getAccountById(id: number) {
  const response = await axios.get(
    `${getEndpoint()}/api/accounts/${id}`,
    ngrokSkipWarning
  );
  return response.data;
}

// Add a new account
export async function addAccount(accountData: any) {
  const response = await axios.post(
    `${getEndpoint()}/api/accounts/Add`,
    accountData,
    ngrokSkipWarning
  );
  return response.data;
}

// Update an existing account
export async function updateAccount(accountData: any) {
  const response = await axios.put(
    `${getEndpoint()}/api/accounts`,
    accountData,
    ngrokSkipWarning
  );
  return response.data;
}

// Delete an account by ID
export async function deleteAccount(id: number) {
  const response = await axios.delete(
    `${getEndpoint()}/api/accounts/${id}`,
    ngrokSkipWarning
  );
  return response.data;
}
