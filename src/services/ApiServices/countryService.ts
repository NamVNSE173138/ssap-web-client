import axios from "axios";
import { BASE_URL } from "@/constants/api";

const ngrokSkipWarning = { headers: { "bypass-tunnel-reminder": "true" } };

// Fetch all accounts
export async function getAllCountries() {
  const response = await axios.get(
    `${BASE_URL}/api/countries`,
    ngrokSkipWarning
  );
  return response.data;
}

