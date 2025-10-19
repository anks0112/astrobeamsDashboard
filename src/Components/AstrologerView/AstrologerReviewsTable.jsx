import React, { useState, useEffect, useMemo, useCallback } from "react";
import {
  Box,
  Typography,
  IconButton,
  Rating,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Stack,
} from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import EditIcon from "@mui/icons-material/Edit";
import axios from "axios";

// ✅ Component
const AstrologerReviewsTable = ({ sessions = [], refreshSessions }) => {
  const [rows, setRows] = useState([]);
  const [openModal, setOpenModal] = useState(false);
  const [selectedRow, setSelectedRow] = useState(null);
  const [editRating, setEditRating] = useState(0);
  const [editReviewText, setEditReviewText] = useState("");

  // 🔍 Filter sessions having review or rating
  useEffect(() => {
    const filtered = sessions.filter(
      (s) => s.rating || (s.review && s.review.trim() !== "")
    );
    const formatted = filtered.map((s) => ({
      id: s._id,
      interactionId: s._id,
      rating: s.rating || 0,
      review: s.review || "-",
      createdAt: s.createdAt,
    }));
    setRows(formatted);
  }, [sessions]);

  // ✏️ Handle edit
  const handleEditClick = useCallback((row) => {
    setSelectedRow(row);
    setEditRating(row.rating || 0);
    setEditReviewText(row.review || "");
    setOpenModal(true);
  }, []);

  const handleSaveEdit = async () => {
    try {
      await axios.patch("/super_admin/backend/update_interaction_review", {
        interactionId: selectedRow.interactionId,
        review: editReviewText,
        rating: editRating,
      });
      alert("Review updated successfully!");
      setOpenModal(false);
      refreshSessions?.(); // 🔁 optional re-fetch parent data
    } catch (error) {
      console.error(error);
      alert("Failed to update review.");
    }
  };

  // 🧱 Columns
  const columns = useMemo(
    () => [
      {
        field: "interactionId",
        headerName: "Interaction ID",
        flex: 1.6,
        align: "center",
        headerAlign: "center",
        renderCell: (params) => (
          <Typography
            sx={{
              fontSize: 13,
              color: "#444",
              wordBreak: "break-all",
              textAlign: "center",
            }}
          >
            {params.value}
          </Typography>
        ),
      },
      {
        field: "rating",
        headerName: "Rating",
        flex: 0.8,
        align: "center",
        headerAlign: "center",
        renderCell: (params) => (
          <Rating value={params.value || 0} size="small" readOnly />
        ),
      },
      {
        field: "review",
        headerName: "Review",
        flex: 2.2,
        align: "center",
        headerAlign: "center",
        renderCell: (params) => (
          <Typography
            sx={{
              fontSize: 13,
              color: "#333",
              whiteSpace: "pre-line",
              maxWidth: "90%",
            }}
          >
            {params.value || "-"}
          </Typography>
        ),
      },
      {
        field: "edit",
        headerName: "Edit",
        flex: 0.5,
        align: "center",
        headerAlign: "center",
        renderCell: (params) => (
          <IconButton
            color="primary"
            size="small"
            onClick={() => handleEditClick(params.row)}
          >
            <EditIcon fontSize="small" />
          </IconButton>
        ),
      },
    ],
    [handleEditClick]
  );

  // 🧾 Modal for edit
  const ReviewModal = (
    <Dialog open={openModal} onClose={() => setOpenModal(false)} fullWidth>
      <DialogTitle>Edit Review & Rating</DialogTitle>
      <DialogContent dividers>
        {selectedRow && (
          <Stack spacing={2} sx={{ mt: 1 }}>
            <Typography variant="subtitle2">Rating:</Typography>
            <Rating
              value={editRating}
              onChange={(e, newValue) => setEditRating(newValue)}
            />
            <Typography variant="subtitle2">Review:</Typography>
            <textarea
              style={{
                width: "100%",
                minHeight: 80,
                padding: 8,
                borderRadius: 6,
                border: "1px solid #ccc",
                fontFamily: "inherit",
              }}
              value={editReviewText}
              onChange={(e) => setEditReviewText(e.target.value)}
            />
          </Stack>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={() => setOpenModal(false)}>Cancel</Button>
        <Button variant="contained" onClick={handleSaveEdit}>
          Save
        </Button>
      </DialogActions>
    </Dialog>
  );

  // 🧩 Return Table
  return (
    <Box sx={{ mt: 3 }}>
      <Typography variant="h6" sx={{ fontWeight: "bold", mb: 2 }}>
        Reviews & Ratings
      </Typography>

      <Box
        sx={{
          borderRadius: "10px",
          boxShadow: "0px 4px 10px rgba(0,0,0,0.1)",
          backgroundColor: "#FEF2E7",
          overflow: "hidden",
        }}
      >
        <DataGrid
          rows={rows}
          columns={columns}
          initialState={{
            pagination: { paginationModel: { pageSize: 10 } },
            sorting: { sortModel: [{ field: "createdAt", sort: "desc" }] },
          }}
          pageSizeOptions={[10]}
          disableRowSelectionOnClick
          disableColumnFilter
          disableDensitySelector
          disableColumnSelector
          rowHeight={60}
          getRowId={(row) => row.id}
          sx={{
            "& .MuiDataGrid-columnHeader": {
              backgroundColor: "#FEF2E7",
              fontWeight: "bold",
              textAlign: "center",
            },
            "& .MuiDataGrid-cell": {
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              textAlign: "center",
            },
          }}
        />
      </Box>

      {ReviewModal}
    </Box>
  );
};

export default AstrologerReviewsTable;
