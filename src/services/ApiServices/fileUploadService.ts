import axios from "axios";
import { BASE_URL } from "@/constants/api";

const ngrokSkipWarning = { headers: { "bypass-tunnel-reminder": "true" } };

export async function uploadFile(files: File[]) {
  const formData = new FormData();

  files.forEach((file) => {
    formData.append("files", file);
  });

  const response = await axios.post(`${BASE_URL}/api/file-upload`, files, {
    headers: {
      "Content-Type": "multipart/form-data",
      ...ngrokSkipWarning.headers,
    },
  });
  return response.data;
}
