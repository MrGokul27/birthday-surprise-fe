import { Tabs, Tab, Box, Button, Typography } from "@mui/material";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import AdminPanel from "./AdminPanel";
import BirthdayPanel from "./BirthdayPanel";
import LogoutIcon from "@mui/icons-material/Logout";

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
    <Box display="flex" height="100vh">
      {/* LEFT SIDE PANEL */}
      <Box
        width={240}
        minWidth={240}
        maxWidth={240}
        bgcolor="#262d34"
        color={"#9097a7"}
        p={2}
        display="flex"
        flexDirection="column"
      >
        <Typography variant="h6" mb={2}>
          Dashboard
        </Typography>

        <Tabs
          orientation="vertical"
          value={tab}
          onChange={(_, v) => setTab(v)}
          sx={{
            flexGrow: 1,
            "& .MuiTab-root": {
              alignItems: "flex-start",
              textAlign: "left",
            },
          }}
        >
          {role === "admin" && <Tab label="Admin Panel" />}
          <Tab label="Birthday Details" />
        </Tabs>

        <Button
          variant="contained"
          color="error"
          startIcon={<LogoutIcon />}
          onClick={handleLogout}
          sx={{ mt: 2 }}
        >
          Logout
        </Button>
      </Box>

      {/* RIGHT SIDE CONTENT */}
      <Box flexGrow={1} bgcolor={"#f9f7f7"} p={3}>
        {role === "admin" && tab === 0 && <AdminPanel />}
        {(role !== "admin" ? tab === 0 : tab === 1) && <BirthdayPanel />}
      </Box>
    </Box>
  );
}
