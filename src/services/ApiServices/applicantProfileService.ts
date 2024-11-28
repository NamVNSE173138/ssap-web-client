import axios from "axios";
import { BASE_URL } from "@/constants/api";
const ngrokSkipWarning = { headers: { "bypass-tunnel-reminder": "true" } };

export async function getAllApplicantProfiles() {
  const response = await axios.get(
    `${BASE_URL}/api/applicants`,
    ngrokSkipWarning,
  );
  return response.data;
}

export async function getApplicantProfileById(id: number) {
  const response = await axios.get(
    `${BASE_URL}/api/applicants/${id}`,
    ngrokSkipWarning,
  );
  return response.data;
}

export async function getApplicantProfileDetails(id: number) {
  const response = await axios.get(
    `${BASE_URL}/api/applicants/${id}/profile`,
    ngrokSkipWarning,
  );
  return response.data;
}

export async function updateApplicantProfileDetails(
  id: number,
  profileData: any,
) {
  const response = await axios.put(
    `${BASE_URL}/api/applicants/${id}/profile`,
    profileData,
    ngrokSkipWarning,
  );

  console.log(response.data);

  return response.data;
}

export async function getAllApplicantProfilesByApplicant(id: number) {
  const response = await axios.get(
    `${BASE_URL}/api/applicants/${id}`,
    ngrokSkipWarning,
  );
  return response.data;
}

export async function addApplicantProfile(profileData: any) {
  const response = await axios.post(
    `${BASE_URL}/api/applicants`,
    profileData,
    ngrokSkipWarning,
  );
  return response.data;
}

export async function updateApplicantProfile(id: number, profileData: any) {
  const response = await axios.put(
    `${BASE_URL}/api/applicants/${id}`,
    profileData,
    ngrokSkipWarning,
  );
  return response.data;
}

export async function deleteApplicantProfile(id: number) {
  const response = await axios.delete(
    `${BASE_URL}/api/applicants/${id}`,
    ngrokSkipWarning,
  );
  return response.data;
}

export async function exportApplicantProfileToPdf(id: number) {
  const response = await axios.get(
    `${BASE_URL}/api/applicants/${id}/profile/pdf`,
    {
      responseType: "blob",
      ...ngrokSkipWarning,
    },
  );
  return response.data;
}

export async function updateApplicantSkills(
  applicantId: number,
  skillData: any[],
) {
  const response = await axios.put(
    `${BASE_URL}/api/applicants/${applicantId}/skills`,
    skillData,
    ngrokSkipWarning,
  );
  return response.data;
}

export async function deleteApplicantSkill(
  applicantId: number,
  skillId: number,
) {
  const response = await axios.delete(
    `${BASE_URL}/api/applicants/${applicantId}/skills/${skillId}`,
    ngrokSkipWarning,
  );
  return response.data;
}
