import React, { useState, useEffect, useMemo, useCallback } from "react";
import {
  Box,
  Typography,
  Chip,
  Stack,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Rating,
  Button,
} from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import EditIcon from "@mui/icons-material/Edit";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import axios from "axios";
import api from "../../utils/api";
import { toast } from "react-toastify";

const AstrologerSessionsTable = ({ sessions = [] }) => {
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [rows, setRows] = useState([]);
  const [filteredRows, setFilteredRows] = useState([]);
  const [openModal, setOpenModal] = useState(false);
  const [selectedRow, setSelectedRow] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [reviewText, setReviewText] = useState("");
  const [ratingValue, setRatingValue] = useState(0);

  // ✅ Initialize once when sessions arrive
  useEffect(() => {
    const mapped = sessions.map((s) => ({ ...s, id: s._id }));
    setRows(mapped);
    setFilteredRows(mapped);
  }, [sessions]);

  // ✅ Modal open function (memoized)
  const handleOpenModal = useCallback((row) => {
    setSelectedRow(row);
    setReviewText(row.review || "");
    setRatingValue(row.rating || 0);
    setEditMode(false);
    setOpenModal(true);
  }, []);

  const handleSubmitReview = async () => {
    try {
      await api.patch("/super_admin/backend/update_interaction_review", {
        interactionId: selectedRow._id,
        review: reviewText,
        rating: ratingValue,
      });
      setEditMode(false);
      toast.success("Review updated successfully!");
      setTimeout(() => {
        window.location.reload();
      }, 2000);
    } catch (error) {
      console.error(error);
      alert("Failed to update review.");
    }
  };

  const columns = useMemo(
    () => [
      {
        field: "customerName",
        headerName: "Customer Name",
        flex: 1.5,
        align: "center",
        headerAlign: "center",
      },
      {
        field: "startTime",
        headerName: "Start Time",
        flex: 1,
        align: "center",
        headerAlign: "center",
        renderCell: (params) => new Date(params.value).toLocaleString("en-GB"),
      },
      {
        field: "endTime",
        headerName: "End Time",
        flex: 1,
        align: "center",
        headerAlign: "center",
        renderCell: (params) =>
          params.value ? new Date(params.value).toLocaleString("en-GB") : "-",
      },
      {
        field: "cost",
        headerName: "Cost",
        flex: 1,
        align: "center",
        headerAlign: "center",
      },
      {
        field: "service",
        headerName: "Service",
        flex: 1,
        align: "center",
        headerAlign: "center",
      },
      {
        field: "createdAt",
        headerName: "Created On",
        flex: 1,
        align: "center",
        headerAlign: "center",
        renderCell: (params) =>
          new Date(params.value).toLocaleDateString("en-GB"),
      },
      {
        field: "status",
        headerName: "Status",
        flex: 1,
        align: "center",
        headerAlign: "center",
        renderCell: (params) => (
          <Chip
            label={params.value}
            color={
              params.value === "Completed"
                ? "success"
                : params.value === "Missed"
                ? "error"
                : "warning"
            }
            variant="outlined"
          />
        ),
      },
      {
        field: "edit",
        headerName: "Review",
        flex: 0.7,
        align: "center",
        headerAlign: "center",
        renderCell: (params) => (
          <IconButton
            color="primary"
            onClick={() => handleOpenModal(params.row)}
          >
            <EditIcon />
          </IconButton>
        ),
      },
    ],
    [handleOpenModal]
  );

  // ✅ Filter only when "Apply" is clicked
  const handleFilter = useCallback(() => {
    if (!startDate && !endDate) return setFilteredRows(rows);
    const start = startDate ? new Date(startDate).setHours(0, 0, 0, 0) : null;
    const end = endDate ? new Date(endDate).setHours(23, 59, 59, 999) : null;
    setFilteredRows(
      rows.filter((row) => {
        const created = new Date(row.createdAt).getTime();
        if (start && created < start) return false;
        if (end && created > end) return false;
        return true;
      })
    );
  }, [rows, startDate, endDate]);

  const handleClear = useCallback(() => {
    setStartDate(null);
    setEndDate(null);
    setFilteredRows(rows);
  }, [rows]);

  const CustomToolbar = () => (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <Stack
        direction={{ xs: "column", sm: "row" }}
        spacing={2}
        sx={{
          p: 2,
          backgroundColor: "#fff8f2",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
          Filter by Date Range
        </Typography>
        <Stack direction="row" spacing={2} alignItems="center">
          <DatePicker
            label="Start Date"
            value={startDate}
            onChange={(newValue) => setStartDate(newValue)}
            slotProps={{ textField: { size: "small" } }}
          />
          <DatePicker
            label="End Date"
            value={endDate}
            onChange={(newValue) => setEndDate(newValue)}
            slotProps={{ textField: { size: "small" } }}
          />
          <Button variant="contained" onClick={handleFilter}>
            Apply
          </Button>
          <Button variant="outlined" color="secondary" onClick={handleClear}>
            Clear
          </Button>
        </Stack>
      </Stack>
    </LocalizationProvider>
  );

  // --- Modal
  const ReviewModal = (
    <Dialog open={openModal} onClose={() => setOpenModal(false)} fullWidth>
      <DialogTitle>Review & Rating</DialogTitle>
      <DialogContent dividers>
        {selectedRow && (
          <Stack spacing={2} sx={{ mt: 1 }}>
            <Typography variant="subtitle2">Rating:</Typography>
            {editMode ? (
              <Rating
                value={ratingValue}
                onChange={(e, newValue) => setRatingValue(newValue)}
              />
            ) : (
              <Rating value={ratingValue} readOnly />
            )}

            <Typography variant="subtitle2">Review:</Typography>
            {editMode ? (
              <textarea
                style={{
                  width: "100%",
                  minHeight: 80,
                  padding: 8,
                  borderRadius: 6,
                  border: "1px solid #ccc",
                  fontFamily: "inherit",
                }}
                value={reviewText}
                onChange={(e) => setReviewText(e.target.value)}
              />
            ) : (
              <Typography variant="body1" sx={{ whiteSpace: "pre-line" }}>
                {reviewText || "No review available."}
              </Typography>
            )}

            <Typography variant="caption" sx={{ color: "gray" }}>
              Created On:{" "}
              {new Date(selectedRow.createdAt).toLocaleDateString("en-GB")}
            </Typography>
          </Stack>
        )}
      </DialogContent>
      <DialogActions>
        {editMode ? (
          <>
            <Button onClick={() => setEditMode(false)}>Cancel</Button>
            <Button variant="contained" onClick={handleSubmitReview}>
              Save
            </Button>
          </>
        ) : (
          <>
            <Button onClick={() => setOpenModal(false)}>Close</Button>
            <Button variant="outlined" onClick={() => setEditMode(true)}>
              Edit Review
            </Button>
          </>
        )}
      </DialogActions>
    </Dialog>
  );

  return (
    <Box sx={{ padding: "20px" }}>
      <Typography variant="h6" sx={{ fontWeight: "bold", mb: 2 }}>
        Astrologer Sessions
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
          rows={filteredRows}
          columns={columns}
          getRowId={(row) => row._id}
          initialState={{
            pagination: { paginationModel: { pageSize: 10 } },
            sorting: { sortModel: [{ field: "startTime", sort: "desc" }] },
          }}
          pageSizeOptions={[10]}
          disableRowSelectionOnClick
          disableColumnFilter
          disableDensitySelector
          disableColumnSelector
          slots={{ toolbar: CustomToolbar }}
          rowHeight={60}
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

export default AstrologerSessionsTable;
