import React, { useState } from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
  IconButton,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  useMediaQuery,
  useTheme,
  Tooltip,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import LogoutIcon from "@mui/icons-material/Logout";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../store/authSlice";

const Header = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { token, role } = useSelector((state) => state.auth);
  const [drawerOpen, setDrawerOpen] = useState(false);

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const handleLogout = () => {
    dispatch(logout());
    navigate("/login");
  };

  const navItems = [];

  if (token) {
    if (role === "RECRUITER") {
      navItems.push({ label: "Dashboard", path: "/recruiter/dashboard" });
    }

    if (role === "USER") {
      navItems.push({ label: "Dashboard", path: "/dashboard" });
      navItems.push({ label: "Jobs", path: "/jobs" });
    }

    navItems.push({ label: "Logout", action: handleLogout });
  } else {
    navItems.push({ label: "Login", path: "/login" });
    navItems.push({ label: "Register", path: "/register" });
  }

  const renderDrawer = (
    <Drawer anchor="right" open={drawerOpen} onClose={() => setDrawerOpen(false)}>
      <Box sx={{ width: 250 }} role="presentation">
        <List>
          {navItems.map((item, index) => (
            <ListItem key={index} disablePadding>
              <ListItemButton
                onClick={() => {
                  setDrawerOpen(false);
                  item.action ? item.action() : navigate(item.path);
                }}
              >
                <ListItemText primary={item.label} />
              </ListItemButton>
            </ListItem>
          ))}
        </List>
      </Box>
    </Drawer>
  );

  return (
    <>
      <AppBar position="static" sx={{ background: "#1976d2" }}>
        <Toolbar sx={{ display: "flex", justifyContent: "space-between" }}>
          <Typography
            variant="h6"
            onClick={() => navigate("/")}
            sx={{ cursor: "pointer", fontWeight: "bold" }}
          >
            Job Tracker
          </Typography>

          {isMobile ? (
            <>
              <IconButton color="inherit" onClick={() => setDrawerOpen(true)}>
                <MenuIcon />
              </IconButton>
              {renderDrawer}
            </>
          ) : (
            <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
              {navItems.map((item, index) =>
                item.label === "Logout" ? (
                  <Tooltip title="Logout" key={index}>
                    <IconButton color="inherit" onClick={item.action}>
                      <LogoutIcon />
                    </IconButton>
                  </Tooltip>
                ) : (
                  <Button
                    key={index}
                    color="inherit"
                    onClick={() => navigate(item.path)}
                  >
                    {item.label}
                  </Button>
                )
              )}
            </Box>
          )}
        </Toolbar>
      </AppBar>
    </>
  );
};

export default Header;
