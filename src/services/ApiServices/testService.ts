import axios from "axios";
import { BASE_URL } from "@/constants/api";

const ngrokSkipWarning = { headers: { "bypass-tunnel-reminder": "true" } };

export async function uploadFile(file:any) {
  const response = await axios.post(
    `${BASE_URL}/api/test/upload-file`, file,
    {
        headers: {
            "Content-Type": "multipart/form-data",
        }
    }
  );
  return response.data;
}

export async function deleteFile(publicId:string) {
  const response = await axios.delete(
    `${BASE_URL}/api/test/delete-file/${publicId}` 
      );
  return response.data;
}
