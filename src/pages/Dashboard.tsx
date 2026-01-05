import { Tabs, Tab, Box, Button } from "@mui/material";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import AdminPanel from "./AdminPanel";
import BirthdayPanel from "./BirthdayPanel";

export default function Dashboard() {
  const role = localStorage.getItem("role");
  const [tab, setTab] = useState(0);
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    navigate("/");
  };

  return (
    <Box p={2}>
      {/* HEADER */}
      <Box display="flex" justifyContent="space-between" alignItems="center">
        <h2>Dashboard</h2>
        <Button variant="outlined" color="error" onClick={handleLogout}>
          Logout
        </Button>
      </Box>

      <Tabs value={tab} onChange={(_, v) => setTab(v)} sx={{ mb: 2 }}>
        {role === "admin" && <Tab label="Admin Panel" />}
        <Tab label="Birthday Details" />
      </Tabs>

      {/* TAB CONTENT */}
      {role === "admin" && tab === 0 && <AdminPanel />}
      {(role !== "admin" ? tab === 0 : tab === 1) && <BirthdayPanel />}
    </Box>
  );
}
