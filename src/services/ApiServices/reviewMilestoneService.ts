import axios from "axios";
import { BASE_URL } from "@/constants/api";

const ngrokSkipWarning = { headers: { "bypass-tunnel-reminder": "true" } };

export async function getAllReviewMilestones() {
    const response = await axios.get(`${BASE_URL}/api/review-milestones`, ngrokSkipWarning);
    return response.data;
}

export async function getAllReviewMilestonesByScholarship(id: number) {
    const response = await axios.get(`${BASE_URL}/api/review-milestones/by-scholarship/${id}`, ngrokSkipWarning);
    return response.data;
}

export async function getReviewMilestoneById(id: number) {
    const response = await axios.get(`${BASE_URL}/api/review-milestones/${id}`, ngrokSkipWarning);
    return response.data;
}

export async function createReviewMilestone(requestData: any) {
    const response = await axios.post(`${BASE_URL}/api/review-milestones`, requestData, ngrokSkipWarning);
    return response.data;
}

export async function updateReviewMilestone(id: number, requestData: any) {
    const response = await axios.put(`${BASE_URL}/api/review-milestones/${id}`, requestData, ngrokSkipWarning);
    return response.data;
}

export async function deleteReviewMilestone(id: number) {
    const response = await axios.delete(`${BASE_URL}/api/review-milestones/${id}`, ngrokSkipWarning);
    return response.data;
}
