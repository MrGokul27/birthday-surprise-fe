import { Tabs, Tab, Box, Button, Typography } from "@mui/material";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import AdminPanel from "./AdminPanel";
import BirthdayPanel from "./birthday/BirthdayPanel";
import UserDetails from "./UserDetails";
import LogoutIcon from "@mui/icons-material/Logout";
import AdminPanelSettingsIcon from "@mui/icons-material/AdminPanelSettings";
import Person from "@mui/icons-material/Person";
import CakeIcon from "@mui/icons-material/Cake";
import SettingsIcon from "@mui/icons-material/Settings";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import type { RootState, AppDispatch } from "../store";
import { fetchUser } from "../store/userSlice";

export default function Dashboard() {
  const role = localStorage.getItem("role");
  const [tab, setTab] = useState(0);
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    navigate("/");
  };

  const dispatch = useDispatch<AppDispatch>();
  const { data: user } = useSelector((state: RootState) => state.user);

  useEffect(() => {
    dispatch(fetchUser());
  }, [dispatch]);

  return (
    <Box
      sx={{
        height: "100vh",
        display: "grid",
        gridTemplateColumns: "270px 1fr",
        overflow: "hidden",
      }}
    >
      <Box
        sx={{
          bgcolor: "#262d34",
          color: "#fff",
          p: 2,
          display: "flex",
          flexDirection: "column",
        }}
      >
        <Typography variant="h6" mb={2}>
          Welcome, <br></br>
          {user?.name} 👋
        </Typography>

        <Tabs
          orientation="vertical"
          value={tab}
          onChange={(_, v) => setTab(v)}
          sx={{
            flexGrow: 1,
            "& .MuiTab-root": {
              color: "#9097a7",
              justifyContent: "flex-start",
              borderRadius: 1,
              gap: 1.5,
              minHeight: 48,
              px: 2,
              "&:hover": {
                color: "#fff",
                backgroundColor: "rgba(255,255,255,0.08)",
              },
            },
            "& .MuiTab-root.Mui-selected": {
              color: "#fff",
              backgroundColor: "#ff6c2f",
            },
            "& .MuiTabs-indicator": {
              display: "none",
            },
          }}
        >
          {role === "admin" && (
            <Tab
              icon={<AdminPanelSettingsIcon />}
              iconPosition="start"
              label="Admin Panel"
            />
          )}
          <Tab
            icon={<CakeIcon />}
            iconPosition="start"
            label="Birthday Details"
          />
          {role === "admin" && (
            <Tab icon={<Person />} iconPosition="start" label="User Details" />
          )}
          <Tab icon={<SettingsIcon />} iconPosition="start" label="Settings" />
        </Tabs>

        <Button
          variant="contained"
          color="error"
          startIcon={<LogoutIcon />}
          onClick={handleLogout}
          sx={{ mt: 2, py: 1.5 }}
        >
          Logout
        </Button>
      </Box>

      {/* RIGHT CONTENT */}
      <Box
        sx={{
          bgcolor: "#f9f7f7",
          p: 3,
          overflowY: "auto",
        }}
      >
        <Box minHeight="auto">
          {role === "admin" && tab === 0 && <AdminPanel />}
          {(role !== "admin" ? tab === 0 : tab === 1) && <BirthdayPanel />}
          {role === "admin" && tab === 2 && <UserDetails />}
        </Box>
      </Box>
    </Box>
  );
}
