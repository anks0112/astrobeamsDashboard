import React, { useEffect, useState } from "react";
import { Box, Button, IconButton, Stack, Typography } from "@mui/material";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import { RemoveRedEye, Edit, Delete } from "@mui/icons-material";
import BlogCreateForm from "./BlogCreateForm";
import { useLocation, useNavigate } from "react-router";
import DeleteConfirmationModal from "../DeleteConfirmationModal";
import { toast } from "react-toastify";
import api from "../../utils/api";
import BlogEditForm from "./BlogEditForm";

const BlogsTableView = ({ blogs }) => {
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [selectedBlogId, setSelectedBlogId] = useState(null);
  const [loading, setLoading] = useState(false);

  const [openModal, setOpenModal] = useState(false);

  const [editModalOpen, setEditModalOpen] = useState(false);

  const navigate = useNavigate();

  const handleEdit = (id) => {
    setSelectedBlogId(id); // ✅ Store Blog ID
    setEditModalOpen(true); // ✅ Open Modal
  };

  const location = useLocation();

  const handleView = (id) => {
    navigate(`/blog-inner/${id}`);
  };

  const handleDelete = (id) => {
    setSelectedBlogId(id);
    setDeleteModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!selectedBlogId) return;

    setLoading(true);
    try {
      await api.delete(`/super_admin/backend/delete_blog/${selectedBlogId}`);

      toast.success("Blog deleted successfully!", {
        position: "top-center",
        autoClose: 3000,
      });
      setTimeout(() => {
        window.location.reload();
      }, 3000);
    } catch (error) {
      toast.error(error.msg || "Failed to delete blog. Try again.", {
        position: "top-center",
        autoClose: 3000,
      });
    } finally {
      setLoading(false);
      setDeleteModalOpen(false);
      setSelectedBlogId(null); // Reset selected blog ID
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
      field: "title",
      headerName: "Title",
      flex: 1.5,
      minWidth: 100,
      align: "center",
      headerAlign: "center",
    },
    {
      field: "photo",
      headerName: "Photo",
      flex: 0.5, // Reduce flexibility to keep it compact
      minWidth: 250,
      align: "center",
      headerAlign: "center",
      renderCell: (params) => (
        <img
          src={params.value}
          alt="blog"
          style={{
            width: "150px", // Set a fixed width
            height: "auto", // Maintain aspect ratio
            maxHeight: "150px", // Prevent oversized images
            borderRadius: 5,
            objectFit: "cover", // Ensure the image is properly contained
          }}
        />
      ),
    },
    {
      field: "tags",
      headerName: "Tags",
      flex: 1.5,
      minWidth: 100,
      align: "center",
      headerAlign: "center",
      renderCell: (params) => {
        const displayedTags = params.value.slice(0, 2).join(", ");
        return params.value.length > 2
          ? `${displayedTags}, ...`
          : displayedTags;
      },
    },
    {
      field: "createdAt",
      headerName: "Created On",
      width: 150,
      align: "center",
      headerAlign: "center",
      renderCell: (params) =>
        new Date(params.value).toLocaleDateString("en-GB"),
    },
    {
      field: "actions",
      headerName: "Actions",
      width: 150,
      align: "center",
      headerAlign: "center",

      renderCell: (params) => (
        <Box sx={{ display: "flex", justifyContent: "center", gap: 1 }}>
          <IconButton
            color="primary"
            size="small"
            onClick={() => handleView(params.row.id)}
          >
            <RemoveRedEye />
          </IconButton>
          <IconButton
            color="secondary"
            size="small"
            onClick={() => handleEdit(params.row.id)}
          >
            <Edit />
          </IconButton>
          <IconButton
            color="error"
            size="small"
            onClick={() => handleDelete(params.row.id)}
          >
            <Delete />
          </IconButton>
        </Box>
      ),
    },
  ];

  const rows =
    blogs?.map((blog) => ({
      id: blog._id,
      title: blog.title,
      photo: blog.photo,
      tags: blog.tags,
      createdAt: blog.createdAt,
    })) || [];

  const renderHeader = (
    <Stack direction="row" justifyContent={"space-between"} sx={{ mb: 2 }}>
      <Typography
        variant="h6"
        sx={{ fontWeight: "bold", marginBottom: "20px" }}
      >
        Blogs List
      </Typography>
      <Button
        variant="contained"
        size="medium"
        sx={{ color: "whitesmoke", backgroundColor: "#ff9800" }}
        onClick={() => setOpenModal(true)}
      >
        Add Blog
      </Button>
    </Stack>
  );

  const renderBody = (
    <Box
      sx={{
        borderRadius: "10px",
        boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)",
        backgroundColor: "#fff",
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
        rowHeight={100}
        slots={{ noRowsOverlay: NoRowsOverlay, toolbar: GridToolbar }} // ✅ Fix: Attach Custom No Data Component
        sx={{
          "& .MuiDataGrid-columnHeaders": {
            backgroundColor: "#f8f9fa",
            fontWeight: "bold",
            textAlign: "center",
          },
          "& .MuiDataGrid-cell": {
            display: "flex",
            justifyContent: "center",
            alignItems: "center", // ⬆️ Vertically center content
            textAlign: "center",
            minHeight: "100px",
          },
          "& .MuiDataGrid-cell img": {
            width: "100px",
            height: "120px", // Ensure image has the increased height
            objectFit: "cover",
          },
          "& .MuiDataGrid-toolbarContainer": {
            flexDirection: "row-reverse",
            margin: "10px",
          },
        }}
      />
    </Box>
  );

  return (
    <Box sx={{ padding: "20px" }}>
      {renderHeader}
      {renderBody}
      <BlogCreateForm
        open={openModal}
        handleClose={() => setOpenModal(false)}
      />
      <DeleteConfirmationModal
        open={deleteModalOpen}
        handleClose={() => setDeleteModalOpen(false)}
        handleConfirm={handleConfirmDelete}
        title="Delete Blog"
        message="Are you sure you want to delete this blog? This action cannot be undone."
        loading={loading}
      />
      <BlogEditForm
        open={editModalOpen}
        handleClose={() => setEditModalOpen(false)}
        blogId={selectedBlogId} // ✅ Pass the selected Blog ID
      />
    </Box>
  );
};

export default BlogsTableView;
