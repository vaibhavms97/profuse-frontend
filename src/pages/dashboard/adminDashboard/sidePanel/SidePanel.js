import Box from "@mui/material/Box";
import Drawer from "@mui/material/Drawer";
import CssBaseline from "@mui/material/CssBaseline";
import Toolbar from "@mui/material/Toolbar";
import Divider from "@mui/material/Divider";
import { CubeIcon, UserGroupIcon, ArrowRightOnRectangleIcon, UserCircleIcon } from "@heroicons/react/24/outline";
import BoltIcon from "@mui/icons-material/Bolt";
import { Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";


export default function SidePanel({selectedTab, setSelectedTab}) {
  
  const drawerWidth = 240;
  const navigate = useNavigate();

  function handleLogout() {
    setSelectedTab("logout")
    localStorage.clear();
    navigate("/login")
  }

  return (
    <Box sx={{ display: "flex" }}>
      <CssBaseline />
      <Drawer
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          "& .MuiDrawer-paper": {
            width: drawerWidth,
            boxSizing: "border-box",
          },
        }}
        variant="permanent"
        anchor="left"
      >
        <Toolbar>
          <Typography
            color="#4848e9"
            variant="h5"
            sx={{ display: "flex", alignItems: "center" }}
          >
            <BoltIcon sx={{ fontSize: "30px" }} />
            Profuse
          </Typography>
        </Toolbar>
        <Divider />
        <Box display="flex" alignItems="flex-start" mt={1} flexDirection="column">        
          <Box
            display="flex"
            alignItems="center"
            width="86%"
            p={1.5}
            mx={2}
            my={0.5}
            onClick={() => setSelectedTab("products")}
            sx={{
              cursor: "pointer",
              borderRadius: "8px",
              background: selectedTab === "products" ? "#4848e9" : "",
              color: selectedTab === "products" ? "#fff" : "",
            }}
          >
            <CubeIcon style={{ width: "30px", height: "30px" }} />
            <Typography ml={1}>Products</Typography>
          </Box>
          <Box
            display="flex"
            alignItems="center"
            width="86%"
            p={1.5}
            mx={2}
            my={0.5}
            onClick={() => setSelectedTab("manageUsers")}
            sx={{
              cursor: "pointer",
              borderRadius: "8px",
              background: selectedTab === "manageUsers" ? "#4848e9" : "",
              color: selectedTab === "manageUsers" ? "#fff" : "",
            }}
          >
            <UserGroupIcon style={{ width: "30px", height: "30px" }} />
            <Typography ml={1}>Manage Users</Typography>
          </Box>
          <Box
            display="flex"
            alignItems="center"
            width="86%"
            p={1.5}
            mx={2}
            my={0.5}
            onClick={() => setSelectedTab("profile")}
            sx={{
              cursor: "pointer",
              borderRadius: "8px",
              background: selectedTab === "profile" ? "#4848e9" : "",
              color: selectedTab === "profile" ? "#fff" : "",
            }}
          >
            <UserCircleIcon style={{ width: "30px", height: "30px" }} />
            <Typography ml={1}>Profile</Typography>
          </Box>
          <Box
            display="flex"
            alignItems="center"
            width="86%"
            p={1.5}
            mx={2}
            my={0.5}
            onClick={handleLogout}
            sx={{
              cursor: "pointer",
              borderRadius: "8px",
              background: selectedTab === "logout" ? "#4848e9" : "",
              color: selectedTab === "logout" ? "#fff" : "",
            }}
          >
            <ArrowRightOnRectangleIcon style={{ width: "30px", height: "30px" }} />
            <Typography ml={1}>Logout</Typography>
          </Box>
        </Box>
      </Drawer>
    </Box>
  );
}
