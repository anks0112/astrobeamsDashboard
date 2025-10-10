import React, { useState } from "react";
import { Box, Button, Stack, Typography, IconButton } from "@mui/material";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import AddBannerModal from "./AddBannerModal";
import { Link } from "react-router-dom";
import { RemoveRedEye, Delete, Edit } from "@mui/icons-material";
import api from "../../utils/api";
import { toast } from "react-toastify";
import DeleteConfirmationModal from "../DeleteConfirmationModal";
import EditBannerModal from "./EditBannerModal";

const BannersTableView = ({ banners }) => {
  const [bannerOpen, setBannerOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [selectedEditBannerId, setSelectedEditBannerId] = useState(null);

  const handleCreate = () => {
    console.log("create success");
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
      field: "section",
      headerName: "Section",
      flex: 1.5,
      minWidth: 150,
      align: "center",
      headerAlign: "center",
    },
    {
      field: "photos",
      headerName: "Banners",
      flex: 2,
      minWidth: 250,
      align: "center",
      headerAlign: "center",
      renderCell: (params) => (
        <Box sx={{ display: "flex", gap: 1, justifyContent: "center" }}>
          {params.value?.map((photo, index) => (
            <img
              key={index}
              src={photo}
              alt={`Banner ${index + 1}`}
              style={{
                width: "100px",
                height: "60px",
                objectFit: "cover",
                borderRadius: 5,
              }}
            />
          ))}
        </Box>
      ),
    },
    {
      field: "createdAt",
      headerName: "Created On",
      flex: 1.5,
      minWidth: 150,
      align: "center",
      headerAlign: "center",
      renderCell: (params) =>
        new Date(params.value).toLocaleDateString("en-GB"),
    },
    {
      field: "updatedAt",
      headerName: "Updated On",
      flex: 1.5,
      minWidth: 150,
      align: "center",
      headerAlign: "center",
      renderCell: (params) =>
        new Date(params.value).toLocaleDateString("en-GB"),
    },

    {
      field: "actions",
      headerName: "Action",
      width: 200,
      align: "center",
      headerAlign: "center",
      renderCell: (params) => (
        <Box sx={{ display: "flex", justifyContent: "center", width: "100%" }}>
          <IconButton
            size="small"
            sx={{ color: "#ff9800" }}
            onClick={() => {
              setSelectedEditBannerId(params.row.id);
              setEditModalOpen(true);
            }}
          >
            <Edit />
          </IconButton>
          <IconButton
            size="small"
            sx={{ color: "#ff9800" }}
            onClick={() => {
              setSelectedBannerId(params.row.id); // ✅ Set selected banner ID
              setOpenModal(true); // ✅ Open confirmation modal
            }}
          >
            <Delete />
          </IconButton>
        </Box>
      ),
    },
  ];

  const rows =
    banners?.map((banner) => ({
      id: banner._id,
      section: banner.section,
      photos: banner.photos,
      createdAt: banner.createdAt,
      updatedAt: banner.updatedAt,
    })) || [];

  const [openModal, setOpenModal] = useState(false);
  const [selectedBannerId, setSelectedBannerId] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleDelete = async () => {
    if (!selectedBannerId) {
      toast.error("No banner selected for deletion!");
      return;
    }
    setLoading(true);
    try {
      const response = await api.delete(
        `/super_admin/backend/delete_banner/${selectedBannerId}`
      );
      if (response.status === 200) {
        toast.success("Banner deleted successfully!");
        setOpenModal(false);
        window.location.reload(); // You may choose a better refresh method
      }
    } catch (error) {
      console.error("❌ Error deleting banner:", error);
      toast.error("Error deleting banner.");
      setOpenModal(false);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ padding: "20px" }}>
      <Stack direction="row" justifyContent="space-between" sx={{ mb: 2 }}>
        <Typography variant="h6" sx={{ fontWeight: "bold", mb: 2 }}>
          Banners List
        </Typography>
        <Button
          variant="contained"
          sx={{ color: "white", bgcolor: "#ff9800" }}
          onClick={() => setBannerOpen(true)}
        >
          Add Banner
        </Button>
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
          rowHeight={80}
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
      <AddBannerModal
        open={bannerOpen}
        handleClose={() => setBannerOpen(false)}
      />
      <EditBannerModal
        open={editModalOpen}
        handleClose={() => setEditModalOpen(false)}
        bannerId={selectedEditBannerId}
      />

      <DeleteConfirmationModal
        open={openModal}
        handleClose={() => setOpenModal(false)}
        handleConfirm={handleDelete}
        title="Delete Banner"
        message="Are you sure you want to delete this banner? This action cannot be undone."
        loading={loading}
      />
    </Box>
  );
};

export default BannersTableView;
