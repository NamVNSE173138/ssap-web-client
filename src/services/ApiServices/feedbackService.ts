import axios from "axios";
import { BASE_URL } from "@/constants/api";

const ngrokSkipWarning = { headers: { "bypass-tunnel-reminder": "true" } };

export async function getAllFeedbacks() {
    const response = await axios.get(`${BASE_URL}/api/feedbacks`, ngrokSkipWarning);
    return response.data; 
}

export async function getFeedbackById(id:number) {
    const response = await axios.get(`${BASE_URL}/api/feedbacks/${id}`, ngrokSkipWarning);
    return response.data; 
}

export async function addFeedback(addFeedbackDto:any) {
    const response = await axios.post(`${BASE_URL}/api/feedbacks`, addFeedbackDto, ngrokSkipWarning);
    return response.data;
}

export async function updateFeedback(id:number, updateFeedbackDto:any) {
    const response = await axios.put(`${BASE_URL}/api/feedbacks/${id}`, updateFeedbackDto, ngrokSkipWarning);
    return response.data;
}
