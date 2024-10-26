import axios from "axios";
import { BASE_URL } from "@/constants/api";

export async function LoginUser(credentials: any) {
  const response = await axios.post(`${BASE_URL}/api/Authentication/Login`, credentials);
  return response.data;
}

export async function GoogleAuth() {
  const response = await axios.get(`${BASE_URL}/api/Authentication/auth-google`);
  return response.data;
}

export async function RegisterUser(credentials: any) {
  const response = await axios.post(`${BASE_URL}/api/Authentication/Register`, credentials);
  return response.data;
}

export async function RegisterFunder(credentials: any) {
  const response = await axios.post(`${BASE_URL}/api/Authentication/Register-funder`, credentials);
  return response.data;
}

export async function RegisterProvider(credentials: any) {
  const response = await axios.post(`${BASE_URL}/api/Authentication/Register-provider`, credentials);
  return response.data;
}

export async function ChangedPassword(credentials: any) {
  const response = await axios.post(`${BASE_URL}/api/Authentication/ChangePassword`, credentials);
  return response.data;
}

export async function ForgotPassword(credentials: any) {
  const response = await axios.post(`${BASE_URL}/api/Authentication/ForgotPassword`, credentials);
  return response.data;
}

export async function VerifyOtp(credentials: any) {
  const response = await axios.post(`${BASE_URL}/api/Authentication/VerifyOtp`, credentials);
  return response.data;
}

export async function ResetPassword(credentials: any) {
  const response = await axios.post(`${BASE_URL}/api/Authentication/ResetPassword`, credentials);
  return response.data;
}
