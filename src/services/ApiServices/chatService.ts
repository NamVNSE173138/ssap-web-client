import axios from "axios";
import { BASE_URL } from "@/constants/api";

export async function sendMessage(senderId: number, receiverId: number, message: string, isRead: boolean) {
  const response = await axios.post(`${BASE_URL}/api/chats/send-message`, {
    senderId,
    receiverId,
    message,
    isRead
  });
  return response.data;
}

export async function getChatHistory(userId: number, contactId: number) {
  const response = await axios.post(`${BASE_URL}/api/chats/history`, {
    userId,
    contactId,
  });
  return response.data;
}

export async function getAllMessages(receiverId: number) {
    const response = await axios.get(`${BASE_URL}/api/chats/all-messages/${receiverId}`);
    return response.data;
  }
  
