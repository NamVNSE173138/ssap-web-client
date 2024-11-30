import axios from "axios";
import { BASE_URL } from "@/constants/api";
const ngrokSkipWarning = { headers: { "bypass-tunnel-reminder": "true" } };

export async function getAllCategories() {
  const response = await axios.get(
    `${BASE_URL}/api/categories`,
    ngrokSkipWarning
  );
  return response.data;
}

export async function addCategory(data: any) {
  const response = await axios.post(
    `${BASE_URL}/api/categories`,
    data,
    ngrokSkipWarning
  );
  return response.data;
}

export async function editCategory(id: number, data: any) {
  const response = await axios.put(
    `${BASE_URL}/api/categories/${id}`,
    data,
    ngrokSkipWarning
  );
  return response.data;
}
