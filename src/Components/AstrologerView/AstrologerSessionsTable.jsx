import React, { useState, useMemo } from "react";
import { Box, Typography, Chip, Button, Stack } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";

const AstrologerSessionsTable = ({ sessions }) => {
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [filteredRows, setFilteredRows] = useState(sessions || []);

  const columns = [
    {
      field: "customerName",
      headerName: "Customer Name",
      flex: 1.5,
      minWidth: 150,
      align: "center",
      headerAlign: "center",
    },
    {
      field: "startTime",
      headerName: "Start Time",
      flex: 1,
      minWidth: 150,
      align: "center",
      headerAlign: "center",
      renderCell: (params) => new Date(params.value).toLocaleString("en-GB"),
    },
    {
      field: "endTime",
      headerName: "End Time",
      flex: 1,
      minWidth: 150,
      align: "center",
      headerAlign: "center",
      renderCell: (params) =>
        params.value ? new Date(params.value).toLocaleString("en-GB") : "-",
    },
    {
      field: "cost",
      headerName: "Cost",
      flex: 1,
      minWidth: 100,
      align: "center",
      headerAlign: "center",
    },
    {
      field: "service",
      headerName: "Service",
      flex: 1,
      minWidth: 120,
      align: "center",
      headerAlign: "center",
    },
    {
      field: "createdAt",
      headerName: "Created On",
      flex: 1,
      minWidth: 120,
      align: "center",
      headerAlign: "center",
      renderCell: (params) =>
        new Date(params.value).toLocaleDateString("en-GB"),
    },
    {
      field: "status",
      headerName: "Status",
      flex: 1,
      minWidth: 120,
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
      field: "commission",
      headerName: "Commission",
      flex: 1,
      minWidth: 100,
      align: "center",
      headerAlign: "center",
    },
  ];

  const rows = useMemo(
    () =>
      sessions?.map((session) => ({
        ...session, // keep all original fields including _id
        customerName: session.customerName,
      })) || [],
    [sessions]
  );

  const handleFilter = () => {
    if (!startDate && !endDate) {
      setFilteredRows(rows);
      return;
    }

    const start = startDate ? new Date(startDate).setHours(0, 0, 0, 0) : null;
    const end = endDate ? new Date(endDate).setHours(23, 59, 59, 999) : null;

    const filtered = rows.filter((row) => {
      const created = new Date(row.createdAt).getTime();
      if (start && created < start) return false;
      if (end && created > end) return false;
      return true;
    });

    setFilteredRows(filtered);
  };

  const handleClear = () => {
    setStartDate(null);
    setEndDate(null);
    setFilteredRows(rows);
  };

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
          <Button variant="contained" color="primary" onClick={handleFilter}>
            Apply Filter
          </Button>
          <Button variant="outlined" color="secondary" onClick={handleClear}>
            Clear
          </Button>
        </Stack>
      </Stack>
    </LocalizationProvider>
  );

  const NoRowsOverlay = () => (
    <Box
      sx={{
        display: "flex",
        height: "100%",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Typography variant="h5" sx={{ color: "gray", fontWeight: "bold" }}>
        No Data Available
      </Typography>
    </Box>
  );

  return (
    <Box sx={{ padding: "20px" }}>
      <Typography variant="h6" sx={{ fontWeight: "bold", mb: 2 }}>
        Astrologer Sessions
      </Typography>

      <Box
        sx={{
          borderRadius: "10px",
          boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)",
          backgroundColor: "#FEF2E7",
          overflow: "hidden",
        }}
      >
        <DataGrid
          getRowId={(row) => row._id} // 👈 Add this line
          rows={filteredRows}
          columns={columns}
          initialState={{
            pagination: { paginationModel: { pageSize: 10 } },
            sorting: { sortModel: [{ field: "startTime", sort: "desc" }] },
          }}
          pageSizeOptions={[10]}
          disableRowSelectionOnClick
          disableColumnFilter
          disableDensitySelector
          disableColumnSelector
          rowHeight={60}
          slots={{
            toolbar: CustomToolbar,
            noRowsOverlay: NoRowsOverlay,
          }}
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
    </Box>
  );
};

export default AstrologerSessionsTable;
