import axios from "axios";
import getEndpoint from "../getEndpoint";

export async function LoginUser(credentials: any) {
  const response = await axios.post(`${getEndpoint()}/api/Authentication/Login`, credentials);
  return response.data;
}

export async function RegisterUser(credentials: any) {
  const response = await axios.post(`${getEndpoint()}/api/Authentication/Register`, credentials);
  return response.data;
}

export async function RegisterFunder(credentials: any) {
  const response = await axios.post(`${getEndpoint()}/api/Authentication/Register-funder`, credentials);
  return response.data;
}

export async function RegisterProvider(credentials: any) {
  const response = await axios.post(`${getEndpoint()}/api/Authentication/Register-provider`, credentials);
  return response.data;
}

export async function ChangedPassword(credentials: any) {
  const response = await axios.post(`${getEndpoint()}/api/Authentication/ChangePassword`, credentials);
  return response.data;
}

export async function ForgotPassword(credentials: any) {
  const response = await axios.post(`${getEndpoint()}/api/Authentication/ForgotPassword`, credentials);
  return response.data;
}

export async function VerifyOtp(credentials: any) {
  const response = await axios.post(`${getEndpoint()}/api/Authentication/VerifyOtp`, credentials);
  return response.data;
}

export async function ResetPassword(credentials: any) {
  const response = await axios.post(`${getEndpoint()}/api/Authentication/ResetPassword`, credentials);
  return response.data;
}
