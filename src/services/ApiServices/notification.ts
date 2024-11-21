import axios from "axios";
import { BASE_URL } from "@/constants/api";

export async function subscribeToTopic(data: any) {
  const response = await axios.post(
    `${BASE_URL}/api/notifications/subscribe-to-topic`,
    data
  );
  return response.data;
}

export async function GetAllNotisFromUserId(id: number) {
  const response = await axios.get(
    `${BASE_URL}/api/notifications/get-all-by-id/${id}`
  );
  return response.data;
}

export async function ReadNotisWithId(id: number) {
  const response = await axios.put(
    `${BASE_URL}/api/notifications/read/${id}`
  );
  return response.data;
}

export async function NotifyNewUser(id: number) {
  const response = await axios.post(
    `${BASE_URL}/api/notifications/notify-new-user/${id}`,
  );
  return response.data;
}

export async function SendNotification(data: any) {
  const response = await axios.post(
    `${BASE_URL}/api/notifications/send-notification`,
    data
  );
  return response.data;
}

export async function SendNotificationAndEmail(data: any) {
  const response = await axios.post(
    `${BASE_URL}/api/notifications/send-notification-and-email`,
    data
  );
  return response.data;
}

export async function NotifyFunderNewApplicant(applicantId: number, scholarshipId: number) {
  const response = await axios.post(
    `${BASE_URL}/api/notifications/notify-funder-new-applicant?applicantId=${applicantId}&scholarshipId=${scholarshipId}`
  );
  return response.data;
}

export async function NotifyProviderNewRequest(applicantId: number, serviceId: number) {
  const response = await axios.post(
    `${BASE_URL}/api/notifications/notify-provider-new-request?applicantId=${applicantId}&serviceId=${serviceId}`
  );
  return response.data;
}
