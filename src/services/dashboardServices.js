import { getDashboardUrl, getMonthlyEarnings, getProductsList, getTransactions, getUserEarnings, withdrawTransaction } from "../constants/apiUrls/dashboard";
import { commonXHRInstance } from "./networkServices";


export const getDashboardRequest = async () =>
  commonXHRInstance.get(getDashboardUrl());

export const getProductsListRequest = async (pageNo) =>
  commonXHRInstance.get(getProductsList()+`?page=${pageNo}`);

export const getTransactionsRequest = async (pageNo) =>
  commonXHRInstance.get(getTransactions()+`?page=${pageNo}`);

export const withdrawTransactionRequest = async (data) => 
  commonXHRInstance.post(withdrawTransaction(), data)

export const getUserEarningsRequest = async (pageNo) =>
  commonXHRInstance.get(getUserEarnings() + `?page=${pageNo}`);

export const getMonthlyEarningsRequest = async (data) =>
  commonXHRInstance.get(getMonthlyEarnings()+`?from=${data.from}&to=${data.to}`);