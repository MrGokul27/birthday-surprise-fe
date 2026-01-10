import { Box, Grid, GridLegacy, Typography } from "@mui/material";
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
    <>
      <Box display="flex" flexDirection="column" gap={4}>
        <Grid container spacing={10}>
          <GridLegacy item xs={12} sm={6}>
            <Box
              sx={{
                p: 3,
                boxShadow: 4,
                borderRadius: 4,
                textAlign: "center",
                alignContent: "center",
                backgroundColor: "#ff6c2f",
                color: "#fff",
                height: "100%",
                width: "100%",
              }}
            >
              <Typography variant="h6">Total Users</Typography>
              <Typography variant="h3">{count}</Typography>
            </Box>
          </GridLegacy>

          <GridLegacy item xs={12} sm={6}>
            <Box
              sx={{
                p: 3,
                boxShadow: 4,
                borderRadius: 4,
                textAlign: "center",
                alignContent: "center",
                backgroundColor: "#ff6c2f",
                color: "#fff",
                height: "100%",
                width: "100%",
              }}
            >
              <Typography variant="h6">Total Birthdays</Typography>
              <Typography variant="h3">15</Typography>
            </Box>
          </GridLegacy>
        </Grid>
      </Box>
    </>
  );
}
