import axios from "axios";
import { BASE_URL } from "@/constants/api";
const ngrokSkipWarning = { headers: { "bypass-tunnel-reminder": "true" } };


export async function getUploadedScholarshipContract(request: any) {
    try {
        const response = await axios.post(
            `${BASE_URL}/api/contract-uploaded`,
            request,
            ngrokSkipWarning
        );
        return response.data;
    } catch (error) {
        console.error("Error uploading contract:", error);
        throw error;
    }
}