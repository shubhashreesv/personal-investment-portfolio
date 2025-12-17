import axios from "axios";

const API = "http://localhost:8000/api/auth";

export const requestOTP = (email) =>
  axios.post(`${API}/request-otp/`, { email });

export const verifyOTP = (email, otp) =>
  axios.post(`${API}/verify-otp/`, { email, otp });
