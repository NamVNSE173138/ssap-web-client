import axios from "axios";
import getEndpoint from "../getEndpoint";

export async function getAllScholarshipProgram() {
    try {
        const response = await axios.get(`${getEndpoint()}/api/scholarship-programs`);
        console.log('API response:', response.data);
        return response.data;
    } catch (error: any) {
        console.error('API error:', error?.response?.data || error.message);
        throw error;
    }
}
