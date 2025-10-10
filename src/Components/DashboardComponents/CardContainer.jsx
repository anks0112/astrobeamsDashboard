import React from "react";
import { Box } from "@mui/material";
import AnalyticsCard from "./AnalyticsCard";
import {
  TrendingUp,
  TrendingDown,
  People,
  Loop,
  Insights,
  BarChart,
} from "@mui/icons-material";

const CardContainer = ({ stats }) => {
  if (!stats) return null;

  const {
    DAU,
    MAU,
    retention_rate,
    churn_rate_percent,
    user_growth_rate_percent,
  } = stats;

  const growthPositive = parseFloat(user_growth_rate_percent) >= 0;

  const cardData = [
    {
      title: "Active Users Today",
      description: "Number of users who used the app today",
      value: `${DAU} people`,
      icon: <People fontSize="large" color="primary" />,
    },
    {
      title: "Active Users This Month",
      description: "Total unique users in the last 30 days",
      value: `${MAU} people`,
      icon: <BarChart fontSize="large" color="primary" />,
    },
    {
      title: "User Growth Rate",
      description: "Change in number of users compared to previous month",
      value: `${user_growth_rate_percent}%`,
      icon: growthPositive ? (
        <TrendingUp fontSize="large" color="success" />
      ) : (
        <TrendingDown fontSize="large" color="error" />
      ),
    },
    {
      title: "Churn Rate",
      description: "Percentage of users who stopped using the app",
      value: `${churn_rate_percent}%`,
      icon: <Insights fontSize="large" color="warning" />,
    },
    {
      title: "Retention Rate (1 Day)",
      description: "Users who came back after 1 day",
      value: `${retention_rate?.["1_day"]}%`,
      icon: <Loop fontSize="large" color="secondary" />,
    },
    {
      title: "Retention Rate (7 Days)",
      description: "Users who stayed active for a week",
      value: `${retention_rate?.["7_day"]}%`,
      icon: <Loop fontSize="large" color="secondary" />,
    },
    {
      title: "Retention Rate (30 Days)",
      description: "Users who stayed active for a month",
      value: `${retention_rate?.["30_day"]}%`,
      icon: <Loop fontSize="large" color="secondary" />,
    },
  ];

  return (
    <Box sx={styles.container}>
      {cardData.map((card, index) => (
        <AnalyticsCard
          key={index}
          title={card.title}
          subtitle={card.description}
          value={card.value}
          icon={card.icon}
        />
      ))}
    </Box>
  );
};

const styles = {
  container: {
    display: "grid",
    gridTemplateColumns: { xs: "1fr", md: "repeat(3, 1fr)" },
    gap: "20px",
    padding: "20px",
  },
};

export default CardContainer;
