import axios from "axios";
import { BASE_URL } from "@/constants/api";
const ngrokSkipWarning = { headers: { "bypass-tunnel-reminder": "true" } };

export async function getAwardMilestoneByScholarship(id: number) {
  const response = await axios.get(
    `${BASE_URL}/api/award-milestones/by-scholarship/${id}`,
    ngrokSkipWarning
  );
  return response.data;
}
