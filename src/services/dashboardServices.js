import { getDashboardUrl, getProductsList, getTransactions } from "../constants/apiUrls/dashboard";
import { commonXHRInstance } from "./networkServices";


export const getDashboardRequest = async () =>
  commonXHRInstance.get(getDashboardUrl());

export const getProductsListRequest = async (pageNo) =>
  commonXHRInstance.get(getProductsList()+`?page=${pageNo}`);

export const getTransactionsRequest = async (pageNo) =>
  commonXHRInstance.get(getTransactions()+`?page=${pageNo}`);