import React, { useState } from "react";
import { Box, Button, Stack, Typography } from "@mui/material";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import AddBannerModal from "./AddBannerModal";

const BannersTableView = ({ banners }) => {
  const [bannerOpen, setBannerOpen] = useState(false);

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
  ];

  const rows =
    banners?.map((banner) => ({
      id: banner._id,
      section: banner.section,
      photos: banner.photos,
      createdAt: banner.createdAt,
      updatedAt: banner.updatedAt,
    })) || [];

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
    </Box>
  );
};

export default BannersTableView;
