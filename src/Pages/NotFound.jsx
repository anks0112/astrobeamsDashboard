import React from "react";
import { Box, Typography, Button } from "@mui/material";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";

const Error = () => {
  const navigate = useNavigate();

  // Determine redirect path based on role
  const redirectPath = `/`;

  return (
    <Box sx={styles.container}>
      <Box sx={styles.errorIconContainer}>
        <ErrorOutlineIcon sx={styles.icon} />
      </Box>
      <Typography variant="h4" sx={styles.title}>
        404 - Page Not Found
      </Typography>
      <Typography variant="body1" sx={styles.message}>
        The page you are looking for doesn't exist or an error occurred.
      </Typography>
      <Button
        variant="contained"
        sx={styles.button}
        onClick={() => navigate(redirectPath)}
      >
        Back to Dashboard
      </Button>
    </Box>
  );
};

// Styling Variables
const styles = {
  container: {
    minHeight: "100vh",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    textAlign: "center",
    backgroundColor: "#f8f9fa",
    padding: "20px",
    animation: "fadeIn 0.6s ease-in-out",
  },
  errorIconContainer: {
    width: "120px",
    height: "120px",
    borderRadius: "50%",
    backgroundColor: "#ffebee",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    boxShadow: "0 5px 10px rgba(0, 0, 0, 0.1)",
    marginBottom: "20px",
  },
  icon: {
    fontSize: { xs: "60px", md: "80px" },
    color: "#d32f2f",
  },
  title: {
    fontWeight: "bold",
    color: "#333",
    marginBottom: "10px",
  },
  message: {
    color: "#666",
    marginBottom: "20px",
    fontSize: { xs: "16px", md: "18px" },
    maxWidth: "450px",
  },
  button: {
    backgroundColor: "#00796B",
    color: "white",
    padding: { xs: "10px", md: "12px" },
    fontSize: { xs: "14px", md: "16px" },
    borderRadius: "8px",
    textTransform: "none",
    "&:hover": {
      backgroundColor: "#004D40",
    },
  },
};

export default Error;
