import React, { useState } from "react";
import { Box, Button, IconButton, Switch, Typography } from "@mui/material";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Delete, Edit, RemoveRedEye } from "@mui/icons-material";
import AddAstrologerModal from "./AddAstrologerModal";
import DeleteConfirmationModal from "../DeleteConfirmationModal";
import { toast } from "react-toastify";
import api from "../../utils/api";
import EditAstrologerModal from "./EditAstrologerModal";

const AstrologersTableView = ({ astrologers }) => {
  const navigate = useNavigate();

  const location = useLocation();
  const [modalOpen, setModalOpen] = useState(false);
  const [openModal, setOpenModal] = useState(false);
  const [selectedAstrologerId, setSelectedAstrologerId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false); // ✅ Track Edit Modal Open

  const isDashboard = location.pathname === "/dashboard";

  const handleDelete = async () => {
    if (!selectedAstrologerId) {
      toast.error("No Astrologer selected for deletion!");
      return;
    }
    setLoading(true); // Start loading spinner

    try {
      const response = await api.post(
        "/super_admin/backend/delete_astrologer",
        { astrologerId: selectedAstrologerId }, // ✅ Sending data directly in body
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (response.status === 200) {
        toast.success("Astrologer deleted successfully!", {
          position: "top-center",
          autoClose: 3000,
        });
        setOpenModal(false);
        window.location.reload();
      }
    } catch (error) {
      console.error("❌ Delete Error:", error);
      toast.error(error.msg || "Error deleting astrologer.", {
        position: "top-center",
        autoClose: 3000,
      });
      setOpenModal(false);
    } finally {
      setLoading(false); // Stop loading spinner after API response
    }
  };

  const [activeStates, setActiveStates] = useState(() => {
    return astrologers.reduce((acc, astrologer) => {
      acc[astrologer._id] = astrologer.is_active ?? false; // ✅ Using `_id` as key
      return acc;
    }, {});
  });

  const handleToggleActive = (id) => {
    setActiveStates((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const filteredAstrologers =
    location.pathname === "/dashboard"
      ? astrologers.filter((astro) => astro.is_active) // ✅ Only Active Astrologers
      : astrologers;

  const rows = filteredAstrologers.map((astrologer) => ({
    id: astrologer._id,
    name: astrologer.name || "-",
    email: astrologer.email || "-",
    city: astrologer.city || "-",
    phone: astrologer.phone || "-",
    current_balance: astrologer.current_balance || "-",
    is_active: astrologer.is_active || false,
  }));

  const columns = [
    {
      field: "name",
      headerName: "Name",
      flex: 1,
      align: "center",
      headerAlign: "center",
    },
    {
      field: "email",
      headerName: "Email",
      flex: 1,
      align: "center",
      headerAlign: "center",
    },
    {
      field: "city",
      headerName: "City",
      flex: 1,
      align: "center",
      headerAlign: "center",
    },
    {
      field: "phone",
      headerName: "Phone",
      flex: 1,
      align: "center",
      headerAlign: "center",
    },
    // {
    //   field: "active",
    //   headerName: "Active",
    //   flex: 0.5,
    //   align: "center",
    //   headerAlign: "center",
    //   renderCell: (params) => (
    //     <Switch
    //       checked={Boolean(activeStates[params.row.id])} // Ensures true/false, never undefined
    //       onChange={() => handleToggleActive(params.row.id)}
    //       sx={{
    //         "& .MuiSwitch-switchBase.Mui-checked": {
    //           color: "#ff9800", // Orange color when checked
    //         },
    //         "& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track": {
    //           backgroundColor: "#ff9800", // Track color when checked
    //         },
    //       }}
    //     />
    //   ),
    // },

    {
      field: "current_balance",
      headerName: "Current Balance",
      flex: 1,
      align: "center",
      headerAlign: "center",
    },
  ];

  if (!isDashboard) {
    columns.push({
      field: "actions",
      headerName: "Action",
      width: 200,
      align: "center",
      headerAlign: "center",
      renderCell: (params) => (
        <Box sx={{ display: "flex", justifyContent: "center", width: "100%" }}>
          <Link to={`/astrologer-view/${params.row.id}`}>
            <IconButton size="small" sx={{ color: "#ff9800" }}>
              <RemoveRedEye />
            </IconButton>
          </Link>

          <IconButton
            size="small"
            sx={{ color: "#ff9800" }}
            onClick={() => {
              setSelectedAstrologerId(params.row.id); // Store the astrologer ID
              setOpenModal(true); // Open confirmation modal
            }}
          >
            <Delete />
          </IconButton>
          <IconButton
            size="small"
            sx={{ color: "#ff9800" }}
            onClick={() => {
              setSelectedAstrologerId(params.row.id); // ✅ Store astrologer ID
              setEditModalOpen(true); // ✅ Open edit modal
            }}
          >
            <Edit />
          </IconButton>
        </Box>
      ),
    });
  }

  return (
    <Box sx={{ padding: "20px" }}>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "20px",
        }}
      >
        <Typography variant="h6" sx={{ fontWeight: "bold" }}>
          {location.pathname === "/dashboard"
            ? "Active Astrologers"
            : "Astrologers"}
        </Typography>

        {location.pathname !== "/dashboard" && (
          <Button
            variant="contained"
            sx={{ color: "white", backgroundColor: "#ff9800" }}
            onClick={() => setModalOpen(true)}
          >
            Add Astrologers
          </Button>
        )}
      </Box>
      <Box
        sx={{
          borderRadius: "10px",
          boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)",
          overflow: "hidden",
          backgroundColor: "#FEF2E7",
        }}
      >
        <DataGrid
          rows={rows}
          columns={columns}
          initialState={{ pagination: { paginationModel: { pageSize: 10 } } }}
          slots={{ toolbar: GridToolbar }}
          slotProps={{
            toolbar: {
              showQuickFilter: true,
              quickFilterProps: { debounceMs: 1000 },
            },
          }}
          pageSizeOptions={[10]}
          autoHeight
          disableRowSelectionOnClick
          disableColumnFilter
          disableDensitySelector
          disableColumnSelector
          sx={{
            "& .MuiDataGrid-root": {
              textAlign: "center",
            },
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

      <AddAstrologerModal
        open={modalOpen}
        handleClose={() => setModalOpen(false)}
      />

      <DeleteConfirmationModal
        open={openModal}
        handleClose={() => setOpenModal(false)}
        handleConfirm={handleDelete}
        title="Delete Astrologer"
        message="Are you sure you want to delete this Astrologer? This action cannot be undone."
        loading={loading} // ✅ Pass loading state to modal
      />
      <EditAstrologerModal
        open={editModalOpen} // ✅ Controls modal visibility
        handleClose={() => setEditModalOpen(false)} // ✅ Close modal function
        astrologerId={selectedAstrologerId} // ✅ Pass astrologer ID to the modal
      />
    </Box>
  );
};

export default AstrologersTableView;
