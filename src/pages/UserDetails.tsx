import { Box, Grid, GridLegacy, Typography } from "@mui/material";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import CommonTable from "../components/common/CommonTable";
import { fetchAllUsers } from "../store/userSlice";
import type { RootState, AppDispatch } from "../store";

export default function UserDetails() {
  const dispatch = useDispatch<AppDispatch>();

  const { users, loading } = useSelector((state: RootState) => state.user);

  useEffect(() => {
    dispatch(fetchAllUsers());
  }, [dispatch]);

  const columns = [
    { key: "name", label: "Name" },
    { key: "email", label: "Email" },
    { key: "role", label: "Role" },
  ];

  return (
    <Box sx={{ p: 3, boxShadow: 4, borderRadius: 4 }}>
      <Typography variant="h5">User Details 👤</Typography>

      <Grid container>
        <GridLegacy item xs={12} sx={{ width: "100%" }}>
          <CommonTable columns={columns} data={users} loading={loading} />
        </GridLegacy>
      </Grid>
    </Box>
  );
}
