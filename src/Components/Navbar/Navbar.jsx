import React from "react";
import {
  AppBar,
  Toolbar,
  InputBase,
  IconButton,
  Box,
  responsiveFontSizes,
} from "@mui/material";
import {
  Search,
  AccountCircle,
  Settings,
  Notifications,
} from "@mui/icons-material";
import "./navbar.css";

const Navbar = () => {
  return (
    <AppBar position="static" sx={styles.appBar}>
      <Toolbar sx={styles.toolbar}>
        {/* Logo */}
        <Box sx={styles.logo}>
          <img src="/textLogo.webp" alt="Logo" style={styles.logoImage} />
        </Box>

        {/* Search Box */}
        <Box sx={styles.searchBox}>
          <Search sx={styles.searchIcon} />
          <InputBase placeholder="Type here..." sx={styles.searchInput} />
        </Box>

        {/* Menu Items */}
        <Box sx={styles.menuIcons}>
          <IconButton sx={styles.icon}>
            <AccountCircle />
          </IconButton>
          {/* <IconButton sx={styles.icon}>
            <Settings />
          </IconButton> */}
          <IconButton sx={styles.icon}>
            <Notifications />
            <span id="notificationSpan">1</span>
          </IconButton>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

// Styling Variables
const styles = {
  appBar: {
    backgroundColor: "#f8f9fa", // Navbar background
    color: "#333", // Text color
    boxShadow: "0 2px 5px rgba(0, 0, 0, 0.1)",
  },
  toolbar: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "10px 20px",
  },
  logo: {
    display: "flex",
    alignItems: "center",
    justifyContent: "flex-start",
    maxWidth: { xs: "100px", sm: "150px", md: "180px" }, // Responsive width
  },
  logoImage: {
    width: "100%", // Ensures responsiveness
    height: "auto", // Maintains aspect ratio
  },
  searchBox: {
    display: { xs: "none", md: "flex" },
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: "20px",
    padding: "5px 10px",
    width: { xs: "100%", sm: "300px" }, // Responsive width
    maxWidth: "600px",
    border: "1px solid #ddd",
  },
  searchIcon: {
    marginRight: "10px",
    color: "#333",
  },
  searchInput: {
    width: "100%",
    color: "#333",
  },
  menuIcons: {
    display: "flex",
    alignItems: "center",
    gap: { xs: "2px", sm: "20px" }, // Responsive gap
  },
  icon: {
    color: "#333",
    "&:hover": {
      color: "#ff7300",
    },
  },
};

export default Navbar;
