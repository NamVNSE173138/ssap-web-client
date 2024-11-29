import axios from "axios";
import { BASE_URL } from "@/constants/api";

const ngrokSkipWarning = { headers: { "bypass-tunnel-reminder": "true" } };

export async function getFunderProfile(id: number) {
  const response = await axios.get(
    `${BASE_URL}/api/funders/${id}`,
    ngrokSkipWarning,
  );
  return response.data;
}

export async function getFunderExperts(id: number) {
  const response = await axios.get(
    `${BASE_URL}/api/funders/${id}/experts`,
    ngrokSkipWarning,
  );
  return response.data;
}

export async function updateFunderProfile(id: number, request: any) {
  const response = await axios.put(
    `${BASE_URL}/api/funders/${id}`,
    request,
    ngrokSkipWarning,
  );
  return response.data;
}
