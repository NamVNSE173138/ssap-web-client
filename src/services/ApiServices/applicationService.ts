import axios from "axios";
import { BASE_URL } from "@/constants/api";
const ngrokSkipWarning = { headers: { "bypass-tunnel-reminder": "true" } };

export async function getApplicationWithDocumentsAndAccount(id: number) {
  const response = await axios.get(
    `${BASE_URL}/api/applications/with-documents-and-account-profile/${id}`,
    ngrokSkipWarning
  );
  return response.data;
}
