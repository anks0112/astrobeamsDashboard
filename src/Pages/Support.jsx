import React, { useMemo, useState, useCallback } from "react";
import { useQuery } from "@tanstack/react-query";
import api from "../utils/api";
import {
  Box,
  Paper,
  Chip,
  CircularProgress,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  TextField,
  Button,
} from "@mui/material";
import { useNavigate } from "react-router";

// ---- data fetch (logic unchanged) ----
const fetchTickets = async () => {
  const { data } = await api.get(`super_admin/backend/fetch_support_ticket`);
  return Array.isArray(data?.data) ? data.data : [data?.data].filter(Boolean);
};

// ---- small helpers (no logic change) ----
const ellipsisSx = {
  maxWidth: 300,
  whiteSpace: "nowrap",
  overflow: "hidden",
  textOverflow: "ellipsis",
};

const formatDate = (iso) =>
  iso
    ? new Date(iso).toLocaleString("en-IN", {
        year: "numeric",
        month: "short",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
      })
    : "-";

const getStatusMeta = (statusRaw) => {
  const status = (statusRaw || "").toLowerCase();
  const isOpen = status === "open";
  return {
    label: status || "-",
    sx: {
      textTransform: "lowercase",
      bgcolor: isOpen ? "success.light" : "error.light",
      color: isOpen ? "success.dark" : "error.dark",
      fontWeight: 600,
    },
  };
};

const Support = () => {
  const {
    data: tickets,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["tickets"],
    queryFn: fetchTickets,
  });

  const navigate = useNavigate();

  // ---- search by user name ----
  const [query, setQuery] = useState("");
  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return tickets ?? [];
    return (tickets ?? []).filter((t) =>
      (t?.user_details?.name || "").toLowerCase().includes(q)
    );
  }, [tickets, query]);

  // ---- view action ----
  const handleView = useCallback((id) => {
    navigate(`/support-ticket/${id}`);
  }, []);

  if (isLoading) {
    return (
      <Box sx={{ p: 3, display: "flex", justifyContent: "center" }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ p: 3 }}>
        <Typography color="error">Failed to load tickets.</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 1, mt: 2 }}>
      <Box sx={{ mb: 2 }}>
        <Typography variant="h6" sx={{ my: 2, fontWeight: "bold" }}>
          Support Tickets
        </Typography>
        <TextField
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          size="small"
          fullWidth
          placeholder="Search by user name…"
        />
      </Box>

      <TableContainer
        component={Paper}
        sx={{ bgcolor: "#FEF2E7", paddingY: 5 }}
      >
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell>User Name</TableCell>
              <TableCell>Phone</TableCell>
              <TableCell>Description</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Created At</TableCell>
              <TableCell align="center">Actions</TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {filtered.map((t) => {
              const { label, sx } = getStatusMeta(t?.status);
              return (
                <TableRow key={t?._id}>
                  <TableCell>{t?.user_details?.name || "-"}</TableCell>
                  <TableCell>{t?.user_details?.phone || "-"}</TableCell>
                  <TableCell>
                    <Box sx={ellipsisSx} title={t?.description}>
                      {t?.description || "-"}
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Chip size="small" label={label} sx={sx} />
                  </TableCell>
                  <TableCell>{formatDate(t?.createdAt)}</TableCell>
                  <TableCell align="center">
                    <Button
                      variant="outlined"
                      size="small"
                      onClick={() => handleView(t?._id)}
                    >
                      View
                    </Button>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
        {filtered.length === 0 && (
          <Box
            sx={{
              p: 2,
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Typography color="text.secondary">No tickets found.</Typography>
          </Box>
        )}
      </TableContainer>
    </Box>
  );
};

export default Support;
