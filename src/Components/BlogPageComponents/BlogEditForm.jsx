import React, { useState, useRef, useEffect } from "react";
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
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";
import FormatBoldIcon from "@mui/icons-material/FormatBold";
import FormatItalicIcon from "@mui/icons-material/FormatItalic";
import FormatUnderlinedIcon from "@mui/icons-material/FormatUnderlined";
import FormatListBulletedIcon from "@mui/icons-material/FormatListBulleted";
import FormatListNumberedIcon from "@mui/icons-material/FormatListNumbered";
import LinkIcon from "@mui/icons-material/Link";
import UndoIcon from "@mui/icons-material/Undo";
import RedoIcon from "@mui/icons-material/Redo";
import TableRowsIcon from "@mui/icons-material/TableRows";
import { useSelector } from "react-redux";
import { useLocation } from "react-router";
import api from "../../utils/api";
import { toast } from "react-toastify";

const BlogEditForm = ({ open, handleClose, refreshData, blogId }) => {
  const location = useLocation();
  const editorRef = useRef(null);
  const { blogs } = useSelector((state) => state.allBlogs);
  const selectedBlog = blogs.find((b) => b._id === blogId);

  const [formData, setFormData] = useState({
    title: "",
    photo: "",
    description: "",
    tags: "",
  });
  const [imageFile, setImageFile] = useState(null);
  const [fontSize, setFontSize] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });

  // Populate form and editor when selectedBlog changes
  useEffect(() => {
    if (selectedBlog) {
      setFormData({
        title: selectedBlog.title,
        photo: selectedBlog.photo,
        description: selectedBlog.description,
        tags: selectedBlog.tags.join(", "),
      });
      setImageFile(selectedBlog.photo);
      setTimeout(() => {
        if (editorRef.current) {
          editorRef.current.innerHTML = selectedBlog.description;
        }
      }, 0);
    }
  }, [selectedBlog]);

  const handleChange = (e) =>
    setFormData((f) => ({ ...f, [e.target.name]: e.target.value }));

  // execCommand + sync HTML
  const exec = (cmd, val = null) => {
    document.execCommand(cmd, false, val);
    setFormData((f) => ({
      ...f,
      description: editorRef.current?.innerHTML,
    }));
  };

  const handleLink = () => {
    const url = prompt("Enter URL", "https://");
    if (url) exec("createLink", url);
  };

  const handleFontSizeChange = (e) => {
    const size = e.target.value;
    setFontSize(size);
    document.execCommand("styleWithCSS", false, true);
    exec("fontSize", size);
  };

  const handleInsertTable = () => {
    const rows = parseInt(prompt("Rows", "2"), 10);
    const cols = parseInt(prompt("Cols", "2"), 10);
    if (rows > 0 && cols > 0) {
      let html = '<table style="width:100%;border-collapse:collapse;" border="1">';
      for (let r = 0; r < rows; r++) {
        html += "<tr>";
        for (let c = 0; c < cols; c++) {
          html += "<td>&nbsp;</td>";
        }
        html += "</tr>";
      }
      html += "</table><br/>";
      exec("insertHTML", html);
    }
  };

  const handleFileUpload = async (e) => {
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
      await api.patch(`/super_admin/backend/update_blog/${blogId}`, {
        title: formData.title,
        photo: formData.photo,
        description: formData.description,
        tags: tagsArray,
      });
      toast.success("Blog updated successfully!", {
        position: "top-center",
        autoClose: 3000,
      });
      refreshData?.();
      setTimeout(() => window.location.reload(), 3000);
    } catch {
      toast.error("Failed to update blog. Try again.", {
        position: "top-center",
        autoClose: 3000,
      });
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
          Edit Blog
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

          {/* toolbar */}
          <Box
            sx={{
              border: "1px solid rgba(0,0,0,0.23)",
              borderBottom: "none",
              borderRadius: "4px 4px 0 0",
              px: 1,
              py: 0.5,
              display: "flex",
              gap: 1,
              alignItems: "center",
            }}
          >
            <FormControl size="small">
              <InputLabel>Size</InputLabel>
              <Select
                value={fontSize}
                label="Size"
                onChange={handleFontSizeChange}
                sx={{ minWidth: 80 }}
              >
                <MenuItem value="1">8px</MenuItem>
                <MenuItem value="2">10px</MenuItem>
                <MenuItem value="3">12px</MenuItem>
                <MenuItem value="4">14px</MenuItem>
                <MenuItem value="5">18px</MenuItem>
                <MenuItem value="6">24px</MenuItem>
                <MenuItem value="7">36px</MenuItem>
              </Select>
            </FormControl>
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
            <Tooltip title="Table">
              <IconButton onClick={handleInsertTable}>
                <TableRowsIcon />
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

          {/* scrollable editor */}
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
