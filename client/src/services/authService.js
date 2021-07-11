import http from "./httpService";
import { apiUrl } from "../config.json";
import jwtDecode from "jwt-decode";

const apiEndpoint = apiUrl + "/auth";
const tokenKey = "token";

export const login = async (email, password) => {
  const { data: jwt } = await http.post(apiEndpoint, { email, password });
  loginWithJwt(jwt);
};

export const loginWithGoogle = async (user) => {
  const { data: jwt } = await http.post(apiEndpoint + "/google", user);
  loginWithJwt(jwt);
};

export const loginWithFacebook = async (user) => {
  const { data: jwt } = await http.post(apiEndpoint + "/facebook", user);
  loginWithJwt(jwt);
};

export const loginWithJwt = (jwt) => {
  localStorage.setItem(tokenKey, jwt);
};

export const logout = () => {
  localStorage.remove(tokenKey);
};

export const getCurrentUser = () => {
  try {
    const jwt = localStorage.getItem(tokenKey);
    return jwtDecode(jwt);
  } catch (err) {
    return null;
  }
};

export const getJwt = () => {
  return localStorage.getItem(tokenKey);
};

export default {
  login,
  logout,
  loginWithGoogle,
  loginWithFacebook,
  getCurrentUser,
  loginWithJwt,
  getJwt,
};
