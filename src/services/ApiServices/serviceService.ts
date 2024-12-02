import axios from "axios";
import { BASE_URL } from "@/constants/api";

const ngrokSkipWarning = { headers: { "bypass-tunnel-reminder": "true" } };

export async function getAllServices() {
  const response = await axios.get(
    `${BASE_URL}/api/services`,
    ngrokSkipWarning
  );
  return response.data;
}

export async function countServices() {
    try {
        const response = await axios.get(`${BASE_URL}/api/services/count`);
        return response.data;
    } catch (error: any) {
        console.error('API error:', error?.response?.data || error.message);
        throw error;
    }
}

export async function getServiceById(id: number) {
  const response = await axios.get(
    `${BASE_URL}/api/services/${id}`,
    ngrokSkipWarning
  );
  return response.data;
}

export async function getServicesByProvider(providerId: number) {
  const response = await axios.get(
    `${BASE_URL}/api/services/by-provider-id/${providerId}`,
    ngrokSkipWarning
  );
  return response.data;
}

export async function addService(serviceData: any) {
  const response = await axios.post(
    `${BASE_URL}/api/services`,
    serviceData,
    ngrokSkipWarning
  );
  return response.data;
}

export async function updateService(id: number, serviceData: any) {
  const response = await axios.put(
    `${BASE_URL}/api/services/${id}`,
    serviceData,
    ngrokSkipWarning
  );
  return response.data;
}

export async function deleteService(id: number) {
  const response = await axios.delete(
    `${BASE_URL}/api/services/${id}`,
    ngrokSkipWarning
  );
  return response.data;
}
