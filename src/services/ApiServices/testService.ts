import axios from "axios";
import { BASE_URL } from "@/constants/api";

const ngrokSkipWarning = { headers: { "bypass-tunnel-reminder": "true" } };

export async function uploadFile(files:any) {
  const formData = new FormData();

  files.forEach((file:any) => {
    formData.append("files", file);
  });

  console.log("FormData before upload:", Array.from(formData.entries()));
  
  const response = await axios.post(
    `${BASE_URL}/api/test/upload-file`,
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
        ...ngrokSkipWarning.headers,
      },
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
