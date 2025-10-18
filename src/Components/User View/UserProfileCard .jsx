import React, { useState } from "react";
import {
  Avatar,
  Stack,
  Typography,
  Box,
  Button,
  Modal,
  TextField,
} from "@mui/material";
import { toast } from "react-toastify";
import api from "../../utils/api";

const UserProfile = ({ user }) => {
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [amount, setAmount] = useState("");
  const [actionType, setActionType] = useState(null);

  // 📅 Format readable date
  function formatDate(dateStr) {
    if (!dateStr) return "—";
    const date = new Date(dateStr);
    const options = { month: "short", day: "numeric", year: "numeric" };
    return date.toLocaleDateString("en-US", options).replace(",", "'");
  }

  // 💰 Handle Credit/Debit API call
  const handleUpdateBalance = async () => {
    if (!amount || isNaN(amount)) {
      toast.error("Please enter a valid amount", { position: "top-center" });
      return;
    }
    try {
      setLoading(true);
      await api.patch("/super_admin/backend/update_customer_balance", {
        _id: user._id,
        amount: amount.toString(),
        type: actionType,
      });
      toast.success(`Balance ${actionType}ed successfully`, {
        position: "top-center",
        autoClose: 2000,
      });
      setOpen(false);
      setAmount("");
      setTimeout(() => window.location.reload(), 2000);
    } catch (err) {
      console.error("Balance update error:", err);
      toast.error("Failed to update balance", { position: "top-center" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Stack
        direction={{ xs: "column", sm: "row" }}
        spacing={4}
        alignItems={{ xs: "center", sm: "flex-start" }}
        sx={{
          p: 4,
          boxShadow: 3,
          borderRadius: 2,
          bgcolor: "#F5F6FA",
          mb: 2,
        }}
      >
        {/* 🧍 Profile Avatar */}
        <Avatar
          src={user.profile_photo || ""}
          alt={user.name || "User"}
          sx={{
            width: 120,
            height: 120,
            border: "4px solid #1976d2",
            bgcolor: "#BBDEFB",
            fontSize: 36,
          }}
        >
          {user.name ? user.name[0] : "U"}
        </Avatar>

        {/* ℹ️ Info Section */}
        <Stack spacing={1.2} justifyContent="center" sx={{ flex: 1 }}>
          <Typography variant="h5" fontWeight={600} sx={{ color: "#1976d2" }}>
            {user.name || "Unnamed User"}
          </Typography>

          <Typography variant="body1" fontSize={15} color="text.secondary">
            📧 {user.email || "No email"}
          </Typography>
          <Typography variant="body1" fontSize={15} color="text.secondary">
            📞 {user.phone || "No phone"}
          </Typography>
          <Typography variant="body1" fontSize={15} color="text.secondary">
            💰 Balance: ₹{user.balance || "0"}
          </Typography>
          <Typography variant="body1" fontSize={15} color="text.secondary">
            🗓 Joined on: {formatDate(user.createdAt)}
          </Typography>
          <Typography variant="body1" fontSize={15} color="text.secondary">
            🔄 Updated on: {formatDate(user.updatedAt)}
          </Typography>
        </Stack>

        {/* ⚙️ Action Section */}
        <Box
          sx={{
            alignSelf: { xs: "center", sm: "flex-start" },
            display: "flex",
            gap: 1,
          }}
        >
          <Button
            variant="contained"
            color="success"
            onClick={() => {
              setActionType("credit");
              setOpen(true);
            }}
          >
            Credit
          </Button>
          <Button
            variant="contained"
            color="error"
            onClick={() => {
              setActionType("debit");
              setOpen(true);
            }}
          >
            Debit
          </Button>
        </Box>
      </Stack>

      {/* 💬 Modal for Credit/Debit */}
      <Modal open={open} onClose={() => setOpen(false)}>
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            bgcolor: "background.paper",
            boxShadow: 24,
            borderRadius: 2,
            p: 4,
            width: 320,
          }}
        >
          <Typography variant="h6" mb={2}>
            {actionType === "credit" ? "Credit Amount" : "Debit Amount"}
          </Typography>
          <TextField
            fullWidth
            label="Enter amount"
            value={amount}
            onFocus={() => {
              window.addEventListener(
                "wheel",
                (e) => {
                  if (document.activeElement.type === "number") {
                    e.preventDefault();
                  }
                },
                { passive: false }
              );
            }}
            onBlur={(e) => {
              window.removeEventListener("wheel", (e) => e.preventDefault());
            }}
            onChange={(e) => setAmount(e.target.value)}
            type="number"
          />
          <Stack direction="row" spacing={2} mt={3} justifyContent="flex-end">
            <Button variant="outlined" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button
              variant="contained"
              color={actionType === "credit" ? "success" : "error"}
              disabled={loading}
              onClick={handleUpdateBalance}
            >
              {loading ? "Processing..." : "Confirm"}
            </Button>
          </Stack>
        </Box>
      </Modal>
    </>
  );
};

export default UserProfile;
