import { addProductUrl, blockUserUrl, deleteProductUrl, deleteUserUrl, editProductUrl, getProductsUrl, getUsersUrl } from "../constants/apiUrls/admin";
import { commonXHRInstance } from "./networkServices";


export const getProductsRequest = async (pageNo) =>
  commonXHRInstance.get(getProductsUrl()+`?page=${pageNo}`);

export const addProductRequest = async (data) =>
  commonXHRInstance.post(addProductUrl(), data);

export const deleteProductRequest = async (id) =>
  commonXHRInstance.delete(deleteProductUrl()+`?_id=${id}`);

export const editProductRequest = async (data) =>
  commonXHRInstance.patch(editProductUrl(), data);

export const getUsersRequest = async (pageNo) =>
  commonXHRInstance.get(getUsersUrl()+`?page=${pageNo}`);

export const blockUserRequest = async (data) =>
  commonXHRInstance.patch(blockUserUrl(), data);

export const deleteUserRequest = async (data) =>
  commonXHRInstance.delete(deleteUserUrl(), data);