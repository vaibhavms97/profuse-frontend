import { useState } from "react";
import Profile from "../userDashboard/Profile";
import ManageUsers from "./ManageUsers";
import Products from "./Products";
import SidePanel from "./sidePanel/SidePanel";

export default function AdminDashboard() {
  const [selectedTab, setSelectedTab] = useState("products");

  return(
    <div>
      <SidePanel selectedTab={selectedTab} setSelectedTab={setSelectedTab} />
      {selectedTab === "products" && <Products/> }
      {selectedTab === "manageUsers" && <ManageUsers/> }
      {selectedTab === "profile" && <Profile/> }
    </div>
  )
}