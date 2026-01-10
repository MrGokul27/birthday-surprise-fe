import { Button, Box } from "@mui/material";
import { useNavigate } from "react-router-dom";
import image404 from "../assets/images/404page.jpg";

export default function NotFound() {
  const navigate = useNavigate();

  const handleRedirect = () => {
    const token = localStorage.getItem("token");

    if (token) {
      navigate("/dashboard");
    } else {
      navigate("/");
    }
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: 3,
      }}
    >
      <img
        src={image404}
        alt="404 Not Found"
        style={{ maxWidth: "80%", height: "auto" }}
      />

      <Button
        variant="contained"
        sx={{ backgroundColor: "#ff6c2f", px: 4, py: 1.5 }}
        onClick={handleRedirect}
      >
        Go Back Home
      </Button>
    </Box>
  );
}
