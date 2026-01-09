import { Box, Typography } from "@mui/material";
import axios from "axios";
import { useEffect, useState } from "react";

export default function AdminPanel() {
  const [count, setCount] = useState(0);
  const token = localStorage.getItem("token");

  useEffect(() => {
    axios
      .get("http://localhost:5000/api/users/count", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => setCount(res.data.count));
  }, []);

  return (
    <Box>
      <Typography variant="h6" mb={2}>
        Total Users: {count}
      </Typography>
    </Box>
  );
}
