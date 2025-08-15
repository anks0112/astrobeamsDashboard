import React from "react";
import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import api from "../utils/api";
import ChatComponent from "../Components/support/ChatComponent";
import { Box, CircularProgress } from "@mui/material";
import TicketDetails from "../Components/support/TicketDetails";

const fetchTicket = async (id) => {
  if (!id) return null;
  const res = await api.get(
    `super_admin/backend/fetch_particular_support_ticket/${id}`
  );
  return res?.data?.data ?? null;
};

const SupportInner = () => {
  const { id } = useParams();

  const {
    data: ticket,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["ticket", id],
    queryFn: () => fetchTicket(id), // must be a function
    enabled: !!id, // wait until id exists
    onSuccess: (d) => console.log("ticket:", d),
    onError: (e) => console.error("ticket fetch error:", e),
  });

  //   console.log(ticket);
  const ticketDoc = Array.isArray(ticket) ? ticket[0] : ticket;
  const messages = ticketDoc?.messages ?? [];

  if (isLoading) {
    return (
      <Box sx={{ p: 3, display: "flex", justifyContent: "center" }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box
      sx={{
        height: "80vh",
        marginTop: { xs: 0, md: 5 },
        display: "flex",
        justifyContent: "space-between",

        flexDirection: { xs: "column", md: "row" },
      }}
    >
      <TicketDetails ticket={ticket} />
      <ChatComponent
        support_id={id}
        messages={messages}
        status={ticketDoc?.status}
      />
    </Box>
  );
};

export default SupportInner;
