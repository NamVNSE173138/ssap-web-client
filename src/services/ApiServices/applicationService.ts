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

export async function deleteApplication(id: number) {
  const response = await axios.delete(
    `${BASE_URL}/api/applications/${id}`,
    ngrokSkipWarning
  );
  return response.data;
}

export async function updateApplication(id: number, application: any) {
  const response = await axios.put(
    `${BASE_URL}/api/applications/${id}`,
    application,
    ngrokSkipWarning
  );
  return response.data;
}


export async function extendApplication(profileData: any) {

  const response = await axios.put(
    `${BASE_URL}/api/applications/extend`,
    profileData,
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
