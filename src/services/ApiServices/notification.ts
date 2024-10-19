import axios from "axios";
import getEndpoint from "../getEndpoint";

// Fetch all applicant profiles
export async function subscribeToTopic(data: any) {
  const response = await axios.post(
    `${getEndpoint()}/api/notification/subscribe-to-topic`,
    data
  );
  return response.data;
}
