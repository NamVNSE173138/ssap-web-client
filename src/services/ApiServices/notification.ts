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

export async function GetAllNotisFromUserId(id: number) {
  const response = await axios.get(
    `${getEndpoint()}/api/notification/get-all-by-id/${id}`
  );
  return response.data;
}

export async function ReadNotisWithId(id: number) {
  const response = await axios.put(
    `${getEndpoint()}/api/notification/read/${id}`
  );
  return response.data;
}

export async function NotifyNewUser(id: number) {
  const response = await axios.post(
    `${getEndpoint()}/api/notification/notify-new-user/${id}`,
  );
  return response.data;
}
