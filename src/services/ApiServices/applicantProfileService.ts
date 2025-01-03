import axios from "axios";
import { BASE_URL } from "@/constants/api";
import { notification } from "antd";
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

export async function getApplicationsByApplicant(id: number) {
  try {
    const response = await axios.get(
      `${BASE_URL}/api/applicants/${id}/applications`,
      ngrokSkipWarning,
    );
    return response.data;
  } catch (error) {
    throw error;
  }
}

export async function addApplicantProfile(id: number, profileData: any) {
  const response = await axios.post(
    `${BASE_URL}/api/applicants/${id}`,
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

export async function updateApplicantGeneralInformation(
  applicantId: number,
  payload: any,
) {
  const response = await axios.put(
    `${BASE_URL}/api/applicants/${applicantId}/general-info`,
    payload,
    ngrokSkipWarning,
  );
  return response.data;
}

export async function addApplicantSkill(applicantId: number, payload: any) {
  const response = await axios.post(
    `${BASE_URL}/api/applicants/${applicantId}/profile-skill`,
    payload,
    ngrokSkipWarning,
  );
  return response.data;
}

export async function updateApplicantSkill(
  applicantId: number,
  skillId: number,
  payload: any,
) {
  const response = await axios.put(
    `${BASE_URL}/api/applicants/${applicantId}/profile-skill/${skillId}`,
    payload,
    ngrokSkipWarning,
  );
  return response.data;
}

export async function deleteApplicantSkill(skillId: number) {
  try {
    const response = await axios.delete(
      `${BASE_URL}/api/applicants/profile-skill/${skillId}`,
      ngrokSkipWarning,
    );
    return response.data;
  } catch (error) {
    throw error;
  }
}

export async function addApplicantCertificate(
  applicantId: number,
  payload: any,
) {
  const response = await axios.post(
    `${BASE_URL}/api/applicants/${applicantId}/profile-certificate`,
    payload,
    ngrokSkipWarning,
  );
  return response.data;
}

export async function updateApplicantCertificate(
  applicantId: number,
  certificateId: number,
  payload: any,
) {
  const response = await axios.put(
    `${BASE_URL}/api/applicants/${applicantId}/profile-certificate/${certificateId}`,
    payload,
    ngrokSkipWarning,
  );
  return response.data;
}

export async function deleteApplicantCertificate(certificateId: number) {
  try {
    const response = await axios.delete(
      `${BASE_URL}/api/applicants/profile-certificate/${certificateId}`,
      ngrokSkipWarning,
    );
    return response.data;
  } catch (error) {
    throw error;
  }
}

export async function addApplicantEducation(applicantId: number, payload: any) {
  const response = await axios.post(
    `${BASE_URL}/api/applicants/${applicantId}/profile-education`,
    payload,
    ngrokSkipWarning,
  );
  return response.data;
}

export async function updateApplicantEducation(
  applicantId: number,
  educationId: number,
  payload: any,
) {
  const response = await axios.put(
    `${BASE_URL}/api/applicants/${applicantId}/profile-education/${educationId}`,
    payload,
    ngrokSkipWarning,
  );
  return response.data;
}

export async function deleteApplicantEducation(educationId: number) {
  try {
    const response = await axios.delete(
      `${BASE_URL}/api/applicants/profile-education/${educationId}`,
      ngrokSkipWarning,
    );
    return response.data;
  } catch (error) {
    throw error;
  }
}

export async function addApplicantExperience(
  applicantId: number,
  payload: any,
) {
  const response = await axios.post(
    `${BASE_URL}/api/applicants/${applicantId}/profile-experience`,
    payload,
    ngrokSkipWarning,
  );
  return response.data;
}

export async function updateApplicantExperience(
  applicantId: number,
  experienceId: number,
  payload: any,
) {
  const response = await axios.put(
    `${BASE_URL}/api/applicants/${applicantId}/profile-experience/${experienceId}`,
    payload,
    ngrokSkipWarning,
  );
  return response.data;
}

export async function deleteApplicantExperience(experienceId: number) {
  try {
    const response = await axios.delete(
      `${BASE_URL}/api/applicants/profile-experience/${experienceId}`,
      ngrokSkipWarning,
    );
    return response.data;
  } catch (error) {
    throw error;
  }
}
