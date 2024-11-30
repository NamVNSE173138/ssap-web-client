import axios from "axios";
import { BASE_URL } from "@/constants/api";


export async function getAllMajors() {
  const response = await axios.get(
    `${BASE_URL}/api/majors/paginated?pageIndex=1&pageSize=12`,
  );
  return response.data;
}

export async function getMajors() {
  const response = await axios.get(
    `${BASE_URL}/api/majors`,
  );
  return response.data;
}

export async function addMajor(data: any) {
  const response = await axios.post(
    `${BASE_URL}/api/majors`,
    data
  );
  return response.data;
}

export async function editMajors(id: number, data: any) {
  const response = await axios.put(
    `${BASE_URL}/api/majors/${id}`,
    data
  );
  return response.data;
}


export async function getMajor(id: string) {
  const response = await axios.get(
    `${BASE_URL}/api/majors/${id}`,
  );
  return response.data;
}

