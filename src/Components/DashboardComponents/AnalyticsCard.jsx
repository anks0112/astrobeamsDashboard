import React from "react";
import { Card, CardContent, Typography, Box } from "@mui/material";

const AnalyticsCard = ({ title, value, change, icon }) => {
  return (
    <Card sx={styles.card}>
      <CardContent sx={styles.cardContent}>
        <Box sx={styles.textContainer}>
          <Typography variant="body2" sx={styles.title}>
            {title}
          </Typography>
          <div
            style={{
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-evenly",
              gap: "15px",
            }}
          >
            <Typography variant="h6" sx={styles.value}>
              {value}
            </Typography>
            <Typography
              variant="body2"
              sx={{
                color: change.startsWith("-") ? "red" : "green",
                fontWeight: "bold",
              }}
            >
              {change}
            </Typography>
          </div>
        </Box>
        <Box sx={styles.iconContainer}>
          <Typography sx={{ fontSize: "5px" }}>{icon}</Typography>
        </Box>
      </CardContent>
    </Card>
  );
};

// Styles
const styles = {
  card: {
    backgroundColor: "#F8F9FA",
    borderRadius: "12px",
    boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)",
    padding: "20px",
    height: "80%",
  },
  cardContent: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    height: "100%",
  },
  textContainer: {
    display: "flex",
    flexDirection: "column",
    gap: "4px",
  },
  title: {
    color: "#8A8D91",
    fontSize: { xs: "0.9rem", sm: "1rem" },
  },
  value: {
    fontWeight: "bold",
    fontSize: { xs: "1.2rem", sm: "1.5rem" },
  },
  iconContainer: {
    backgroundColor: "#ff9800",
    borderRadius: "10px",
    width: { xs: 35, sm: 40 },
    height: { xs: 35, sm: 40 },
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    color: "white",
    // fontSize: "5px",
  },
};

export default AnalyticsCard;
