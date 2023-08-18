import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import AdminSignUp from "../pages/auth/AdminSignUp";
import Login from "../pages/auth/Login";
import SignUp from "../pages/auth/SignUp";
import AdminDashboard from "../pages/dashboard/adminDashboard";
import UserDashboard from "../pages/dashboard/userDashboard";
import PrivateRoutesCollection from "./PrivateRouteCollection";

export default function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />}/>
        <Route path="/signUp" element={<SignUp />}/>
        <Route path="/admin/signUp" element={<AdminSignUp />}/>
        <Route path="/" element={<Navigate to="/login" />} />
        <Route element={<PrivateRoutesCollection />}>
          <Route path="/userDashboard" element={<UserDashboard />}/>
          <Route path="/adminDashboard" element={<AdminDashboard />}/>
        </Route>
      </Routes>
    </BrowserRouter>
  )
}