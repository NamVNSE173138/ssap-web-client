import axios from "axios";
import { BASE_URL } from "@/constants/api";
const ngrokSkipWarning = { headers: { "bypass-tunnel-reminder": "true" } };

export async function getAllApplicantProfiles() {
  const response = await axios.get(
    `${BASE_URL}/api/applicant-profiles`,
    ngrokSkipWarning
  );
  return response.data;
}

export async function getApplicantProfileById(id: number) {

  const response = await axios.get(
    `${BASE_URL}/api/applicant-profiles/${id}`,
    ngrokSkipWarning
  );
  return response.data;
}

export async function getAllApplicantProfilesByApplicant(id: number) {

  const response = await axios.get(
    `${BASE_URL}/api/applicant-profiles/byapplicant/${id}`,
    ngrokSkipWarning
  );
  return response.data;
}

export async function addApplicantProfile(profileData: any) {

  const response = await axios.post(
    `${BASE_URL}/api/applicant-profiles/Add`,
    profileData,
    ngrokSkipWarning
  );
  return response.data;
}

export async function updateApplicantProfile(profileData: any) {

  const response = await axios.put(
    `${BASE_URL}/api/applicant-profiles`,
    profileData,
    ngrokSkipWarning
  );
  return response.data;
}

export async function addOrUpdateApplicantProfile(profileData: any) {

  const response = await axios.post(
    `${BASE_URL}/api/applicant-profiles/addorupdateprofile`,
    profileData,
    ngrokSkipWarning
  );
  return response.data;
}

export async function deleteApplicantProfile(id: number) {

  const response = await axios.delete(
    `${BASE_URL}/api/applicant-profiles/${id}`,
    ngrokSkipWarning
  );
  return response.data;
}

export async function exportApplicantProfileToPdf(id: number) {
  const response = await axios.get(
    `${BASE_URL}/api/applicant-profiles/${id}/export-pdf`,
    {
      responseType: 'blob',
      ...ngrokSkipWarning
    }
  );
  return response.data;
}
