import {
  Box,
  Button,
  TextField,
  Typography,
  Grid,
  Snackbar,
  Alert,
  MenuItem,
} from "@mui/material";
import axios from "axios";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import SaveIcon from "@mui/icons-material/Save";
import CommonTable from "../components/common/CommonTable";

/* 🔒 Validation Schema */
const schema = yup.object({
  name: yup.string().required("Name is required"),
  gender: yup.string().required("Gender is required"),
  relationship: yup.string().required("Relationship is required"),
  contact: yup.string().required("Contact is required"),
  dob: yup.string().required("Date of birth is required"),
  email: yup.string().required("Email is required").email("Enter valid email"),
});

type FormData = yup.InferType<typeof schema>;

type Birthday = {
  _id: string;
  name: string;
  age: number;
  gender: string;
  relationship: string;
  contact: string;
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

  const columns = [
    { key: "name", label: "Name" },
    { key: "age", label: "Age" },
    { key: "gender", label: "Gender" },
    { key: "relationship", label: "Relationship" },
    { key: "dob", label: "DOB" },
    { key: "contact", label: "Contact" },
    { key: "email", label: "Email" },

    ...(role === "admin"
      ? [
          {
            key: "addedBy",
            label: "Added By",
            render: (row) =>
              row.createdBy_name && row.createdBy_email
                ? `${row.createdBy_name} (${row.createdBy_email})`
                : "Unknown",
          },
        ]
      : []),
  ];

  return (
    <Box sx={{ p: 3, boxShadow: 4, borderRadius: 4 }}>
      <Typography variant="h5" mb={2}>
        Add Birthday Person & their Details
      </Typography>

      {/* FORM */}
      <Grid container spacing={2}>
        <Grid item xs={12} md={4}>
          <TextField
            label="Full Name"
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

        <Grid item xs={12} md={2}>
          <TextField
            select
            label="Relationship"
            fullWidth
            sx={{ width: 150 }}
            defaultValue=""
            {...register("relationship")}
            error={!!errors.relationship}
            helperText={errors.relationship?.message}
          >
            <MenuItem value="family">Family</MenuItem>
            <MenuItem value="friend">Friend</MenuItem>
            <MenuItem value="colleague">Colleague</MenuItem>
            <MenuItem value="partner">Partner</MenuItem>
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
            label="Email ID"
            fullWidth
            {...register("email")}
            error={!!errors.email}
            helperText={errors.email?.message}
          />
        </Grid>

        <Grid item xs={12}>
          <TextField
            label="Contact Number"
            type="number"
            fullWidth
            {...register("contact")}
            error={!!errors.contact}
            helperText={errors.contact?.message}
          />
        </Grid>

        <Grid item xs={12}>
          <Button
            variant="contained"
            sx={{ py: 2, backgroundColor: "#ff6c2f" }}
            startIcon={<SaveIcon />}
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
        <Grid item xs={12} sx={{ width: "100%" }}>
          <CommonTable columns={columns} data={birthdays} />
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
