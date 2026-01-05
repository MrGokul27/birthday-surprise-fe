import {
  Box,
  Button,
  TextField,
  Typography,
  Grid,
  Snackbar,
  Alert,
  MenuItem,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from "@mui/material";
import axios from "axios";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";

/* 🔒 Validation Schema */
const schema = yup.object({
  name: yup.string().required("Name is required"),
  gender: yup.string().required("Gender is required"),
  dob: yup.string().required("Date of birth is required"),
  email: yup.string().required("Email is required").email("Enter valid email"),
});

type FormData = yup.InferType<typeof schema>;

type Birthday = {
  _id: string;
  name: string;
  age: number;
  gender: string;
  dob: string;
  email: string;
};

export default function BirthdayPanel() {
  const role = localStorage.getItem("role");

  const [birthdays, setBirthdays] = useState<Birthday[]>([]);
  const [toast, setToast] = useState<{
    open: boolean;
    message: string;
    severity: "success" | "error";
  }>({
    open: false,
    message: "",
    severity: "success",
  });

  const token = localStorage.getItem("token");

  const axiosAuth = axios.create({
    baseURL: "http://localhost:5000/api",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({
    resolver: yupResolver(schema),
  });

  const dob = watch("dob");

  const calculateAge = (dob: string) => {
    const birthDate = new Date(dob);
    const today = new Date();

    let age = today.getFullYear() - birthDate.getFullYear();
    const m = today.getMonth() - birthDate.getMonth();

    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  };

  const fetchBirthdays = async () => {
    const res = await axiosAuth.get("/birthday");
    setBirthdays(res.data);
  };

  useEffect(() => {
    fetchBirthdays();
  }, []);

  const onSubmit = async (data: FormData) => {
    try {
      const age = calculateAge(data.dob);

      await axiosAuth.post("/birthday", {
        ...data,
        age,
      });

      setToast({
        open: true,
        message: "Birthday details saved successfully 🎉",
        severity: "success",
      });

      reset();
      fetchBirthdays();
    } catch (err: any) {
      setToast({
        open: true,
        message:
          err.response?.data?.message || "Failed to save birthday details",
        severity: "error",
      });
    }
  };

  return (
    <Box>
      <Typography variant="h6" mb={2}>
        Add Birthday Person & their Details
      </Typography>

      {/* FORM */}
      <Grid container spacing={2}>
        <Grid item xs={12} md={4}>
          <TextField
            label="Name"
            fullWidth
            {...register("name")}
            error={!!errors.name}
            helperText={errors.name?.message}
          />
        </Grid>

        <Grid item xs={12} md={2}>
          <TextField
            select
            label="Gender"
            fullWidth
            sx={{ width: 150 }}
            defaultValue=""
            {...register("gender")}
            error={!!errors.gender}
            helperText={errors.gender?.message}
          >
            <MenuItem value="Male">Male</MenuItem>
            <MenuItem value="Female">Female</MenuItem>
          </TextField>
        </Grid>

        <Grid item xs={12} md={3}>
          <TextField
            label="Date of Birth"
            type="date"
            fullWidth
            InputLabelProps={{ shrink: true }}
            {...register("dob")}
            error={!!errors.dob}
            helperText={errors.dob?.message}
          />
        </Grid>

        <Grid item xs={12} md={3}>
          <TextField
            label="Age"
            fullWidth
            value={dob ? calculateAge(dob) : ""}
            disabled
          />
        </Grid>

        <Grid item xs={12}>
          <TextField
            label="Email"
            fullWidth
            {...register("email")}
            error={!!errors.email}
            helperText={errors.email?.message}
          />
        </Grid>

        <Grid item xs={12}>
          <Button
            variant="contained"
            sx={{ py: 2 }}
            disabled={isSubmitting}
            onClick={handleSubmit(onSubmit)}
          >
            Save Birthday Details
          </Button>
        </Grid>
      </Grid>

      {/* LIST */}
      <Typography variant="body2" color="text.secondary" mt={5} mb={2}>
        {role === "admin"
          ? "You are viewing all birthday records (Admin)"
          : "You are viewing your birthday records"}
      </Typography>

      <Grid container spacing={2}>
        <Grid item xs={12}>
          <TableContainer component={Paper} sx={{ mt: 3 }}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Name</TableCell>
                  <TableCell>Age</TableCell>
                  <TableCell>Gender</TableCell>
                  <TableCell>DOB</TableCell>
                  <TableCell>Email</TableCell>
                  {role === "admin" && <TableCell>Added By</TableCell>}
                </TableRow>
              </TableHead>
              <TableBody>
                {birthdays.map((b) => (
                  <TableRow key={b._id}>
                    <TableCell>{b.name}</TableCell>
                    <TableCell>{b.age}</TableCell>
                    <TableCell>{b.gender}</TableCell>
                    <TableCell>{b.dob}</TableCell>
                    <TableCell>{b.email}</TableCell>
                    {role === "admin" && (
                      <TableCell>
                        {b.createdBy_name && b.createdBy_email
                          ? `${b.createdBy_name} (${b.createdBy_email})`
                          : "Unknown"}
                      </TableCell>
                    )}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
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
