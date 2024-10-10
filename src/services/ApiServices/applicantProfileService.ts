import axios from "axios";
import getEndpoint from "../getEndpoint";

const ngrokSkipWarning = { headers: { "bypass-tunnel-reminder": "true" } };

// Fetch all applicant profiles
export async function getAllApplicantProfiles() {
  const response = await axios.get(
    `${getEndpoint()}/api/applicant-profiles`,
    ngrokSkipWarning
  );
  return response.data;
}

// Fetch an applicant profile by ID
export async function getApplicantProfileById(id: number) {
  const response = await axios.get(
    `${getEndpoint()}/api/applicant-profiles/${id}`,
    ngrokSkipWarning
  );
  return response.data;
}

// Add a new applicant profile
export async function addApplicantProfile(profileData: any) {
  const response = await axios.post(
    `${getEndpoint()}/api/applicant-profiles/Add`,
    profileData,
    ngrokSkipWarning
  );
  return response.data;
}

// Update an existing applicant profile
export async function updateApplicantProfile(profileData: any) {
  const response = await axios.put(
    `${getEndpoint()}/api/applicant-profiles`,
    profileData,
    ngrokSkipWarning
  );
  return response.data;
}

// Delete an applicant profile by ID
export async function deleteApplicantProfile(id: number) {
  const response = await axios.delete(
    `${getEndpoint()}/api/applicant-profiles/${id}`,
    ngrokSkipWarning
  );
  return response.data;
}
