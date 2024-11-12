import axios from "axios";
import { BASE_URL } from "@/constants/api";
const ngrokSkipWarning = { headers: { "bypass-tunnel-reminder": "true" } };

export async function getApplicationWithDocumentsAndAccount(id: number) {
  const response = await axios.get(
    `${BASE_URL}/api/applications/with-documents-and-account-profile/${id}`,
    ngrokSkipWarning
  );
  return response.data;
}

export async function updateApplication(application: any) {
  const response = await axios.put(
    `${BASE_URL}/api/applications/${application.id}`,
    application,
    ngrokSkipWarning
  );
  return response.data;
}

export async function getApplicationByApplicantIdAndScholarshipId(applicantId: number, scholarshipId: number) {
  const response = await axios.get(
    `${BASE_URL}/api/applicants/by-applicantId-and-scholarshipId?applicantId=${applicantId}&scholarshipId=${scholarshipId}`,
    ngrokSkipWarning
  );
  return response.data;
}
