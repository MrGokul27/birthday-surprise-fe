import {
  Box,
  Typography,
  TextField,
  Button,
  Grid,
  Snackbar,
  Alert,
} from "@mui/material";
import { useEffect, useState } from "react";
import CommonTable from "../../components/common/CommonTable";
import { useDispatch, useSelector } from "react-redux";
import type { RootState, AppDispatch } from "../../store";
import { fetchBirthdays } from "../../store/birthdaySlice";
import { updateBirthdayWish } from "../../store/birthdaySlice";
import SaveIcon from "@mui/icons-material/Save";

export default function BirthdayWishes() {
  const dispatch = useDispatch<AppDispatch>();
  const { data: birthdays, loading } = useSelector(
    (state: RootState) => state.birthday
  );

  const [wishes, setWishes] = useState<Record<string, string>>({});

  const [toast, setToast] = useState({
    open: false,
    message: "",
    severity: "success" as "success" | "error",
  });

  useEffect(() => {
    dispatch(fetchBirthdays());
  }, [dispatch]);

  const handleSaveWish = async (id: string) => {
    try {
      await dispatch(
        updateBirthdayWish({ id, wish: wishes[id] || "" })
      ).unwrap();

      setToast({
        open: true,
        message: "Birthday wish saved successfully 🎉",
        severity: "success",
      });
    } catch (err: any) {
      setToast({
        open: true,
        message: err || "Failed to save birthday wish",
        severity: "error",
      });
    }
  };

  const columns = [
    { key: "name", label: "Name" },
    { key: "relationship", label: "Relationship" },
    { key: "dob", label: "DOB" },
    { key: "age", label: "Age" },
    {
      key: "wish",
      label: "Birthday Wish",
      render: (row: any) => (
        <TextField
          fullWidth
          size="small"
          placeholder="Write your birthday wish..."
          value={wishes[row._id] ?? row.wish ?? ""}
          onChange={(e) => setWishes({ ...wishes, [row._id]: e.target.value })}
        />
      ),
    },
    {
      key: "actions",
      label: "Action",
      render: (row: any) => (
        <Button
          size="small"
          variant="contained"
          startIcon={<SaveIcon />}
          sx={{ backgroundColor: "#ff6c2f" }}
          onClick={() => handleSaveWish(row._id)}
        >
          Save
        </Button>
      ),
    },
  ];

  return (
    <Box>
      <Typography variant="h5">Add your Birthday Wishes here !!! 🎉</Typography>

      <Grid container>
        <Grid item xs={12} sx={{ width: "100%" }}>
          <CommonTable columns={columns} data={birthdays} loading={loading} />
        </Grid>
      </Grid>

      {/* 🔔 TOAST */}
      <Snackbar
        open={toast.open}
        autoHideDuration={3000}
        onClose={() => setToast({ ...toast, open: false })}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert
          severity={toast.severity}
          onClose={() => setToast({ ...toast, open: false })}
          sx={{ width: "100%" }}
        >
          {toast.message}
        </Alert>
      </Snackbar>
    </Box>
  );
}
