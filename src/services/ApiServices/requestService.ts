import axios from "axios";
import { BASE_URL } from "@/constants/api";

const ngrokSkipWarning = { headers: { "bypass-tunnel-reminder": "true" } };

export async function getAllRequests() {
    const response = await axios.get(`${BASE_URL}/api/requests`, ngrokSkipWarning);
    return response.data;
}

export async function getRequestById(id: number) {
    const response = await axios.get(`${BASE_URL}/api/requests/${id}`, ngrokSkipWarning);
    return response.data;
}

export async function createRequest(requestData: any) {
    const response = await axios.post(`${BASE_URL}/api/requests`, requestData, ngrokSkipWarning);
    return response.data;
}

export async function updateRequest(id: number, requestData: any) {
    const response = await axios.put(`${BASE_URL}/api/requests/${id}`, requestData, ngrokSkipWarning);
    return response.data;
}

export async function deleteRequest(id: number) {
    const response = await axios.delete(`${BASE_URL}/api/requests/${id}`, ngrokSkipWarning);
    return response.data;
}

export async function getRequestsByService(serviceId: number) {
    const response = await axios.get(`${BASE_URL}/api/requests/get-by-service/${serviceId}`, ngrokSkipWarning);
    return response.data;
}

export async function getRequestWithApplicantAndRequestDetails(requestId: number) {
    const response = await axios.get(`${BASE_URL}/api/requests/with-applicant-and-request-details/${requestId}`, ngrokSkipWarning);
    return response.data;
}
