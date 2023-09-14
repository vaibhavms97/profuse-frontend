import { useEffect, useState } from "react";
import Box from "@mui/material/Box";
import Drawer from "@mui/material/Drawer";
import CssBaseline from "@mui/material/CssBaseline";
import Toolbar from "@mui/material/Toolbar";
import Divider from "@mui/material/Divider";
import {
  Squares2X2Icon,
  UserCircleIcon,
  ArrowRightOnRectangleIcon,
  ArrowsRightLeftIcon,
  CurrencyDollarIcon,
} from "@heroicons/react/24/outline";
import BoltIcon from "@mui/icons-material/Bolt";
import { Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";
import useWindowResizeHandler from "../../../../hooks/useWindowResizeHandler";
import { BurgerBoughie } from "../../../../hooks/burgerBougie/BurgerBougie";

export default function SidePanel({ selectedTab, setSelectedTab }) {
  const isValidScreenSize = useWindowResizeHandler();

  const [isMenuBarExpanded, setIsMenuBarExpanded] = useState(false);
  const [drawerWidth, setDrawerWidth] = useState(isValidScreenSize ? 90 : 240);

  const navigate = useNavigate();
  
  useEffect(() => {
    setDrawerWidth(prev => (prev === 90 ? 240 : 90))
  },[isMenuBarExpanded])
  
  useEffect(() => {
    setIsMenuBarExpanded(isValidScreenSize ? true : false)
  }, [isValidScreenSize])
  
  function handleLogout() {
    setSelectedTab("logout");
    localStorage.clear();
    navigate("/login");
  }

  function handleMenuBar() {
    setIsMenuBarExpanded(prev => !prev)
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
            overflowX: "hidden",
            transition: "0.5s ease-in-out"
          },
        }}
        variant="permanent"
        anchor="left"
      >
        {!isValidScreenSize && <Toolbar 
          onClick={handleMenuBar}
          sx={{cursor: "pointer"}}
        >
          <Box
            display="flex"
            alignItems="center"
            justifyContent={isMenuBarExpanded ? "end" : "center"}
            width="100%"
          >
            <BurgerBoughie isClosed={isMenuBarExpanded} />
          </Box>
        </Toolbar>}
        <Toolbar>
          <Typography
            color="#4848e9"
            fontFamily="Recoleta-bold"
            sx={{ display: "flex", alignItems: "center" }}
          >
            <BoltIcon sx={{ fontSize: "30px" }} />
            {isMenuBarExpanded && (
              <Typography
                color="#4848e9"
                variant="h5"
                fontFamily="Recoleta-bold"
              >
                Profuse
              </Typography>
            )}
          </Typography>
        </Toolbar>
        <Divider />
        <Box
          display="flex"
          alignItems="flex-start"
          mt={1}
          flexDirection="column"
        >
          <Box
            display="flex"
            alignItems="center"
            minWidth={isMenuBarExpanded ? "200px" : "50px"}
            p={1.5}
            mx={2}
            my={0.5}
            onClick={() => {
              setSelectedTab("dashboard")
              setIsMenuBarExpanded(false)
            }}
            sx={{
              cursor: "pointer",
              borderRadius: "8px",
              background: selectedTab === "dashboard" ? "#4848e9" : "",
              color: selectedTab === "dashboard" ? "#fff" : "",
            }}
          >
            <Squares2X2Icon style={{ width: "30px", height: "30px" }} />
            {isMenuBarExpanded && <Typography ml={1}>Dashboard</Typography>}
          </Box>
          <Box
            display="flex"
            alignItems="center"
            minWidth={isMenuBarExpanded ? "200px" : "50px"}
            p={1.5}
            mx={2}
            my={0.5}
            onClick={() => {
              setSelectedTab("transactions")
              setIsMenuBarExpanded(false)
            }}
            sx={{
              cursor: "pointer",
              borderRadius: "8px",
              background: selectedTab === "transactions" ? "#4848e9" : "",
              color: selectedTab === "transactions" ? "#fff" : "",
            }}
          >
            <ArrowsRightLeftIcon style={{ width: "30px", height: "30px" }} />
            {isMenuBarExpanded && (
              <Typography ml={1}>Your Transactions</Typography>
            )}
          </Box>
          <Box
            display="flex"
            alignItems="center"
            minWidth={isMenuBarExpanded ? "200px" : "50px"}
            p={1.5}
            mx={2}
            my={0.5}
            onClick={() => {
              setSelectedTab("earnings")
              setIsMenuBarExpanded(false)
            }}
            sx={{
              cursor: "pointer",
              borderRadius: "8px",
              background: selectedTab === "earnings" ? "#4848e9" : "",
              color: selectedTab === "earnings" ? "#fff" : "",
            }}
          >
            <CurrencyDollarIcon style={{ width: "30px", height: "30px" }} />
            {isMenuBarExpanded && <Typography ml={1}>Your Earnings</Typography>}
          </Box>
          <Box
            display="flex"
            alignItems="center"
            minWidth={isMenuBarExpanded ? "200px" : "50px"}
            p={1.5}
            mx={2}
            my={0.5}
            onClick={() => {
              setSelectedTab("profile")
              setIsMenuBarExpanded(false)
            }}
            sx={{
              cursor: "pointer",
              borderRadius: "8px",
              background: selectedTab === "profile" ? "#4848e9" : "",
              color: selectedTab === "profile" ? "#fff" : "",
            }}
          >
            <UserCircleIcon style={{ width: "30px", height: "30px" }} />
            {isMenuBarExpanded && (
              <Typography ml={1}>Manage Account</Typography>
            )}
          </Box>
          <Box
            display="flex"
            alignItems="center"
            minWidth={isMenuBarExpanded ? "200px" : "50px"}
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
            <ArrowRightOnRectangleIcon
              style={{ width: "30px", height: "30px" }}
            />
            {isMenuBarExpanded && <Typography ml={1}>Logout</Typography>}
          </Box>
        </Box>
      </Drawer>
    </Box>
  );
}
