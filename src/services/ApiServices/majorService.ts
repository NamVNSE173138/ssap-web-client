import axios from "axios";
import getEndpoint from "../getEndpoint";

// Fetch all applicant profiles
export async function getAllMajors() {
  const response = await axios.get(
    `${getEndpoint()}/api/majors/paginated?pageIndex=1&pageSize=12`,
  );
  return response.data;
}

export async function getMajor(id: string) {
  const response = await axios.get(
    `${getEndpoint()}/api/majors/${id}`,
  );
  return response.data;
}

