import React, { useState } from "react";
import { Avatar, Stack, Typography, Box, Button } from "@mui/material";
import { toast } from "react-toastify";
import api from "../../utils/api";

const AstrologerProfile = ({ astrologer }) => {
  const [loading, setLoading] = useState(false);

  function formatDate(dateStr) {
    const date = new Date(dateStr);
    const options = { month: "short", day: "numeric", year: "numeric" };
    return date.toLocaleDateString("en-US", options).replace(",", "'");
  }

  const handleCompleteInteractions = async () => {
    try {
      setLoading(true);
      await api.post("/super_admin/backend/complete_interactions", {
        astrologerId: astrologer._id,
      });
      toast.success("All in-progress orders moved to completed", {
        position: "top-center",
        autoClose: 2000,
      });

      // ✅ reload page after success
      setTimeout(() => {
        window.location.reload();
      }, 2000); // reload after 2s so toast is visible
    } catch (err) {
      console.error("Complete Interactions Error:", err);
      toast.error("Failed to complete interactions", {
        position: "top-center",
        autoClose: 2000,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Stack
      direction={{ xs: "column", sm: "row" }}
      spacing={4}
      alignItems={{ xs: "center", sm: "flex-start" }}
      sx={{ p: 4, boxShadow: 3, borderRadius: 2, bgcolor: "#FEF2E7", mb: 2 }}
    >
      {/* Profile Photo */}
      <Avatar
        src={astrologer.profile_photo}
        alt={astrologer.name}
        sx={{ width: 140, height: 140, border: "4px solid #ff9800" }}
      />

      {/* Info Section */}
      <Stack spacing={2} justifyContent="center" sx={{ flex: 1 }}>
        <Typography variant="h5" fontWeight={500} sx={{ color: "#ff9800" }}>
          {astrologer.name}
        </Typography>
        <Typography variant="body1" fontSize={15} color="text.secondary">
          📧 {astrologer.email}
        </Typography>
        <Typography variant="body1" fontSize={15} color="text.secondary">
          📞 {astrologer.phone}
        </Typography>
        <Typography variant="body1" fontSize={15} color="text.secondary">
          Joined on: {formatDate(astrologer.createdAt)}
        </Typography>
      </Stack>

      {/* Action Section (Black marked place in screenshot) */}
      <Box sx={{ alignSelf: { xs: "center", sm: "flex-start" } }}>
        <Button
          variant="contained"
          color="warning"
          disabled={loading}
          onClick={handleCompleteInteractions}
        >
          {loading ? "Processing..." : "Complete Interactions"}
        </Button>
      </Box>
    </Stack>
  );
};

export default AstrologerProfile;
