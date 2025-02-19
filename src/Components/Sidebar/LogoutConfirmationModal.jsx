import React from "react";
import { Modal, Box, Typography, Button } from "@mui/material";
import { useDispatch } from "react-redux";
// import { logoutSuperAdmin } from "../../Redux/superAdminAuthSlice";
// import { resetState } from "../../Redux/globalStateSlice";

const LogoutConfirmationModal = ({ open, onClose }) => {
  // const dispatch = useDispatch();

  const handleLogout = () => {
    // console.log("loggedOut");
    // dispatch(logoutSuperAdmin());
    // dispatch(resetState());
    onClose(); // Close modal after logout
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      aria-labelledby="logout-confirmation-modal"
    >
      <Box sx={styles.modalContainer}>
        <Typography variant="h6" sx={styles.modalTitle}>
          Confirm Sign out
        </Typography>
        <Typography variant="body1" sx={styles.message}>
          Are you sure you want to sign out?
        </Typography>
        <Box sx={styles.buttonContainer}>
          <Button
            variant="contained"
            sx={styles.logoutButton}
            onClick={handleLogout}
          >
            Yes, Sign out
          </Button>
          <Button variant="outlined" sx={styles.cancelButton} onClick={onClose}>
            Cancel
          </Button>
        </Box>
      </Box>
    </Modal>
  );
};

// Styling for the modal
const styles = {
  modalContainer: {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: "90%",
    maxWidth: "400px",
    bgcolor: "background.paper",
    boxShadow: 24,
    p: 4,
    borderRadius: "8px",
    textAlign: "center",
  },
  modalTitle: {
    fontWeight: "bold",
    marginBottom: "10px",
  },
  message: {
    marginBottom: "20px",
  },
  buttonContainer: {
    display: "flex",
    justifyContent: "space-between",
    gap: "10px",
  },
  logoutButton: {
    backgroundColor: "#ff7300",
    "&:hover": { backgroundColor: "#ff9800" },
  },
  cancelButton: {
    borderColor: "#ff7300",
    color: "#ff7300",
    "&:hover": { borderColor: "#ff9800", color: "#ff9800" },
  },
};

export default LogoutConfirmationModal;
