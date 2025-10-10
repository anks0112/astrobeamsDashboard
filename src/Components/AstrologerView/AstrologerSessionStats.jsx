import React from "react";
import { Box, Typography, Chip, Grid, Stack, Divider } from "@mui/material";

const AstrologerSessionStats = ({ data }) => {
  if (!data) return null;

  const { chat, ivr } = data;

  // Helper for INR formatting
  const inr = (val) =>
    `₹${Number(val || 0).toLocaleString("en-IN", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`;

  // Helper for duration formatting
  const formatDuration = (minutes) => {
    const hrs = Math.floor(minutes / 60);
    const mins = Math.round(minutes % 60);
    return `${hrs}h ${mins}m`;
  };

  // Render a stats block (used for both chat and ivr)
  const renderStatsBlock = (title, stats) => (
    <Box
      sx={{
        p: 2,
        borderRadius: 2,
        boxShadow: 1,
        bgcolor: "#fff",
        border: "1px solid #ff9800",
        height: "100%",
      }}
    >
      <Typography
        variant="h6"
        sx={{
          mb: 1,
          fontWeight: "bold",
          color: "#ff7300",
          textAlign: "center",
        }}
      >
        {title}
      </Typography>
      <Divider sx={{ mb: 2 }} />

      <Stack spacing={1.5}>
        {Object.entries(stats).map(([status, values]) => (
          <Box key={status}>
            <Typography
              variant="subtitle1"
              fontWeight={600}
              sx={{ mb: 0.5, color: "#8B1C1C" }}
            >
              {status}
            </Typography>
            <Grid container spacing={1.5}>
              <Grid item xs={12} sm={4}>
                <Typography variant="body2" fontWeight={500}>
                  Count:{" "}
                  <Chip
                    label={values.count}
                    variant="outlined"
                    sx={{ borderColor: "#ff9800", color: "#ff9800" }}
                  />
                </Typography>
              </Grid>
              <Grid item xs={12} sm={4}>
                <Typography variant="body2" fontWeight={500}>
                  Earnings:{" "}
                  <Chip
                    label={inr(values.totalEarnings)}
                    variant="outlined"
                    sx={{ borderColor: "#ff9800", color: "#ff9800" }}
                  />
                </Typography>
              </Grid>
              <Grid item xs={12} sm={4}>
                <Typography variant="body2" fontWeight={500}>
                  Duration:{" "}
                  <Chip
                    label={formatDuration(values.totalDurationMinutes)}
                    variant="outlined"
                    sx={{ borderColor: "#ff9800", color: "#ff9800" }}
                  />
                </Typography>
              </Grid>
            </Grid>
          </Box>
        ))}
      </Stack>
    </Box>
  );

  return (
    <Box
      sx={{
        p: 4,
        boxShadow: 3,
        borderRadius: 2,
        bgcolor: "#FEF2E7",
        mt: 3,
      }}
    >
      <Typography
        variant="h6"
        sx={{
          fontWeight: "bold",
          mb: 3,
          textAlign: "center",
          color: "#8B1C1C",
        }}
      >
        Astrologer Session Statistics
      </Typography>

      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          {renderStatsBlock("Chat Sessions", chat)}
        </Grid>
        <Grid item xs={12} md={6}>
          {renderStatsBlock("IVR Calls", ivr)}
        </Grid>
      </Grid>
    </Box>
  );
};

export default AstrologerSessionStats;
