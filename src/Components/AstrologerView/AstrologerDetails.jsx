import React from "react";
import { Stack, Chip, Box, Typography } from "@mui/material";

const AstrologerDetails = ({ astrologer }) => {
  return (
    <Box sx={{ p: 4, boxShadow: 3, borderRadius: 2, bgcolor: "#FEF2E7" }}>
      {/* Gender, DOB, City */}
      <Stack
        direction={{ xs: "column", sm: "row" }}
        spacing={3}
        justifyContent="space-between"
        alignItems={{ xs: "flex-start", sm: "center" }}
        flexWrap="wrap"
      >
        <Typography variant="body1" fontWeight={500}>
          Gender:{" "}
          <Chip
            label={astrologer.gender}
            variant="outlined"
            sx={{
              fontSize: 16,
              p: 1,
              color: "#ff9800",
              borderColor: "#ff9800",
            }}
          />
        </Typography>
        <Typography variant="body1" fontWeight={500}>
          DOB:{" "}
          <Chip
            label={new Date(astrologer.dob).toLocaleDateString()}
            variant="outlined"
            sx={{
              fontSize: 16,
              p: 1,
              color: "#ff9800",
              borderColor: "#ff9800",
            }}
          />
        </Typography>
        <Typography variant="body1" fontWeight={500}>
          City:{" "}
          <Chip
            label={astrologer.city}
            variant="outlined"
            sx={{
              fontSize: 16,
              p: 1,
              color: "#ff9800",
              borderColor: "#ff9800",
            }}
          />
        </Typography>
        <Typography variant="body1" fontWeight={500}>
          Experience:{" "}
          <Chip
            label={`${astrologer.experience} years`}
            variant="outlined"
            sx={{
              fontSize: 16,
              p: 1,
              color: "#ff9800",
              borderColor: "#ff9800",
            }}
          />
        </Typography>
      </Stack>

      {/* Experience & Language */}
      <Stack
        direction={{ xs: "column", sm: "row" }}
        spacing={3}
        mt={2}
        justifyContent="space-between"
        alignItems={{ xs: "flex-start", sm: "center" }}
        flexWrap="wrap"
      >
        {astrologer.language && (
          <Typography variant="body1" fontWeight={500}>
            Language:{" "}
            <Chip
              label={astrologer.language}
              variant="outlined"
              sx={{
                fontSize: 16,
                p: 1,
                color: "#ff9800",
                borderColor: "#ff9800",
              }}
            />
          </Typography>
        )}
      </Stack>

      {/* Expertise */}
      <Stack direction="row" spacing={1} flexWrap="wrap" mt={2}>
        <Typography variant="body1" fontWeight={500} mr={1}>
          Expertise:
        </Typography>
        {astrologer.expertise.map((skill, index) => (
          <Chip
            key={index}
            label={skill}
            variant="outlined"
            sx={{
              fontSize: 16,
              p: 1,
              color: "#ff9800",
              borderColor: "#ff9800",
            }}
          />
        ))}
      </Stack>

      {/* Bio */}
      <Box mt={2}>
        <Typography variant="body1" fontWeight={500} mb={1}>
          Bio:
        </Typography>
        <Box sx={{ p: 2, bgcolor: "#FEF2E7", borderRadius: 1 }}>
          {astrologer.bio}
        </Box>
      </Box>
    </Box>
  );
};

export default AstrologerDetails;
