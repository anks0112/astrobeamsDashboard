import { Box, Typography, Chip, Stack, IconButton } from "@mui/material";
import {
  DataGrid,
  GridToolbar,
  GridToolbarQuickFilter,
} from "@mui/x-data-grid";
import { useLocation } from "react-router";
import ExportToExcelButton from "../../utils/exports/ExportToExcelButton";
import { useState } from "react";
import DeleteConfirmationModal from "../DeleteConfirmationModal";
import api from "../../utils/api";
import { Delete } from "@mui/icons-material";
import { toast } from "react-toastify";

const CustomToolbar = () => (
  <Box
    sx={{
      display: "flex",
      justifyContent: "flex-start",
      alignItems: "center",
      padding: "10px",
    }}
  >
    <GridToolbarQuickFilter
      variant="outlined"
      placeholder="Search…"
      debounceMs={1000}
      sx={{ width: { xs: "100%", sm: "250px" } }}
    />
  </Box>
);

const UsersTableView = ({ users }) => {
  const location = useLocation();
  const isDashboard = location.pathname === "/dashboard";
  const safePhone = (phone) => (phone ? `'${phone}'` : "");

  const [openModal, setOpenModal] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleDelete = async () => {
    if (!selectedUserId) return toast.error("No user selected!");
    setLoading(true);
    try {
      const res = await api.delete("/super_admin/backend/delete_customer", {
        data: { _id: selectedUserId },
      });
      if (res.status === 200 || res.data.success) {
        toast.success("User deleted successfully!");
        setTimeout(() => {
          window.location.reload();
        }, 2000);
      } else {
        toast.error(res.data.msg || "Failed to delete user.");
      }
    } catch (err) {
      console.error(err);
      toast.error("Error deleting user. Try again later.");
    } finally {
      setLoading(false);
      setOpenModal(false);
    }
  };

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
    {
      field: "actions",
      headerName: "Action",
      width: 100,
      align: "center",
      headerAlign: "center",
      renderCell: (params) => (
        <IconButton
          size="small"
          sx={{ color: "#ff9800" }}
          onClick={() => {
            setSelectedUserId(params.row.id);
            setOpenModal(true);
          }}
        >
          <Delete />
        </IconButton>
      ),
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
      <Stack
        justifyContent={"space-between"}
        alignItems={"center"}
        flexDirection={"row"}
      >
        <Typography variant="h6" sx={{ fontWeight: "bold", mb: 2 }}>
          {isDashboard ? "New Users" : "Users List"}
        </Typography>
        {!isDashboard && (
          <Box sx={{ display: "flex", justifyContent: "flex-end", mb: 1 }}>
            <ExportToExcelButton rows={rows} columns={columns} />
          </Box>
        )}
      </Stack>

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
          pageSizeOptions={[10]}
          disableRowSelectionOnClick
          disableColumnFilter
          disableDensitySelector
          disableColumnSelector
          slots={{
            noRowsOverlay: NoRowsOverlay,
            toolbar: CustomToolbar, // ✅ our custom toolbar with only search
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
      <DeleteConfirmationModal
        open={openModal}
        handleClose={() => setOpenModal(false)}
        handleConfirm={handleDelete}
        title="Delete User"
        message="Are you sure you want to delete this user? This action cannot be undone."
        loading={loading}
      />
    </Box>
  );
};

export default UsersTableView;
