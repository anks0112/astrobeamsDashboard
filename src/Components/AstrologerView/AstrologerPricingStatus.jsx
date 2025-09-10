import React from "react";
import { Box, Typography, Stack, Chip, Grid } from "@mui/material";

const AstrologerPricingStatus = ({ astrologer }) => {
  return (
    <Box
      sx={{
        p: 4,
        boxShadow: 3,
        borderRadius: 2,
        bgcolor: "#FEF2E7",
        mt: 2,
      }}
    >
      {/* Active & Busy Status */}
      <Stack
        direction={{ xs: "column", sm: "row" }}
        spacing={2}
        justifyContent="center"
        alignItems="center"
        mb={2}
      >
        <Typography variant="body1" fontWeight={500}>
          Active:{" "}
          <Chip
            label={astrologer.is_active ? "Yes" : "No"}
            color={astrologer.is_active ? "success" : "error"}
            variant="outlined"
          />
        </Typography>
        <Typography variant="body1" fontWeight={500}>
          Busy:{" "}
          <Chip
            label={astrologer.is_busy ? "Yes" : "No"}
            color={astrologer.is_busy ? "warning" : "primary"}
            variant="outlined"
          />
        </Typography>
      </Stack>

      {/* Pricing & Financial Info */}
      <Grid container spacing={2} justifyContent="space-between">
        <Grid item xs={12} sm={6} md={4}>
          <Typography variant="body1" fontWeight={500}>
            Chat Price:{" "}
            <Chip
              label={`₹${astrologer.chat_price}`}
              sx={{ color: "#ff9800", borderColor: "#ff9800", fontSize: 16 }}
              variant="outlined"
            />
          </Typography>
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <Typography variant="body1" fontWeight={500}>
            Chat Offer Price:{" "}
            <Chip
              label={`₹${astrologer.chat_offer_price}`}
              sx={{
                color: "#ff9800",
                borderColor: "#ff9800",
                fontSize: 16,
              }}
              variant="outlined"
            />
          </Typography>
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <Typography variant="body1" fontWeight={500}>
            Voice Call Price:{" "}
            <Chip
              label={`₹${astrologer.voice_call_price}`}
              sx={{ color: "#ff9800", borderColor: "#ff9800", fontSize: 16 }}
              variant="outlined"
            />
          </Typography>
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <Typography variant="body1" fontWeight={500}>
            Voice Call Offer Price:{" "}
            <Chip
              label={`₹${astrologer.voice_call_offer_price}`}
              sx={{ color: "#ff9800", borderColor: "#ff9800", fontSize: 16 }}
              variant="outlined"
            />
          </Typography>
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <Typography variant="body1" fontWeight={500}>
            Current Balance:{" "}
            <Chip
              label={`₹${astrologer.current_balance}`}
              sx={{ color: "#ff9800", borderColor: "#ff9800", fontSize: 16 }}
              variant="outlined"
            />
          </Typography>
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <Typography variant="body1" fontWeight={500}>
            Withdrawal Balance:{" "}
            <Chip
              label={`₹${astrologer.withdrawl_balance}`}
              sx={{ color: "#ff9800", borderColor: "#ff9800", fontSize: 16 }}
              variant="outlined"
            />
          </Typography>
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <Typography variant="body1" fontWeight={500}>
            Commission:{" "}
            <Chip
              label={`${astrologer.commission}%`}
              sx={{ color: "#ff9800", borderColor: "#ff9800", fontSize: 16 }}
              variant="outlined"
            />
          </Typography>
        </Grid>
      </Grid>
    </Box>
  );
};

export default AstrologerPricingStatus;
