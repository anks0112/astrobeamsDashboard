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
  TablePagination,
} from "@mui/material";
import { useNavigate } from "react-router";

// ---- data fetch ----
const fetchTickets = async () => {
  const { data } = await api.get(`super_admin/backend/fetch_support_ticket`);
  return Array.isArray(data?.data) ? data.data : [data?.data].filter(Boolean);
};

// ---- helpers ----
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

  // ---- search ----
  const [query, setQuery] = useState("");

  // ✅ Pagination states
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  // ✅ Sort by latest first, then filter by query
  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    const sorted = (tickets ?? []).slice().sort((a, b) => {
      const dateA = new Date(a?.createdAt || 0);
      const dateB = new Date(b?.createdAt || 0);
      return dateB - dateA; // latest first
    });
    if (!q) return sorted;
    return sorted.filter((t) =>
      (t?.user_details?.name || "").toLowerCase().includes(q)
    );
  }, [tickets, query]);

  // ✅ Pagination slice
  const paginated = useMemo(() => {
    const start = page * rowsPerPage;
    return filtered.slice(start, start + rowsPerPage);
  }, [filtered, page, rowsPerPage]);

  const handleView = useCallback(
    (id) => {
      navigate(`/support-ticket/${id}`);
    },
    [navigate]
  );

  const handleChangePage = (_, newPage) => setPage(newPage);
  const handleChangeRowsPerPage = (e) => {
    setRowsPerPage(parseInt(e.target.value, 10));
    setPage(0);
  };

  // ✅ Ticket status counts
  const totalCount = filtered.length;
  const openCount = filtered.filter(
    (t) => (t?.status || "").toLowerCase() === "open"
  ).length;
  const closedCount = filtered.filter(
    (t) => (t?.status || "").toLowerCase() === "closed"
  ).length;

  // ---- Loading / error states ----
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

  // ---- UI ----
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

      <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap", mt: 2, mb: 2 }}>
        <Chip
          label={`Total: ${totalCount}`}
          color="primary"
          variant="outlined"
          sx={{ fontWeight: 600 }}
        />
        <Chip
          label={`Open: ${openCount}`}
          color="success"
          variant="outlined"
          sx={{ fontWeight: 600 }}
        />
        <Chip
          label={`Closed: ${closedCount}`}
          color="error"
          variant="outlined"
          sx={{ fontWeight: 600 }}
        />
      </Box>

      <TableContainer
        component={Paper}
        sx={{
          bgcolor: "#FEF2E7",
          overflowX: "auto",
        }}
      >
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell>User Name</TableCell>
              <TableCell>User Type</TableCell>

              <TableCell>Phone</TableCell>
              <TableCell>Description</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Created At</TableCell>
              <TableCell align="center">Actions</TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {paginated.map((t) => {
              const { label, sx } = getStatusMeta(t?.status);
              return (
                <TableRow key={t?._id}>
                  <TableCell>{t?.user_details?.name || "-"}</TableCell>
                  <TableCell>{t?.user_type || "-"}</TableCell>

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

        {/* ✅ Empty state */}
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

        {/* ✅ Pagination */}
        <TablePagination
          component="div"
          count={filtered.length}
          page={page}
          onPageChange={handleChangePage}
          rowsPerPage={rowsPerPage}
          onRowsPerPageChange={handleChangeRowsPerPage}
          rowsPerPageOptions={[5, 10, 25]}
        />
      </TableContainer>
    </Box>
  );
};

export default Support;
