import Box from "@mui/material/Box";
import Drawer from "@mui/material/Drawer";
import CssBaseline from "@mui/material/CssBaseline";
import Toolbar from "@mui/material/Toolbar";
import Divider from "@mui/material/Divider";
import { Squares2X2Icon, UserCircleIcon, ArrowRightOnRectangleIcon, ArrowsRightLeftIcon, CurrencyDollarIcon } from "@heroicons/react/24/outline";
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
            onClick={() => setSelectedTab("dashboard")}
            sx={{
              cursor: "pointer",
              borderRadius: "8px",
              background: selectedTab === "dashboard" ? "#4848e9" : "",
              color: selectedTab === "dashboard" ? "#fff" : "",
            }}
          >
            <Squares2X2Icon style={{ width: "30px", height: "30px" }} />
            <Typography ml={1}>Dashboard</Typography>
          </Box>
          <Box
            display="flex"
            alignItems="center"
            width="86%"
            p={1.5}
            mx={2}
            my={0.5}
            onClick={() => setSelectedTab("transactions")}
            sx={{
              cursor: "pointer",
              borderRadius: "8px",
              background: selectedTab === "transactions" ? "#4848e9" : "",
              color: selectedTab === "transactions" ? "#fff" : "",
            }}
          >
            <ArrowsRightLeftIcon style={{ width: "30px", height: "30px" }} />
            <Typography ml={1}>Your Transactions</Typography>
          </Box>
          <Box
            display="flex"
            alignItems="center"
            width="86%"
            p={1.5}
            mx={2}
            my={0.5}
            onClick={() => setSelectedTab("earnings")}
            sx={{
              cursor: "pointer",
              borderRadius: "8px",
              background: selectedTab === "earnings" ? "#4848e9" : "",
              color: selectedTab === "earnings" ? "#fff" : "",
            }}
          >
            <CurrencyDollarIcon style={{ width: "30px", height: "30px" }} />
            <Typography ml={1}>Your Earnings</Typography>
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
            <Typography ml={1}>Manage Account</Typography>
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
