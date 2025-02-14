import axios from "axios";
import { BASE_URL } from "@/constants/api";


export async function getAllScholarshipProgram() {
    try {
        const response = await axios.get(`${BASE_URL}/api/scholarship-programs`);
        console.log('API response:', response.data);
        return response;
    } catch (error: any) {
        console.error('API error:', error?.response?.data || error.message);
        throw error;
    }
}

export async function deleteScholarshipProgram(id: number){
    try {
        const response = await axios.delete(`${BASE_URL}/api/scholarship-programs/${id}`);
        console.log('Scholarship program deleted successfully:', response.data);
        return response;
    } catch (error: any) {
        console.error('API error while deleting scholarship program:', error?.response?.data || error.message);
        throw error;
    }
}

export async function countScholarshipProgram() {
    try {
        const response = await axios.get(`${BASE_URL}/api/scholarship-programs/count`);
        return response.data;
    } catch (error: any) {
        console.error('API error:', error?.response?.data || error.message);
        throw error;
    }
}

export async function getAllEducationLevel() {
    try {
        const response = await axios.get(`${BASE_URL}/api/scholarship-programs/education-level`);
        return response.data;
    } catch (error: any) {
        console.error('API error:', error?.response?.data || error.message);
        throw error;
    }
}

export async function getScholarshipProgram(id: number) {
    try {
        const response = await axios.get(`${BASE_URL}/api/scholarship-programs/${id}`);
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

export async function updateScholarshipStatus(id: number, status: any) {
  const response = await axios.put(
    `${BASE_URL}/api/scholarship-programs/${id}/status`,
    status, {
      headers: {
        'Content-Type': 'application/json',
      },
    }
  );
  return response.data;
}

export async function searchScholarshipProgram(name: string, min: number, max: number, category: string, status: string, deadline: string) {
    try {
        const response = await axios.get(`${BASE_URL}/api/scholarship-programs/search?${name ? `Name=${name}` : ''}${min != null ? "&ScholarshipMinAmount=" + min : ""}${max ? "&ScholarshipMaxAmount=" + max : ""}${category ? "&Category=" + category : ""}${status ? "&Status=" + status : ""}${deadline ? "&Deadline=" + deadline : ""}`);
        console.log('API response:', response.data);
        return response.data;
    } catch (error: any) {
        console.error('API error:', error?.response?.data || error.message);
        throw error;
    }
}

export async function getAllScholarshipProgramExperts(programId:number) {
  try {
      const response = await axios.get(`${BASE_URL}/api/scholarship-programs/${programId}/experts`);
      return response.data;
  } catch (error: any) {
      console.error('API error:', error?.response?.data || error.message);
      throw error;
  }
}

export async function assignExpertsToScholarshipProgram(programId:number, expertIds:any) {
  try {
      const response = await axios.post(`${BASE_URL}/api/scholarship-programs/${programId}/experts`, {
          expertIds
      });
      return response.data;
  } catch (error: any) {
      console.error('API error:', error?.response?.data || error.message);
      throw error;
  }
}

export async function removeExpertsFromScholarshipProgram(programId:number, expertIds:any) {
  try {
      const response = await axios.put(`${BASE_URL}/api/scholarship-programs/${programId}/experts`, {
           expertIds 
      });
      return response.data;
  } catch (error: any) {
      console.error('API error:', error?.response?.data || error.message);
      throw error;
  }
}
