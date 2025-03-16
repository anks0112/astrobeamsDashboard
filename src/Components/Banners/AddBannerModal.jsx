import React, { useState } from "react";
import {
  Box,
  Button,
  TextField,
  Modal,
  Typography,
  IconButton,
  Stack,
} from "@mui/material";
import { Add, Close } from "@mui/icons-material";
import api from "../../utils/api";
import { toast } from "react-toastify";

const AddBannerModal = ({ open, handleClose }) => {
  const [section, setSection] = useState("");
  const [photos, setPhotos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [imageLoading, setImageLoading] = useState(false);

  const handleImageUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    // Allowed file types
    const allowedTypes = ["image/jpeg", "image/png", "image/webp"];
    if (!allowedTypes.includes(file.type)) {
      alert("Invalid file type. Please upload JPEG, PNG, or WEBP.");
      return;
    }

    // File size validation (Max 5MB)
    const maxSize = 5 * 1024 * 1024;
    if (file.size > maxSize) {
      alert("File size exceeds 5MB limit.");
      return;
    }

    const formDataImage = new FormData();
    formDataImage.append("file", file);

    setImageLoading(true);
    try {
      const response = await api.post("/backend/upload", formDataImage, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      if (response.data.success) {
        setPhotos([...photos, response.data.url]); // ✅ Store uploaded image URL
      } else {
        alert("Image upload failed!");
      }
    } catch (error) {
      console.error("Image upload error:", error);
      alert("Error uploading image. Please try again.");
    } finally {
      setImageLoading(false);
    }
  };

  const removeImage = (index) => {
    setPhotos(photos.filter((_, i) => i !== index));
  };

  const handleSubmit = async () => {
    if (!section.trim() || photos.length === 0) {
      alert("Please enter a section name and upload at least one image.");
      return;
    }

    const bannerData = {
      section: section.trim(),
      photos,
    };

    setLoading(true);

    try {
      const response = await api.post(
        "/super_admin/backend/create_banner",
        bannerData
      );

      if (response.data.success) {
        toast.success("Banner Created Successfully!");
        handleClose(); // Close modal after success
      } else {
        alert(response.data.msg || "Failed to create banner.");
      }
    } catch (error) {
      console.error("Error creating banner:", error);
      toast.error(error.msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal open={open} onClose={handleClose}>
      <Box
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          bgcolor: "background.paper",
          boxShadow: 24,
          p: 3,
          borderRadius: 2,
          width: "60%",
          maxHeight: "80vh", // ✅ Limit modal height to trigger scrolling
          overflowY: "auto", // ✅ Enable scrolling inside modal
        }}
      >
        <Typography variant="h6" sx={{ mb: 2 }}>
          Create New Banner
        </Typography>

        <Stack direction="column" justifyContent="space-between">
          <TextField
            label="Section"
            variant="outlined"
            value={section}
            onChange={(e) => setSection(e.target.value)}
            sx={{ mb: 2 }}
          />

          {/* Uploaded Images Preview */}
          {photos.length > 0 && (
            <Box
              sx={{
                display: "flex",
                flexDirection: "column", // ✅ Stack images vertically
                gap: 1,
                mb: 2,
                maxHeight: "500px", // ✅ Ensure this container has a fixed height
                overflowY: "auto", // ✅ Enable vertical scrolling
                border: "1px solid #ccc",
                borderRadius: 2,
                padding: 1,
              }}
            >
              {" "}
              {photos.map((photo, index) => (
                <Box
                  key={index}
                  sx={{
                    position: "relative",
                    width: "100%",
                    maxHeight: "120px", // ✅ Ensure image doesn't take up too much space
                    border: "1px solid #ccc",
                    borderRadius: 2,
                    overflow: "hidden",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <img
                    src={photo}
                    alt={`Uploaded ${index}`}
                    style={{
                      width: "auto", // ✅ Let image scale naturally
                      maxWidth: "100%", // ✅ Prevent overflowing horizontally
                      height: "auto", // ✅ Maintain aspect ratio
                      maxHeight: "120px", // ✅ Prevent excessive height
                      objectFit: "contain", // ✅ Ensure full image is visible
                    }}
                  />
                  <IconButton
                    sx={{
                      position: "absolute",
                      top: 0,
                      right: 0,
                      backgroundColor: "rgba(255, 255, 255, 0.7)",
                      "&:hover": {
                        backgroundColor: "rgba(255, 255, 255, 0.9)",
                      },
                    }}
                    size="small"
                    onClick={() => removeImage(index)}
                  >
                    <Close fontSize="small" />
                  </IconButton>
                </Box>
              ))}
            </Box>
          )}

          <Button
            variant="contained"
            component="label"
            sx={{ mb: 2 }}
            disabled={imageLoading}
          >
            {imageLoading ? "Uploading" : "Upload Image"}
            <input type="file" hidden onChange={handleImageUpload} />
          </Button>
        </Stack>

        {/* Action Buttons */}
        <Box sx={{ display: "flex", justifyContent: "space-between" }}>
          <Button
            variant="contained"
            color="primary"
            onClick={handleSubmit}
            disabled={loading}
            sx={{ textTransform: "none" }}
          >
            {loading ? "Creating" : "Create"}
          </Button>
          <Button
            variant="outlined"
            color="secondary"
            onClick={handleClose}
            sx={{ textTransform: "none" }}
          >
            Cancel
          </Button>
        </Box>
      </Box>
    </Modal>
  );
};

export default AddBannerModal;
