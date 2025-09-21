import React from "react";
import { Box, Typography, Chip } from "@mui/material";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";

const AstrologerSessionsTable = ({ sessions }) => {
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

  const rows = sessions?.map((session) => ({
    id: session._id,
    customerName: session.customerName,
    startTime: session.startTime,
    endTime: session.endTime,
    cost: session.cost,
    service: session.service,
    status: session.status,
    commission: session.commission,
  }));

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
          rows={rows}
          columns={columns}
          initialState={{
            pagination: { paginationModel: { pageSize: 10 } },
            sorting: {
              sortModel: [{ field: "startTime", sort: "desc" }], // ✅ newest first
            },
          }}
          slotProps={{
            toolbar: {
              showQuickFilter: true,
              quickFilterProps: { debounceMs: 1000 },
            },
          }}
          pageSizeOptions={[10]}
          disableRowSelectionOnClick
          disableColumnFilter
          disableDensitySelector
          disableColumnSelector
          rowHeight={60}
          slots={{ noRowsOverlay: NoRowsOverlay, toolbar: GridToolbar }}
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
            "& .MuiDataGrid-toolbarContainer": {
              flexDirection: "row-reverse",
              margin: "10px",
            },
          }}
        />
      </Box>
    </Box>
  );
};

export default AstrologerSessionsTable;
