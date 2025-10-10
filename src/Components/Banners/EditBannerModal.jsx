import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  TextField,
  Modal,
  Typography,
  IconButton,
  Stack,
} from "@mui/material";
import { Close } from "@mui/icons-material";
import api from "../../utils/api";
import { toast } from "react-toastify";

const EditBannerModal = ({ open, handleClose, bannerId }) => {
  const [section, setSection] = useState("");
  const [photos, setPhotos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [imageLoading, setImageLoading] = useState(false);
  const [fetching, setFetching] = useState(true);

  // ✅ Fetch existing banner data
  useEffect(() => {
    const fetchBannerData = async () => {
      if (!bannerId) return;
      setFetching(true);
      try {
        const res = await api.get(
          `/super_admin/backend/get_banner/${bannerId}`
        );
        if (res.data?.success && res.data?.data) {
          const banner = res.data.data;
          setSection(banner.section || "");
          setPhotos(banner.photos || []);
        } else {
          toast.error("Failed to load banner details");
        }
      } catch (err) {
        console.error("Error fetching banner:", err);
        toast.error("Error fetching banner details");
      } finally {
        setFetching(false);
      }
    };

    if (open) fetchBannerData();
  }, [bannerId, open]);

  // ✅ Upload image handler
  const handleImageUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const allowedTypes = ["image/jpeg", "image/png", "image/webp"];
    if (!allowedTypes.includes(file.type)) {
      toast.error("Invalid file type. Please upload JPEG, PNG, or WEBP.");
      return;
    }

    const maxSize = 5 * 1024 * 1024;
    if (file.size > maxSize) {
      toast.error("File size exceeds 5MB limit.");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);

    setImageLoading(true);
    try {
      const res = await api.post("/backend/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      if (res.data.success) {
        setPhotos((prev) => [...prev, res.data.url]);
      } else {
        toast.error("Image upload failed!");
      }
    } catch (err) {
      console.error("Image upload error:", err);
      toast.error("Error uploading image. Please try again.");
    } finally {
      setImageLoading(false);
    }
  };

  const removeImage = (index) => {
    setPhotos((prev) => prev.filter((_, i) => i !== index));
  };

  // ✅ Submit updated data
  const handleSubmit = async () => {
    if (!section.trim() || photos.length === 0) {
      toast.error("Please enter a section name and upload at least one image.");
      return;
    }

    const updatedBanner = {
      section: section.trim(),
      photos,
    };

    setLoading(true);
    try {
      const res = await api.put(
        `/super_admin/backend/update_banner/${bannerId}`,
        updatedBanner
      );

      if (res.data.success) {
        toast.success("Banner updated successfully!");
        handleClose();
      } else {
        toast.error(res.data.msg || "Failed to update banner.");
      }
    } catch (err) {
      console.error("Error updating banner:", err);
      toast.error(err.message || "Error updating banner.");
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
          maxHeight: "80vh",
          overflowY: "auto",
        }}
      >
        <Typography variant="h6" sx={{ mb: 2 }}>
          Edit Banner
        </Typography>

        {fetching ? (
          <Typography>Loading banner data...</Typography>
        ) : (
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
                  flexDirection: "column",
                  gap: 1,
                  mb: 2,
                  maxHeight: "500px",
                  overflowY: "auto",
                  border: "1px solid #ccc",
                  borderRadius: 2,
                  padding: 1,
                }}
              >
                {photos.map((photo, index) => (
                  <Box
                    key={index}
                    sx={{
                      position: "relative",
                      width: "100%",
                      maxHeight: "120px",
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
                        width: "auto",
                        maxWidth: "100%",
                        height: "auto",
                        maxHeight: "120px",
                        objectFit: "contain",
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
              {imageLoading ? "Uploading..." : "Upload Image"}
              <input type="file" hidden onChange={handleImageUpload} />
            </Button>
          </Stack>
        )}

        {/* Action Buttons */}
        <Box sx={{ display: "flex", justifyContent: "space-between" }}>
          <Button
            variant="contained"
            color="primary"
            onClick={handleSubmit}
            disabled={loading || fetching}
            sx={{ textTransform: "none" }}
          >
            {loading ? "Updating..." : "Update"}
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

export default EditBannerModal;
