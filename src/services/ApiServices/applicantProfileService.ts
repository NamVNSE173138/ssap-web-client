import axios from "axios";
import getEndpoint from "../getEndpoint";

const ngrokSkipWarning = { headers: { "bypass-tunnel-reminder": "true" } };

export async function getAllApplicantProfiles() {
  const response = await axios.get(
    `${getEndpoint()}/api/applicant-profiles`,
    ngrokSkipWarning
  );
  return response.data;
}

export async function getApplicantProfileById(id: number) {

  const response = await axios.get(
    `${getEndpoint()}/api/applicant-profiles/${id}`,
    ngrokSkipWarning
  );
  return response.data;
}

export async function getAllApplicantProfilesByApplicant(id: number) {

  const response = await axios.get(
    `${getEndpoint()}/api/applicant-profiles/byapplicant/${id}`,
    ngrokSkipWarning
  );
  return response.data;
}

export async function addApplicantProfile(profileData: any) {

  const response = await axios.post(
    `${getEndpoint()}/api/applicant-profiles/Add`,
    profileData,
    ngrokSkipWarning
  );
  return response.data;
}

export async function updateApplicantProfile(profileData: any) {

  const response = await axios.put(
    `${getEndpoint()}/api/applicant-profiles`,
    profileData,
    ngrokSkipWarning
  );
  return response.data;
}

export async function addOrUpdateApplicantProfile(profileData: any) {

  const response = await axios.post(
    `${getEndpoint()}/api/applicant-profiles/addorupdateprofile`,
    profileData,
    ngrokSkipWarning
  );
  return response.data;
}

export async function deleteApplicantProfile(id: number) {

  const response = await axios.delete(
    `${getEndpoint()}/api/applicant-profiles/${id}`,
    ngrokSkipWarning
  );
  return response.data;
}

export async function exportApplicantProfileToPdf(id: number) {
  const response = await axios.get(
    `${getEndpoint()}/api/applicant-profiles/${id}/export-pdf`,
    {
      responseType: 'blob',
      ...ngrokSkipWarning
    }
  );
  return response.data;
}
