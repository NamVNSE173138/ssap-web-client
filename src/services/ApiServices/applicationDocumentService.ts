import axios from "axios";
import { BASE_URL } from "@/constants/api";
const ngrokSkipWarning = { headers: { "bypass-tunnel-reminder": "true" } };

export async function getAllApplicationDocuments() {
  const response = await axios.get(
    `${BASE_URL}/api/application-documents`,
    ngrokSkipWarning
  );
  return response.data;
}

export async function getApplicationDocumentsById(id: number) {

  const response = await axios.get(
    `${BASE_URL}/api/application-documents/${id}`,
    ngrokSkipWarning
  );
  return response.data;
}

export async function addApplicationDocument(profileData: any) {

  const response = await axios.post(
    `${BASE_URL}/api/application-documents`,
    profileData,
    ngrokSkipWarning
  );
  return response.data;
}

export async function deleteApplicationDocument(id: number) {

  const response = await axios.delete(
    `${BASE_URL}/api/application-documents/${id}`,
    ngrokSkipWarning
  );
  return response.data;
}
