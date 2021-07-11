import http from "./httpService";
import { apiUrl } from "../config.json";

const apiEndpoint = apiUrl + "/users";

export const register = (user) => {
  const userName = user.first_name.trim() + " " + user.last_name.trim();
  return http.post(apiEndpoint, {
    name: userName,
    email: user.email.trim(),
    password: user.password,
  });
};

export const registerWithGoogle = (user) => {
  return http.post(apiEndpoint + "/google", {
    name: user.name.trim(),
    email: user.email.trim(),
    googleId: user.googleId,
  });
};

export const registerWithFacebook = (user) => {
  return http.post(apiEndpoint + "/facebook", {
    name: user.name.trim(),
    email: user.email.trim(),
    id: user.id,
  });
};
