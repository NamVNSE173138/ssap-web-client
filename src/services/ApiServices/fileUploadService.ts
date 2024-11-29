import axios from "axios";
import { BASE_URL } from "@/constants/api";

const ngrokSkipWarning = { headers: { "bypass-tunnel-reminder": "true" } };

export async function uploadFile(files: File[]) {
  const formData = new FormData();

  files.forEach((file) => {
    formData.append("files", file);
  });

  for (let [key, value] of formData.entries()) {
    console.log("Key:", key, "Value:", value);
  }

  const response = await axios.post(`${BASE_URL}/api/file-upload`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
      ...ngrokSkipWarning.headers,
    },
  });

  return response.data;
}
