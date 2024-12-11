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

export async function getPaginatedServices(
  pageIndex: number = 1,
  pageSize: number = 10,
  sortBy: string = "name",
  sortOrder: string = "asc"
) {
  try {
    const response = await axios.get(
      `${BASE_URL}/api/services/paginated`,
      {
        params: {
          pageIndex,
          pageSize,
          sortBy,
          sortOrder
        }
      }
    );
    return response;
  } catch (error) {
    console.error("Error fetching paginated services:", error);
    throw error;
  }
}

export async function getServicesByProviderId(providerId: number) {
  try {
    const response = await axios.get(
      `${BASE_URL}/api/services/by-provider-id/${providerId}`,
      ngrokSkipWarning
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching services by provider ID:", error);
    throw error;
  }
}

export async function getServicesByProviderPaginated(
  providerId: number,
  pageIndex: number = 1,
  pageSize: number = 10,
  sortBy: string = "name",
  sortOrder: string = "asc"
) {
  try {
    const response = await axios.get(
      `${BASE_URL}/api/services/by-provider-paginated/${providerId}`,
      {
        params: {
          pageIndex,
          pageSize,
          sortBy,
          sortOrder
        }
      }
    );
    return response;
  } catch (error) {
    console.error("Error fetching paginated services by provider ID:", error);
    throw error;
  }
}