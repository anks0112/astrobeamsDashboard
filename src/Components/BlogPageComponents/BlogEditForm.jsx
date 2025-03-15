import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  Modal,
  TextField,
  Typography,
  CircularProgress,
  Alert,
  Stack,
} from "@mui/material";
import api from "../../utils/api";
import { toast } from "react-toastify";
import { useLocation } from "react-router";
import { useSelector } from "react-redux";

const BlogEditForm = ({ open, handleClose, refreshData, blogId }) => {
  const location = useLocation;
  const [imageFile, setImageFile] = useState(null);
  const { blogs } = useSelector((state) => state.allBlogs);
  const selectedBlog = blogs.find((blog) => blog._id === blogId);

  const [formData, setFormData] = useState({
    title: selectedBlog?.title || "",
    photo: selectedBlog?.photo || "",
    description: selectedBlog?.description || "",
    tags: selectedBlog?.tags?.join(", ") || "",
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });

  // ✅ Handle Input Changes
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  useEffect(() => {
    if (selectedBlog) {
      setFormData({
        title: selectedBlog.title,
        photo: selectedBlog.photo,
        description: selectedBlog.description,
        tags: selectedBlog.tags.join(", "),
      });
      setImageFile(selectedBlog.photo);
    }
  }, [selectedBlog]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ type: "", text: "" });

    // Convert comma-separated tags into an array
    const tagsArray = formData.tags.split(",").map((tag) => tag.trim());

    try {
      const response = await api.patch(
        `/super_admin/backend/update_blog/${blogId}`,
        {
          title: formData.title,
          photo: formData.photo,
          description: formData.description,
          tags: tagsArray,
        }
      );

      setFormData({ title: "", photo: "", description: "", tags: "" });

      toast.success("Blog updated successfully!", {
        position: "top-center",
        autoClose: 3000,
      });
      setTimeout(() => {
        window.location.reload();
      }, 3000);
      //   setTimeout(() => handleClose(), 1000);
    } catch (error) {
      toast.error(error.msg || "Failed to create blog. Try again.", {
        position: "top-center",
        autoClose: 3000,
      });
    } finally {
      setLoading(false);
    }
  };

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formDataImage = new FormData();
    formDataImage.append("file", file);

    try {
      const response = await api.post("/backend/upload", formDataImage, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      if (response.data.success) {
        setFormData((prevState) => ({
          ...prevState,
          photo: response.data.url,
        })); // ✅ Store image URL
        setImageFile(response.data.url); // ✅ Store preview image
      } else {
        alert("Image upload failed!");
      }
    } catch (error) {
      console.error("Image upload error:", error);
      alert("Error uploading image. Please try again.");
    }
  };

  const handleRemoveImage = () => {
    setFormData((prevState) => ({ ...prevState, photo: "" })); // ✅ Clear URL
    setImageFile(null); // ✅ Remove preview
  };

  return (
    <Modal open={open} onClose={handleClose}>
      <Box
        sx={{
          width: "60%",
          p: 4,
          bgcolor: "background.paper",
          boxShadow: 24,
          borderRadius: 2,
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          overflowY: "auto",
        }}
      >
        <Typography
          variant="h6"
          sx={{ mb: 2, fontWeight: "bold", textAlign: "center" }}
        >
          Create New Blog
        </Typography>

        {message.text && <Alert severity={message.type}>{message.text}</Alert>}

        <form onSubmit={handleSubmit}>
          <Stack direction="row" spacing={2}>
            <TextField
              label="Blog Title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              required
              fullWidth
              margin="normal"
            />
            <TextField
              label="Tags (comma separated)"
              name="tags"
              value={formData.tags}
              onChange={handleChange}
              required
              fullWidth
              margin="normal"
              helperText="Example: travel, photography, nature"
            />
          </Stack>

          <TextField
            label="Description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            required
            fullWidth
            multiline
            rows={10}
            margin="normal"
          />

          {/* Image Preview Section */}
          {imageFile && (
            <Box sx={{ textAlign: "left", mt: 1 }}>
              <img
                src={imageFile}
                alt="Uploaded Preview"
                style={{ width: "50%", height: "10vh", borderRadius: "8px" }}
              />
              <Button variant="text" color="error" onClick={handleRemoveImage}>
                Remove
              </Button>
            </Box>
          )}

          {/* Upload Button */}
          <Button
            variant="contained"
            component="label"
            sx={{ mt: 2, mb: 2, backgroundColor: "#ff9800" }}
          >
            Upload Photo
            <input type="file" hidden onChange={handleFileUpload} />
          </Button>

          <Box sx={{ display: "flex", justifyContent: "space-between", mt: 2 }}>
            <Button
              variant="contained"
              onClick={handleClose}
              disabled={loading}
              sx={{ color: "white", backgroundColor: "green" }}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="contained"
              disabled={loading}
              sx={{ color: "white", background: "#ff9800" }}
            >
              {loading ? (
                <CircularProgress size={24} color="inherit" />
              ) : (
                "Update"
              )}
            </Button>
          </Box>
        </form>
      </Box>
    </Modal>
  );
};

export default BlogEditForm;
