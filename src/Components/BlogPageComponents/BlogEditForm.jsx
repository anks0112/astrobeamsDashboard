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

  // extra editor state (UI-only; core logic unchanged)
  const [textColor, setTextColor] = useState("#000000");
  const [bgColor, setBgColor] = useState("#ffff00");
  const [stripOnPaste, setStripOnPaste] = useState(false);

  // populate form + editor when blog changes
  useEffect(() => {
    if (selectedBlog) {
      setFormData({
        title: selectedBlog.title,
        photo: selectedBlog.photo,
        description: selectedBlog.description,
        tags: (selectedBlog.tags || []).join(", "),
      });
      setImageFile(selectedBlog.photo || null);
      setTimeout(() => {
        if (editorRef.current) {
          editorRef.current.innerHTML = selectedBlog.description || "";
        }
      }, 0);
    }
  }, [selectedBlog]);

  const handleChange = (e) =>
    setFormData((f) => ({ ...f, [e.target.name]: e.target.value }));

  const focusEditor = () => {
    if (editorRef.current) editorRef.current.focus();
  };

  // execCommand + sync HTML (kept)
  const exec = (cmd, val = null) => {
    focusEditor();
    document.execCommand(cmd, false, val);
    setFormData((f) => ({
      ...f,
      description: editorRef.current?.innerHTML || "",
    }));
  };

  const applyBlock = (tag) => exec("formatBlock", tag); // 'P','H1','H2','BLOCKQUOTE','PRE'

  const handleLink = () => {
    const url = window.prompt("Enter URL", "https://");
    if (url) exec("createLink", url);
  };

  const handleUnlink = () => exec("unlink");

  const handleFontSizeChange = (e) => {
    const size = e.target.value;
    setFontSize(size);
    document.execCommand("styleWithCSS", false, true);
    exec("fontSize", size);
  };

  const handleInsertTable = () => {
    const rows = parseInt(window.prompt("Rows", "2"), 10);
    const cols = parseInt(window.prompt("Cols", "2"), 10);
    if (rows > 0 && cols > 0) {
      let html =
        '<table style="width:100%;border-collapse:collapse;" border="1">';
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

  const insertInlineCode = () => {
    const selected = window.getSelection()?.toString() || "inline code";
    exec("insertHTML", `<code>${selected}</code>`);
  };

  const insertCodeBlock = () => {
    const selected = window.getSelection()?.toString() || "code block";
    exec(
      "insertHTML",
      `<pre style="padding:12px;border-radius:8px;background:#f6f8fa;overflow:auto;">${selected}</pre>`
    );
  };

  const insertImageByUrl = () => {
    const url = window.prompt("Image URL (https://...)", "");
    if (url) exec("insertImage", url);
  };

  const handleFileUpload = async (e) => {
    const file = e.target.files?.[0];
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

  // keep state in sync while typing
  const syncFromEditor = () =>
    setFormData((f) => ({
      ...f,
      description: editorRef.current?.innerHTML || "",
    }));

  // shortcuts
  const onEditorKeyDown = (e) => {
    const isMac = navigator.platform.toUpperCase().includes("MAC");
    const mod = isMac ? e.metaKey : e.ctrlKey;
    const key = e.key.toLowerCase();
    if (mod && key === "b") {
      e.preventDefault();
      exec("bold");
    } else if (mod && key === "i") {
      e.preventDefault();
      exec("italic");
    } else if (mod && key === "u") {
      e.preventDefault();
      exec("underline");
    }
  };

  // optional: paste as plain text
  const onEditorPaste = (e) => {
    if (!stripOnPaste) return;
    e.preventDefault();
    const text = e.clipboardData.getData("text/plain");
    exec("insertText", text);
  };

  // counts
  const getCounts = () => {
    const plain = editorRef.current?.innerText || "";
    const words = (plain.trim().match(/\S+/g) || []).length;
    const chars = plain.length;
    return { words, chars };
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
          maxHeight: "100vh",
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

          {/* Enhanced Toolbar to match Create form features (logic unchanged) */}
          <Box
            sx={{
              border: "1px solid rgba(0,0,0,0.23)",
              borderBottom: "none",
              borderRadius: "4px 4px 0 0",
              px: 1,
              py: 0.5,
              display: "flex",
              flexWrap: "wrap",
              alignItems: "center",
              gap: 1,
            }}
          >
            {/* Block / Size */}
            <TextField
              select
              size="small"
              label="Block"
              SelectProps={{ native: true }}
              onChange={(e) => applyBlock(e.target.value)}
              sx={{ minWidth: 120 }}
            >
              <option value="P">Paragraph</option>
              <option value="H1">Heading 1</option>
              <option value="H2">Heading 2</option>
              <option value="H3">Heading 3</option>
              <option value="H4">Heading 4</option>
              <option value="H5">Heading 5</option>
              <option value="H6">Heading 6</option>
              <option value="BLOCKQUOTE">Quote</option>
              <option value="PRE">Code Block</option>
            </TextField>

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

            {/* Inline */}
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
            <Tooltip title="Strikethrough">
              <IconButton onClick={() => exec("strikeThrough")}>
                <span
                  style={{ textDecoration: "line-through", fontWeight: 600 }}
                >
                  S
                </span>
              </IconButton>
            </Tooltip>
            <Tooltip title="Superscript">
              <IconButton onClick={() => exec("superscript")}>
                <span style={{ verticalAlign: "super", fontSize: 12 }}>x</span>
              </IconButton>
            </Tooltip>
            <Tooltip title="Subscript">
              <IconButton onClick={() => exec("subscript")}>
                <span style={{ verticalAlign: "sub", fontSize: 12 }}>x</span>
              </IconButton>
            </Tooltip>

            {/* Lists */}
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

            {/* Indent / Outdent */}
            <Tooltip title="Indent">
              <IconButton onClick={() => exec("indent")}>⟶</IconButton>
            </Tooltip>
            <Tooltip title="Outdent">
              <IconButton onClick={() => exec("outdent")}>⟵</IconButton>
            </Tooltip>

            {/* Align */}
            <Tooltip title="Align Left">
              <IconButton onClick={() => exec("justifyLeft")}>L</IconButton>
            </Tooltip>
            <Tooltip title="Center">
              <IconButton onClick={() => exec("justifyCenter")}>C</IconButton>
            </Tooltip>
            <Tooltip title="Align Right">
              <IconButton onClick={() => exec("justifyRight")}>R</IconButton>
            </Tooltip>
            <Tooltip title="Justify">
              <IconButton onClick={() => exec("justifyFull")}>J</IconButton>
            </Tooltip>

            {/* Link + Table + Unlink */}
            <Tooltip title="Link">
              <IconButton onClick={handleLink}>
                <LinkIcon />
              </IconButton>
            </Tooltip>
            <Tooltip title="Unlink">
              <IconButton onClick={handleUnlink}>⛓️‍⬛</IconButton>
            </Tooltip>
            <Tooltip title="Table">
              <IconButton onClick={handleInsertTable}>
                <TableRowsIcon />
              </IconButton>
            </Tooltip>

            {/* Code */}
            <Tooltip title="Inline Code">
              <IconButton onClick={insertInlineCode}>{`</>`}</IconButton>
            </Tooltip>
            <Tooltip title="Code Block">
              <IconButton onClick={insertCodeBlock}>▦</IconButton>
            </Tooltip>

            {/* HR & Clear */}
            <Tooltip title="Horizontal Rule">
              <IconButton onClick={() => exec("insertHorizontalRule")}>
                —
              </IconButton>
            </Tooltip>
            <Tooltip title="Clear Formatting">
              <IconButton onClick={() => exec("removeFormat")}>🧹</IconButton>
            </Tooltip>

            {/* Colors */}
            <Stack
              direction="row"
              alignItems="center"
              spacing={1}
              sx={{ ml: 1 }}
            >
              <label style={{ fontSize: 12 }}>Text</label>
              <input
                aria-label="Text color"
                type="color"
                value={textColor}
                onChange={(e) => {
                  setTextColor(e.target.value);
                  exec("foreColor", e.target.value);
                }}
                style={{
                  width: 28,
                  height: 28,
                  border: "none",
                  background: "transparent",
                  cursor: "pointer",
                }}
              />
              <label style={{ fontSize: 12 }}>Highlight</label>
              <input
                aria-label="Highlight color"
                type="color"
                value={bgColor}
                onChange={(e) => {
                  setBgColor(e.target.value);
                  exec("hiliteColor", e.target.value);
                }}
                style={{
                  width: 28,
                  height: 28,
                  border: "none",
                  background: "transparent",
                  cursor: "pointer",
                }}
              />
            </Stack>

            {/* Undo / Redo */}
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

            {/* Extras (right side) */}
            {/* <Stack
              direction="row"
              spacing={1}
              sx={{ ml: "auto", alignItems: "center" }}
            >
              <Button
                size="small"
                variant={stripOnPaste ? "contained" : "outlined"}
                onClick={() => setStripOnPaste((s) => !s)}
              >
                Paste as text
              </Button>
              <Button size="small" onClick={insertImageByUrl}>
                Image URL
              </Button>
            </Stack> */}
          </Box>

          {/* scrollable editor */}
          <Box
            sx={{
              border: "1px solid rgba(0,0,0,0.23)",
              borderRadius: "0 0 4px 4px",
              height: 260,
              overflowY: "auto",
              mb: 1.5,
            }}
          >
            <Box
              ref={editorRef}
              contentEditable
              suppressContentEditableWarning
              onInput={syncFromEditor}
              onKeyDown={onEditorKeyDown}
              onPaste={onEditorPaste}
              sx={{
                minHeight: "100%",
                p: 1.25,
                outline: "none",
                "& pre": {
                  fontFamily:
                    "ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace",
                },
                "& code": {
                  background: "rgba(2, 122, 255, 0.08)",
                  borderRadius: "4px",
                  padding: "0 4px",
                },
                "& blockquote": {
                  borderLeft: "4px solid #ddd",
                  margin: "8px 0",
                  padding: "6px 10px",
                  color: "text.secondary",
                },
              }}
            />
          </Box>

          <Typography variant="caption" color="text.secondary">
            {(() => {
              const { words, chars } = getCounts();
              return `Words: ${words} • Characters: ${chars}`;
            })()}
          </Typography>

          {imageFile && (
            <Box sx={{ textAlign: "left", mt: 1 }}>
              <img
                src={imageFile}
                alt="Uploaded Preview"
                style={{
                  width: "50%",
                  height: "10vh",
                  borderRadius: 8,
                  objectFit: "cover",
                }}
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
