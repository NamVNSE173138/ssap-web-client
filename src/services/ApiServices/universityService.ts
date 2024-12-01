import axios from "axios";
import { BASE_URL } from "@/constants/api";

const ngrokSkipWarning = { headers: { "bypass-tunnel-reminder": "true" } };

export async function getAllUniversities() {
  const response = await axios.get(
    `${BASE_URL}/api/universities`,
    ngrokSkipWarning
  );
  return response.data;
}

export async function addUniversities(data: any) {
  const response = await axios.post(
    `${BASE_URL}/api/universities`,
    data,
    ngrokSkipWarning
  );
  return response.data;
}

export async function updateUniversities(id: number, data:any) {
  const response = await axios.put(
    `${BASE_URL}/api/universities/${id}`,
    data,
    ngrokSkipWarning
  );
  return response.data;
}


