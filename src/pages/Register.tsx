import {
  Button,
  TextField,
  Box,
  Grid,
  Typography,
  Snackbar,
  Alert,
} from "@mui/material";
import axios from "axios";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import bgImage from "../assets/images/pngtree-friend-birthday-vector-png-image_11071141.png";
import PersonAddIcon from "@mui/icons-material/PersonAdd";

/* 🔒 Validation Schema */
const schema = yup.object({
  name: yup
    .string()
    .required("Name is required")
    .min(3, "Name must be at least 3 characters"),
  email: yup
    .string()
    .required("Email is required")
    .email("Enter a valid email"),
  password: yup
    .string()
    .required("Password is required")
    .min(6, "Password must be at least 6 characters"),
});

type FormData = yup.InferType<typeof schema>;

export default function Register() {
  const navigate = useNavigate();

  const [toast, setToast] = useState<{
    open: boolean;
    message: string;
    severity: "success" | "error";
  }>({
    open: false,
    message: "",
    severity: "success",
  });

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({
    resolver: yupResolver(schema),
  });

  const onSubmit = async (data: FormData) => {
    try {
      await axios.post("http://localhost:5000/api/auth/register", data);

      setToast({
        open: true,
        message: "Registered successfully! Redirecting to login...",
        severity: "success",
      });

      setTimeout(() => navigate("/"), 1500);
    } catch (err: any) {
      setToast({
        open: true,
        message:
          err.response?.data?.message || "Registration failed. Try again.",
        severity: "error",
      });
    }
  };

  return (
    <Box
      sx={{
        background: "linear-gradient(135deg, #fedce4 0%, #fbb1c8 100%)",
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Grid
        container
        maxWidth="xl"
        spacing={4}
        alignItems="center"
        justifyContent="center"
      >
        <Grid item xs={12} md={6}>
          <Box
            component="img"
            src={bgImage}
            alt="Birthday Cake"
            sx={{
              width: { xs: 300, sm: 400, md: 500, lg: 600 },
              height: "auto",
              ":hover": { transform: "scale(1.05)" },
              transition: "transform 0.3s ease-in-out",
            }}
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <Box
            px={4}
            py={6}
            sx={{
              boxShadow: "0 10px 30px rgba(127, 54, 39, 0.4)",
            }}
            borderRadius={2}
          >
            <h2 style={{ fontSize: "2rem", color: "#7f3627" }}>Register Now</h2>

            <TextField
              label="Name"
              fullWidth
              margin="normal"
              {...register("name")}
              error={!!errors.name}
              helperText={errors.name?.message}
            />

            <TextField
              label="Email"
              fullWidth
              margin="normal"
              {...register("email")}
              error={!!errors.email}
              helperText={errors.email?.message}
            />

            <TextField
              label="Password"
              type="password"
              fullWidth
              margin="normal"
              {...register("password")}
              error={!!errors.password}
              helperText={errors.password?.message}
            />

            <Button
              fullWidth
              variant="contained"
              startIcon={<PersonAddIcon />}
              sx={{ mt: 2, py: 1.5, backgroundColor: "#7f3627" }}
              type="submit"
              disabled={isSubmitting}
              onClick={handleSubmit(onSubmit)}
            >
              Register
            </Button>

            {/* 🔙 RETURN TO LOGIN */}
            <Box mt={2} textAlign="center">
              <Typography
                variant="body2"
                sx={{
                  cursor: "pointer",
                  color: "primary.main",
                  fontWeight: 500,
                }}
                onClick={() => navigate("/")}
              >
                Back to Login
              </Typography>
            </Box>
          </Box>
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
