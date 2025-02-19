import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
} from "@mui/material";
import {
  Home,
  Inventory,
  Logout,
  BrandingWatermark,
  AutoAwesome,
  People,
  Support,
} from "@mui/icons-material";
import { Link, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
// import { logoutSuperAdmin } from "../../Redux/superAdminAuthSlice";
// import { resetState } from "../../Redux/globalStateSlice";
import LogoutConfirmationModal from "./LogoutConfirmationModal";

const Sidebar = () => {
  // const { isAuthenticated } = useSelector((state) => state.superadmin);
  const location = useLocation();
  // const dispatch = useDispatch();

  // console.log(isAuthenticated);

  // Get the current path to highlight the correct item on refresh
  const [logoutModalOpen, setLogoutModalOpen] = useState(false); // State for logout modal
  const [selected, setSelected] = useState("");

  useEffect(() => {
    const currentItem = menuItems.find(
      (item) => item.url && location.pathname === item.url
    );
    if (currentItem) {
      setSelected(currentItem.text);
    }
  }, [location.pathname]);

  const menuItems = [
    { text: "Dashboard", icon: <Home />, url: "/" },
    { text: "Astrologers", icon: <AutoAwesome />, url: "/astrologers" },
    { text: "Users", icon: <People />, url: "/users" },
    { text: "Orders", icon: <Inventory />, url: "/orders" },
    { text: "Banners", icon: <BrandingWatermark />, url: "/banners" },
    { text: "Support Ticket", icon: <Support />, url: "/support-ticket" },
    {
      text: "Sign Out",
      icon: <Logout />,
      action: () => setLogoutModalOpen(true), // Open the logout modal
    },
  ];

  // const accountItems = isAuthenticated
  //   ? [
  //       // { text: "Profile", icon: <Person />, url: "/profile" },
  //       // { text: "Support Ticket", icon: <ContactSupport />, url: "/support" },
  //     ]
  //   : [
  //       // { text: "Profile", icon: <Person />, url: "/profile" },
  //       { text: "Sign In", icon: <Login />, url: "/login" },
  //       // { text: "Support Ticket", icon: <ContactSupport />, url: "/support" },
  //     ];

  return (
    <Box sx={styles.sidebar}>
      {/* Navigation Items */}
      <List>
        {menuItems.map((item) =>
          item.url ? (
            // Normal menu items with links
            <Link
              to={item.url}
              key={item.text}
              style={{ textDecoration: "none", color: "inherit" }}
            >
              <ListItem
                sx={{
                  ...styles.listItem,
                  backgroundColor:
                    selected === item.text ? "#FFEFD5" : "transparent",
                }}
                onClick={() => setSelected(item.text)}
              >
                <ListItemIcon sx={styles.icon}>{item.icon}</ListItemIcon>
                <ListItemText primary={item.text} sx={styles.listItemText} />
              </ListItem>
            </Link>
          ) : (
            // Special case for "Sign Out" (no link, uses action)
            <ListItem
              key={item.text}
              sx={{
                ...styles.listItem,
                backgroundColor:
                  selected === item.text ? "#FFEFD5" : "transparent",
              }}
              onClick={item.action} // Calls the logout action instead of navigating
            >
              <ListItemIcon sx={styles.icon}>{item.icon}</ListItemIcon>
              <ListItemText primary={item.text} sx={styles.listItemText} />
            </ListItem>
          )
        )}
      </List>

      {/* Help Section */}
      {/* <Box sx={styles.helpBox}>
        <ListItemIcon>
          <HelpOutline sx={styles.helpIcon} />
        </ListItemIcon>
         <Box>
          <Typography variant="body2" sx={styles.helpText}>
            Need help?
          </Typography>
          <Typography variant="caption">Please check our docs</Typography>
        </Box> 
      </Box> */}

      <LogoutConfirmationModal
        open={logoutModalOpen}
        onClose={() => setLogoutModalOpen(false)}
      />
      {/* Footer Message */}
      <Box
        sx={{
          position: "absolute",
          bottom: 20 /* Keeps it at the bottom */,
          left: "50%",
          transform: "translateX(-50%)",
          textAlign: "center",
          width: "100%",
          fontWeight: "bold",
          padding: "5px 0",
          fontSize: {
            xs: "10px", // Smallest screens (phones)
            sm: "11px", // Tablets
            md: "12px", // Default size for larger screens
          },
          color: "#666",
        }}
      >
        <Typography
          variant="body2"
          sx={{ fontSize: { xs: "10px", sm: "11px", md: "14px" } }}
        >
          Powered by Krantecq Solutions
        </Typography>
      </Box>
    </Box>
  );
};

// Styling Variables
const styles = {
  sidebar: {
    width: "100%",
    height: "100vh",
    // backgroundColor: "#F8F9FA",
    padding: "20px 10px",
    transition: "width 0.3s ease",
  },
  listItem: {
    padding: "10px",
    borderRadius: "10px",
    cursor: "pointer",
    "&:hover": {
      backgroundColor: "#FFEFD5", // Hover effect
    },
  },
  listItemText: {
    display: { xs: "none", sm: "block" },
  },
  sectionHeader: {
    display: { xs: "none", md: "inline-flex" },
    fontWeight: "bold",
    color: "#8A8D91",
    marginTop: "20px",
    paddingLeft: "10px",
  },
  helpBox: {
    marginTop: "auto",
    backgroundColor: "#00796B",
    borderRadius: "10px",
    color: "white",
    padding: "15px",
    display: { xs: "none", md: "flex" },
    alignItems: "center",
    gap: "10px",
  },
  helpIcon: {
    fontSize: "30px",
    color: "#fff",
  },
  helpText: {
    fontWeight: "bold",
  },
  icon: {
    color: "#ff9800",
  },
};

export default Sidebar;
