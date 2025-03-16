import React from "react";
import { Box, Typography, Chip } from "@mui/material";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import { useLocation } from "react-router";

const UsersTableView = ({ users }) => {
  const location = useLocation();
  const isDashboard = location.pathname === "/dashboard";

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
      field: "name",
      headerName: "Name",
      flex: 1.5,
      minWidth: 150,
      align: "center",
      headerAlign: "center",
    },
    {
      field: "phone",
      headerName: "Phone",
      flex: 1,
      minWidth: 150,
      align: "center",
      headerAlign: "center",
    },
    {
      field: "email",
      headerName: "Email",
      flex: 1.5,
      minWidth: 200,
      align: "center",
      headerAlign: "center",
      renderCell: (params) => params.value || "N/A",
    },
    {
      field: "gender",
      headerName: "Gender",
      flex: 1,
      minWidth: 100,
      align: "center",
      headerAlign: "center",
      renderCell: (params) => params.value || "N/A",
    },
    {
      field: "dob",
      headerName: "Date of Birth",
      flex: 1.5,
      minWidth: 150,
      align: "center",
      headerAlign: "center",
      renderCell: (params) =>
        params.value
          ? new Date(params.value).toLocaleDateString("en-GB")
          : "N/A",
    },
    {
      field: "balance",
      headerName: "Balance",
      flex: 1,
      minWidth: 100,
      align: "center",
      headerAlign: "center",
      renderCell: (params) => params.value || "0",
    },
    {
      field: "createdAt",
      headerName: "Joined On",
      flex: 1.5,
      minWidth: 150,
      align: "center",
      headerAlign: "center",
      renderCell: (params) =>
        params.value
          ? new Date(params.value).toLocaleDateString("en-GB")
          : "N/A",
    },
  ];

  const sortedUsers = [...(users || [])]
    .filter((user) => user.createdAt) // Remove users without a valid createdAt date
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

  const rows = (isDashboard ? sortedUsers.slice(0, 5) : sortedUsers).map(
    (user) => ({
      id: user._id,
      name: user.name || "N/A",
      phone: user.phone || "N/A",
      email: user.email || "N/A",
      gender: user.gender || "N/A",
      dob: user.dob || null,
      balance: user.balance || "0",
      createdAt: user.createdAt || null,
    })
  );

  return (
    <Box sx={{ padding: "20px" }}>
      <Typography variant="h6" sx={{ fontWeight: "bold", mb: 2 }}>
        {isDashboard ? "New Users" : "Users List"}
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
          // rowHeight={60}
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

export default UsersTableView;
