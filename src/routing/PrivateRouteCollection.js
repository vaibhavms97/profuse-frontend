import { Navigate, Outlet } from "react-router-dom";

const PrivateRoutesCollection = () => {
  const userId = localStorage.getItem("uid")
  return userId ? <Outlet /> : <Navigate to="/login" />;
};

export default PrivateRoutesCollection;
