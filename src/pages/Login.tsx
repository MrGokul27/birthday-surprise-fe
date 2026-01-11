import {
  Button,
  TextField,
  Box,
  Typography,
  Snackbar,
  Alert,
  Grid,
} from "@mui/material";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useState } from "react";
import bgImage from "../assets/images/pngtree-friend-birthday-vector-png-image_11071141.png";
import LoginIcon from "@mui/icons-material/Login";

/* 🔒 Validation Schema */
const schema = yup.object({
  email: yup
    .string()
    .required("Email is required")
    .email("Enter a valid email"),
  password: yup.string().required("Password is required"),
});

type FormData = yup.InferType<typeof schema>;

export default function Login() {
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
      const res = await axios.post(
        "http://localhost:5000/api/auth/login",
        data
      );

      localStorage.setItem("token", res.data.token);
      localStorage.setItem("role", res.data.role);

      setToast({
        open: true,
        message: "Login successful! Redirecting...",
        severity: "success",
      });

      setTimeout(() => navigate("/dashboard"), 1000);
    } catch (err: any) {
      setToast({
        open: true,
        message: err.response?.data?.message || "Invalid email or password",
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
              maxWidth: 540,
              mx: "auto",
            }}
            borderRadius={2}
          >
            <h2 style={{ fontSize: "2rem", color: "#7f3627" }}>
              Start a surprise for your loved one.
            </h2>
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
              startIcon={<LoginIcon />}
              sx={{ mt: 2, py: 1.5, backgroundColor: "#7f3627" }}
              disabled={isSubmitting}
              onClick={handleSubmit(onSubmit)}
            >
              Login
            </Button>

            {/* JOIN US LINK */}
            <Box mt={2} textAlign="center">
              <Typography variant="body2">
                Don’t have an account?{" "}
                <Typography
                  component="span"
                  sx={{
                    color: "primary.main",
                    cursor: "pointer",
                    fontWeight: 500,
                  }}
                  onClick={() => navigate("/register")}
                >
                  Surprise your loved one by registering now!
                </Typography>
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
