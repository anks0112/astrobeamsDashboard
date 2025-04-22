import React, { useState, useRef } from "react";
import {
  Box,
  Button,
  Modal,
  TextField,
  Typography,
  CircularProgress,
  Alert,
  Stack,
  IconButton,
  Tooltip,
} from "@mui/material";
import FormatBoldIcon from "@mui/icons-material/FormatBold";
import FormatItalicIcon from "@mui/icons-material/FormatItalic";
import FormatUnderlinedIcon from "@mui/icons-material/FormatUnderlined";
import FormatListBulletedIcon from "@mui/icons-material/FormatListBulleted";
import FormatListNumberedIcon from "@mui/icons-material/FormatListNumbered";
import LinkIcon from "@mui/icons-material/Link";
import UndoIcon from "@mui/icons-material/Undo";
import RedoIcon from "@mui/icons-material/Redo";
import api from "../../utils/api";
import { toast } from "react-toastify";
import { useLocation } from "react-router";

const BlogCreateForm = ({ open, handleClose, refreshData }) => {
  const location = useLocation();
  const editorRef = useRef(null);

  const [imageFile, setImageFile] = useState(null);
  const [formData, setFormData] = useState({
    title: "",
    photo: "",
    description: "",
    tags: "",
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });

  const handleChange = (e) =>
    setFormData((f) => ({ ...f, [e.target.name]: e.target.value }));

  // Execute formatting command and sync HTML back to state
  const exec = (cmd, val = null) => {
    document.execCommand(cmd, false, val);
    setFormData((f) => ({
      ...f,
      description: editorRef.current.innerHTML,
    }));
  };

  const handleLink = () => {
    const url = window.prompt("Enter URL", "https://");
    if (url) exec("createLink", url);
  };

  const handleUploadImage = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const fd = new FormData();
    fd.append("file", file);
    try {
      const { data } = await api.post("/backend/upload", fd, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      if (data.success) {
        setFormData((f) => ({ ...f, photo: data.url }));
        setImageFile(data.url);
      } else {
        alert("Image upload failed!");
      }
    } catch {
      alert("Error uploading image. Please try again.");
    }
  };

  const handleRemoveImage = () => {
    setFormData((f) => ({ ...f, photo: "" }));
    setImageFile(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const tagsArray = formData.tags.split(",").map((t) => t.trim());
    try {
      await api.post("/super_admin/backend/create_blog", {
        title: formData.title,
        photo: formData.photo,
        description: formData.description,
        tags: tagsArray,
      });
      refreshData?.();
      setFormData({ title: "", photo: "", description: "", tags: "" });
      editorRef.current.innerHTML = "";
      toast.success("Blog created successfully!", { autoClose: 3000 });
      setTimeout(() => window.location.reload(), 3000);
    } catch {
      toast.error("Failed to create blog. Try again.", { autoClose: 3000 });
    } finally {
      setLoading(false);
    }
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

          {/* MUI toolbar */}
          <Box
            sx={{
              border: "1px solid rgba(0,0,0,0.23)",
              borderBottom: "none",
              borderRadius: "4px 4px 0 0",
              px: 1,
              py: 0.5,
              display: "flex",
              gap: 1,
            }}
          >
            <Tooltip title="Bold">
              <IconButton onClick={() => exec("bold")}>
                <FormatBoldIcon />
              </IconButton>
            </Tooltip>
            <Tooltip title="Italic">
              <IconButton onClick={() => exec("italic")}>
                <FormatItalicIcon />
              </IconButton>
            </Tooltip>
            <Tooltip title="Underline">
              <IconButton onClick={() => exec("underline")}>
                <FormatUnderlinedIcon />
              </IconButton>
            </Tooltip>
            <Tooltip title="Bulleted list">
              <IconButton onClick={() => exec("insertUnorderedList")}>
                <FormatListBulletedIcon />
              </IconButton>
            </Tooltip>
            <Tooltip title="Numbered list">
              <IconButton onClick={() => exec("insertOrderedList")}>
                <FormatListNumberedIcon />
              </IconButton>
            </Tooltip>
            <Tooltip title="Link">
              <IconButton onClick={handleLink}>
                <LinkIcon />
              </IconButton>
            </Tooltip>
            <Tooltip title="Undo">
              <IconButton onClick={() => exec("undo")}>
                <UndoIcon />
              </IconButton>
            </Tooltip>
            <Tooltip title="Redo">
              <IconButton onClick={() => exec("redo")}>
                <RedoIcon />
              </IconButton>
            </Tooltip>
          </Box>

          {/* Scrollable editor area */}
          <Box
            sx={{
              border: "1px solid rgba(0,0,0,0.23)",
              borderRadius: "0 0 4px 4px",
              height: 200,
              overflowY: "auto",
              mb: 2,
            }}
          >
            <Box
              ref={editorRef}
              contentEditable
              suppressContentEditableWarning
              onInput={() =>
                setFormData((f) => ({
                  ...f,
                  description: editorRef.current.innerHTML,
                }))
              }
              sx={{ minHeight: "100%", p: 1, outline: "none" }}
            />
          </Box>

          {/* Image Preview */}
          {imageFile && (
            <Box sx={{ textAlign: "left", mt: 1 }}>
              <img
                src={imageFile}
                alt="Uploaded Preview"
                style={{ width: "50%", height: "10vh", borderRadius: 8 }}
              />
              <Button variant="text" color="error" onClick={handleRemoveImage}>
                Remove
              </Button>
            </Box>
          )}

          {/* Upload Photo */}
          <Button
            variant="contained"
            component="label"
            sx={{ mt: 2, mb: 2, backgroundColor: "#ff9800" }}
          >
            Upload Photo
            <input type="file" hidden onChange={handleUploadImage} />
          </Button>

          {/* Actions */}
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
                "Create Blog"
              )}
            </Button>
          </Box>
        </form>
      </Box>
    </Modal>
  );
};

export default BlogCreateForm;
