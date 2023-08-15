import { adminSignUpUrl, userLoginUrl, userSignUpUrl } from "../constants/apiUrls";
import { commonXHRInstance } from "./networkServices";

export const userAuthLoginRequest = async (data) =>
  commonXHRInstance.post(userLoginUrl(), data);

export const userAuthSignUpRequest = async (data) =>
  commonXHRInstance.post(userSignUpUrl(), data);

export const adminAuthSignUpRequest = async (data) =>
  commonXHRInstance.post(adminSignUpUrl(), data);