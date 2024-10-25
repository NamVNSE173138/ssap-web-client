import axios from "axios";
import { BASE_URL } from "@/constants/api";


export async function getAllScholarshipProgram() {
    try {
        const response = await axios.get(`${BASE_URL}/api/scholarship-programs`);
        console.log('API response:', response.data);
        return response.data;
    } catch (error: any) {
        console.error('API error:', error?.response?.data || error.message);
        throw error;
    }
}

// Fetch an applicant profile by ID
export async function getAllScholarshipProgramByMajorId(id: number) {
  const response = await axios.get(
    `${BASE_URL}/api/scholarship-programs/by-major-id/${id}`
  );
  return response.data;
}
