import { Box } from "@mui/material";
import { useState } from "react";
import Dashboard from "./Dashboard";
import Profile from "./Profile";
import SidePanel from "./sidePanel/SidePanel";

export default function UserDashboard() {
  const [selectedTab, setSelectedTab] = useState("dashboard");
  return(
    <Box>
      <SidePanel selectedTab={selectedTab} setSelectedTab={setSelectedTab} />
      {selectedTab === "dashboard" && <Dashboard />}
      {selectedTab === "profile" && <Profile />}
    </Box>
  )
}