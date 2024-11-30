import axios from "axios";
import { BASE_URL } from "@/constants/api";

const ngrokSkipWarning = { headers: { "bypass-tunnel-reminder": "true" } };

export async function getProviderProfile(id: number) {
  const response = await axios.get(
    `${BASE_URL}/api/providers/${id}`,
    ngrokSkipWarning,
  );
  return response.data;
}

export async function addProviderDetails(id: number, request: any) {
  const response = await axios.post(
    `${BASE_URL}/api/providers/${id}`,
    request,
    ngrokSkipWarning,
  );
  return response.data;
}

export async function updateProviderProfile(id: number, request: any) {
  const response = await axios.put(
    `${BASE_URL}/api/providers/${id}`,
    request,
    ngrokSkipWarning,
  );
  return response.data;
}
