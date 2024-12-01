import axios from "axios";
import { BASE_URL } from "@/constants/api";

const ngrokSkipWarning = { headers: { "bypass-tunnel-reminder": "true" } };

export async function getAllSkills() {
  const response = await axios.get(
    `${BASE_URL}/api/skills`,
    ngrokSkipWarning
  );
  return response.data;
}


