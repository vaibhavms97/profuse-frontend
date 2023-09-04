import {
  addProductUrl,
  blockUserUrl,
  deleteProductUrl,
  deleteUserUrl,
  depositFundUrl,
  editProductUrl,
  getAdminEarningsUrl,
  getProductsUrl,
  getUsersUrl,
  investAmountUrl,
  withdrawFundUrl,
} from "../constants/apiUrls/admin";
import { commonXHRInstance } from "./networkServices";

export const getProductsRequest = async (pageNo) =>
  commonXHRInstance.get(getProductsUrl() + `?page=${pageNo}`);

export const addProductRequest = async (data) =>
  commonXHRInstance.post(addProductUrl(), data);

export const deleteProductRequest = async (id) =>
  commonXHRInstance.delete(deleteProductUrl() + `?_id=${id}`);

export const editProductRequest = async (data) =>
  commonXHRInstance.patch(editProductUrl(), data);

export const getUsersRequest = async (pageNo) =>
  commonXHRInstance.get(getUsersUrl() + `?page=${pageNo}`);

export const blockUserRequest = async (data) =>
  commonXHRInstance.patch(blockUserUrl(), data);

export const deleteUserRequest = async (data) =>
  commonXHRInstance.delete(deleteUserUrl(), data);

export const investAmountRequest = async (data) =>
  commonXHRInstance.post(investAmountUrl(), data);

export const depositFundRequest = async (data) =>
  commonXHRInstance.post(depositFundUrl(), data);

export const withdrawFundRequest = async (data) =>
  commonXHRInstance.post(withdrawFundUrl(), data);

export const getAdminEarningsRequest = async (pageNo) =>
  commonXHRInstance.get(getAdminEarningsUrl() + `?page=${pageNo}`);
