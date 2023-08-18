import { adminSignUpUrl, getUserProfileUrl, updateUserProfileUrl, userLoginUrl, userSignUpUrl } from "../constants/apiUrls/auth";
import { commonXHRInstance } from "./networkServices";

export const userAuthLoginRequest = async (data) =>
  commonXHRInstance.post(userLoginUrl(), data);

export const userAuthSignUpRequest = async (data) =>
  commonXHRInstance.post(userSignUpUrl(), data);

export const adminAuthSignUpRequest = async (data) =>
  commonXHRInstance.post(adminSignUpUrl(), data);

export const getUserProfileRequest = async () =>
  commonXHRInstance.get(getUserProfileUrl());

export const updateUserProfileRequest = async (data) =>
  commonXHRInstance.patch(updateUserProfileUrl(), data);