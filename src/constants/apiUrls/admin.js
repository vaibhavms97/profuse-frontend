const getProductsUrl = () => "/api/v1/admin/product/get-products-list";
const addProductUrl = () => "/api/v1/admin/product/create-product";
const deleteProductUrl = () => "/api/v1/admin/product/delete-product";
const editProductUrl = () => "/api/v1/admin/product/edit-product";
const getUsersUrl = () => "/api/v1/admin/user/get-users-list";
const blockUserUrl = () => "/api/v1/admin/user/change-user-status";
const deleteUserUrl = () => "/api/v1/admin/user/delete-user";
const investAmountUrl = () => "/api/v1/web/account/invest-amount";
const depositFundUrl = () => "/api/v1/web/account/deposit-fund";
const withdrawFundUrl = () => "/api/v1/web/account/withdraw-fund";
const getAdminEarningsUrl = () => "api/v1/admin/earnings/get-admin-earnings";


export {
  getProductsUrl,
  addProductUrl,
  deleteProductUrl,
  editProductUrl,
  getUsersUrl,
  blockUserUrl,
  deleteUserUrl,
  investAmountUrl,
  depositFundUrl,
  withdrawFundUrl,
  getAdminEarningsUrl,
}