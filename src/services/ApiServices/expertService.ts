import axios from "axios";
import { BASE_URL } from "@/constants/api";

const ngrokSkipWarning = { headers: { "bypass-tunnel-reminder": "true" } };

// Fetch all accounts
export async function getAllExperts() {
  const response = await axios.get(`${BASE_URL}/api/experts`, ngrokSkipWarning);
  return response.data;
}

export async function getExpertProfile(id: number) {
  const response = await axios.get(
    `${BASE_URL}/api/experts/${id}`,
    ngrokSkipWarning,
  );
  return response.data;
}

export async function getExpertsByFunder(funderId: number) {
  const response = await axios.get(
    `${BASE_URL}/api/experts/funder/${funderId}`,
    ngrokSkipWarning
  );
  return response.data;
}

export async function updateExpertProfile(id: number, request: any) {
  const response = await axios.put(
    `${BASE_URL}/api/experts/${id}`,
    request,
    ngrokSkipWarning,
  );
  return response.data;
}
