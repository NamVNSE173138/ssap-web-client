import axios from "axios";
import { BASE_URL } from "@/constants/api";

export async function subscribeToTopic(data: any) {
  const response = await axios.post(
    `${BASE_URL}/api/notification/subscribe-to-topic`,
    data
  );
  return response.data;
}

export async function GetAllNotisFromUserId(id: number) {
  const response = await axios.get(
    `${BASE_URL}/api/notification/get-all-by-id/${id}`
  );
  return response.data;
}

export async function ReadNotisWithId(id: number) {
  const response = await axios.put(
    `${BASE_URL}/api/notification/read/${id}`
  );
  return response.data;
}

export async function NotifyNewUser(id: number) {
  const response = await axios.post(
    `${BASE_URL}/api/notification/notify-new-user/${id}`,
  );
  return response.data;
}
