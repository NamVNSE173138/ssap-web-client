import axios from "axios";
import getEndpoint from "../getEndpoint";

export async function LoginUser(credentials: any) {
  const response = await axios.post(`${getEndpoint()}/api/Authentication/Login`, credentials);
  return response.data;
}

export async function GoogleAuth() {
  const response = await axios.get(`${getEndpoint()}/api/Authentication/auth-google`);
  return response.data;
}

export async function RegisterUser(credentials: any) {
  const response = await axios.post(`${getEndpoint()}/api/Authentication/Register`, credentials);
  return response.data;
}
