const userLoginUrl = () => "/api/v1/web/auth/login";
const userSignUpUrl = () => "/api/v1/web/auth/register";
const adminSignUpUrl = () => "/api/v1/admin/auth/register";
const getUserProfileUrl = () => "/api/v1/web/auth/get-user-profile";
const updateUserProfileUrl = () => "api/v1/web/auth/update-user-profile";

export {
  userLoginUrl,
  userSignUpUrl,
  adminSignUpUrl,
  getUserProfileUrl,
  updateUserProfileUrl
}
