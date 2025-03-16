import React from "react";
import { Box } from "@mui/material";
import AnalyticsCard from "./AnalyticsCard";
import { ShoppingCart, Storefront, ListAlt, People } from "@mui/icons-material";

const CardContainer = () => {
  const cardData = [
    {
      title: "Total Users",
      value: "2,300",
      change: "+5%",
      icon: <People fontSize="large" />,
    },
    {
      title: "Total Astrologers",
      value: "3,052",
      change: "-14%",
      icon: <Storefront fontSize="large" />,
    },
    {
      title: "Month's Earning",
      value: "53,000",
      change: "+55%",
      icon: <ListAlt fontSize="large" />,
    },
    {
      title: "Total Orders",
      value: "173,000",
      change: "+8%",
      icon: <ShoppingCart fontSize="large" />,
    },
  ];

  return (
    <Box sx={styles.container}>
      {cardData.map((card, index) => (
        <AnalyticsCard
          key={index}
          title={card.title}
          value={card.value}
          change={card.change}
          icon={card.icon}
        />
      ))}
    </Box>
  );
};

// Styles
const styles = {
  container: {
    display: "grid",
    gridTemplateColumns: { xs: "1fr", md: "repeat(4, 1fr)" },
    gap: "20px",
    padding: "20px",
  },
};

export default CardContainer;
