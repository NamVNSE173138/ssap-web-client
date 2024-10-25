import axios from "axios";
import { BASE_URL } from "@/constants/api";

export async function sendMessage(senderId: number, receiverId: number, message: string) {
  const response = await axios.post(`${BASE_URL}/api/chat/send-message`, {
    senderId,
    receiverId,
    message,
  });
  return response.data;
}

export async function getChatHistory(userId: number, contactId: number) {
  const response = await axios.post(`${BASE_URL}/api/chat/history`, {
    userId,
    contactId,
  });
  return response.data;
}

export async function getAllMessages(receiverId: number) {
    const response = await axios.get(`${BASE_URL}/api/chat/all-messages/${receiverId}`);
    return response.data;
  }
  
