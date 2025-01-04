import axios from "axios";
import { BASE_URL } from "@/constants/api";
const ngrokSkipWarning = { headers: { "bypass-tunnel-reminder": "true" } };

export async function getAllApplications() {
  const response = await axios.get(
    `${BASE_URL}/api/applications`,
    ngrokSkipWarning
  );
  return response.data;
}

export async function getApplicationWithDocumentsAndAccount(id: number) {
  const response = await axios.get(
    `${BASE_URL}/api/applications/with-documents-and-account-profile/${id}`,
    ngrokSkipWarning
  );
  return response.data;
}

export async function addApplication(application: any) {
  const response = await axios.post(
    `${BASE_URL}/api/applications`,
    application,
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


export async function fetchFirstReviewData(scholarshipId: string, token: string) {
  const response = await axios.get(`${BASE_URL}/api/applications/reviews/result`, {
    headers: { Authorization: `Bearer ${token}` },
    params: { isFirstReview: true, scholarshipProgramId: scholarshipId },
  });
  return response.data.data;
}

export async function fetchSecondReviewData(scholarshipId: string, token: string) {
  const response = await axios.get(`${BASE_URL}/api/applications/reviews/result`, {
    headers: { Authorization: `Bearer ${token}` },
    params: { isFirstReview: false, scholarshipProgramId: scholarshipId },
  });
  return response.data.data;
}

export async function assignExpertsToApplicationApi(data: any, token: string) {
  const response = await axios.post(`${BASE_URL}/api/applications/reviews/assign-experts-to-application`, data, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
}

export async function getReviewsOfApplications(applicationIds: any[], token: string) {
  const response = await axios.get(`${BASE_URL}/api/applications/reviews/reviews-of-applications?` +
    `${applicationIds.map((id) => `applicationIds=${id}`).join('&')}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data.data;
}
