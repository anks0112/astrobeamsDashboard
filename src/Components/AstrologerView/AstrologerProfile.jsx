import React from "react";
import { Avatar, Stack, Typography, Box } from "@mui/material";

const AstrologerProfile = ({ astrologer }) => {
  function formatDate(dateStr) {
    const date = new Date(dateStr);
    const options = { month: "short", day: "numeric", year: "numeric" };
    return date.toLocaleDateString("en-US", options).replace(",", "'");
  }

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
      <Stack spacing={2} justifyContent="center">
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
    </Stack>
  );
};

export default AstrologerProfile;
