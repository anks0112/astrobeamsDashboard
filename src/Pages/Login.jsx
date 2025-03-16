import React, { useState } from "react";
import {
  Box,
  TextField,
  Button,
  Typography,
  Paper,
  InputAdornment,
  IconButton,
  useMediaQuery,
  useTheme,
  CircularProgress,
} from "@mui/material";
import { Visibility, VisibilityOff, Lock, Person } from "@mui/icons-material";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom";
import { loginSuperAdmin } from "../redux/slices/authSlice";

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [loginData, setLoginData] = useState({ username: "", password: "" });
  const navigate = useNavigate();
  const isLoading = false;
  const dispatch = useDispatch();
  const { isLoggedIn, loading, error } = useSelector(
    (state) => state.authSlice
  );

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const handleChange = (e) => {
    setLoginData({ ...loginData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!loginData.username || !loginData.password) {
      toast.error("Please fill in all fields!", {
        position: "top-center",
      });
      return;
    }
    const params = {
      super_admin_email: loginData.username,
      super_admin_password: loginData.password,
    };

    dispatch(loginSuperAdmin(params))
      .then((action) => {
        if (action.meta.requestStatus === "fulfilled") {
          toast.success("Login Successful!", { position: "top-center" });
          navigate("/dashboard");
        } else {
          toast.error(
            action.payload || "Invalid credentials. Please try again.",
            { position: "top-center" }
          );
        }
      })
      .catch((err) => {
        console.error("An unexpected error occurred:", err);
        toast.error(err.msg, {
          position: "top-center",
        });
      });
  };

  return (
    <Box sx={styles.container}>
      <Paper elevation={6} sx={styles.paper(isMobile)}>
        <Box sx={styles.logoContainer}>
          <img src="\textLogo.webp" alt="Agribids Logo" style={styles.logo} />
        </Box>

        <Typography variant="h5" sx={styles.title}>
          Admin Login
        </Typography>

        <Box component="form" sx={styles.form} onSubmit={handleSubmit}>
          <TextField
            fullWidth
            label="Username"
            name="username"
            variant="outlined"
            value={loginData.username}
            onChange={handleChange}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Person />
                </InputAdornment>
              ),
            }}
          />
          <TextField
            fullWidth
            type={showPassword ? "text" : "password"}
            label="Password"
            name="password"
            variant="outlined"
            value={loginData.password}
            onChange={handleChange}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Lock />
                </InputAdornment>
              ),
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton onClick={() => setShowPassword(!showPassword)}>
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />

          <Button
            type="submit"
            variant="contained"
            fullWidth
            sx={styles.loginButton}
            // disabled={isLoading}
          >
            {loading ? (
              <CircularProgress size={24} sx={{ color: "#ffffff" }} />
            ) : (
              "Login"
            )}
          </Button>
        </Box>

        {/* <Typography variant="body2" sx={styles.forgotPassword}>
          Forgot Password?
        </Typography> */}
      </Paper>
    </Box>
  );
};

// Styling Variables
const styles = {
  container: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    height: "100vh",
    padding: "0 20px",
    background: "linear-gradient(to right, #ff9800, #ff7200)",
  },
  paper: (isMobile) => ({
    padding: isMobile ? "30px 20px" : "50px",
    width: "100%",
    maxWidth: isMobile ? "320px" : "400px",
    borderRadius: "12px",
    textAlign: "center",
  }),
  logoContainer: {
    display: "flex",
    justifyContent: "center",
    marginBottom: "20px",
  },
  logo: {
    width: "130px",
    height: "40px",
  },
  title: {
    fontWeight: "bold",
    marginBottom: "20px",
    color: "#ff9800",
  },
  form: {
    display: "flex",
    flexDirection: "column",
    gap: "20px",
  },
  loginButton: {
    backgroundColor: "#ff9800",
    color: "#fff",
    fontWeight: "bold",
    "&:hover": {
      backgroundColor: "#ff7200",
    },
  },
  forgotPassword: {
    marginTop: "20px",
    cursor: "pointer",
    color: "#00796B",
    "&:hover": {
      textDecoration: "underline",
    },
  },
};

export default Login;
