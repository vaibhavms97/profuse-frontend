import { getDashboardUrl, getProductsList, getTransactions } from "../constants/apiUrls/dashboard";
import { commonXHRInstance } from "./networkServices";


export const getDashboardRequest = async () =>
  commonXHRInstance.get(getDashboardUrl());

export const getProductsListRequest = async () =>
  commonXHRInstance.get(getProductsList());

export const getTransactionsRequest = async () =>
  commonXHRInstance.get(getTransactions());