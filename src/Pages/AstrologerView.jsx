import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useParams } from "react-router";
import { Box, CircularProgress } from "@mui/material";

import AstrologerProfile from "../Components/AstrologerView/AstrologerProfile";
import AstrologerDetails from "../Components/AstrologerView/AstrologerDetails";
import AstrologerDocuments from "../Components/AstrologerView/AstrologerDocuments";
import AstrologerPricingStatus from "../Components/AstrologerView/AstrologerPricingStatus";
import AstrologerSessionsTable from "../Components/AstrologerView/AstrologerSessionsTable";
import AstrologerSessionStats from "../Components/AstrologerView/AstrologerSessionStats";
import api from "../utils/api";

const AstrologerView = () => {
  const { id } = useParams();
  const [sessions, setSessions] = useState([]);
  const [interactions, setInteractions] = useState({});
  const [loading, setLoading] = useState(true);
  const [intLoading, setIntLoading] = useState(true);

  const { astrologers } = useSelector((state) => state.allAstrologers);
  const astrologer = astrologers?.data?.find((a) => a._id === id);

  // Fetch astrologer sessions
  const fetchSessions = async () => {
    try {
      const response = await api.post(
        "/super_admin/backend/fetch_astrologer_orders",
        { astrologerId: id }
      );
      setSessions(response.data?.data || []);
    } catch (error) {
      console.error("Error fetching astrologer orders:", error);
    } finally {
      setLoading(false);
    }
  };

  // Fetch astrologer interaction summary
  const fetchInteractions = async () => {
    try {
      const response = await api.get(
        `/super_admin/backend/astrologer/interactions/summary/${id}`
      );
      setInteractions(response.data?.summary || {});
    } catch (error) {
      console.error("Error fetching astrologer interactions:", error);
    } finally {
      setIntLoading(false);
    }
  };

  useEffect(() => {
    fetchSessions();
    fetchInteractions();
  }, [id]);

  // Show loader while data is fetching
  if (loading || intLoading) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "60vh",
        }}
      >
        <CircularProgress color="warning" />
      </Box>
    );
  }

  // No astrologer or no interaction data
  if (!astrologer || !interactions) {
    return (
      <Typography
        variant="h6"
        sx={{ textAlign: "center", mt: 5, color: "gray" }}
      >
        No astrologer data available
      </Typography>
    );
  }

  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 3, mb: 3 }}>
      <AstrologerProfile astrologer={astrologer} />
      <AstrologerDetails astrologer={astrologer} />
      <AstrologerDocuments astrologer={astrologer} />
      <AstrologerPricingStatus astrologer={astrologer} />
      <AstrologerSessionStats data={interactions} />
      <AstrologerSessionsTable sessions={sessions} />
    </Box>
  );
};

export default AstrologerView;
