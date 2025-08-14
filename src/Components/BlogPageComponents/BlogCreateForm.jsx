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

  // ===== New editor enhancement state (no logic change to submit/upload) =====
  const [textColor, setTextColor] = useState("#000000");
  const [bgColor, setBgColor] = useState("#ffff00");
  const [stripOnPaste, setStripOnPaste] = useState(false);

  const handleChange = (e) =>
    setFormData((f) => ({
      ...f,
      [e.target.name]: e.target.value,
    }));

  // Focus helper so commands apply inside editor
  const focusEditor = () => {
    if (editorRef.current) editorRef.current.focus();
  };

  // Execute formatting command and sync HTML back to state (kept from original, enhanced)
  const exec = (cmd, val = null) => {
    focusEditor();
    document.execCommand(cmd, false, val);
    setFormData((f) => ({
      ...f,
      description: editorRef.current?.innerHTML || "",
    }));
  };

  const applyBlock = (tag) => exec("formatBlock", tag); // 'P','H1','H2','BLOCKQUOTE','PRE'

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

  const handleLink = () => {
    const url = window.prompt("Enter URL", "https://");
    if (url) exec("createLink", url);
  };

  const handleUnlink = () => exec("unlink");

  const insertImageByUrl = () => {
    const url = window.prompt("Image URL (https://...)", "");
    if (url) exec("insertImage", url);
  };

  const handleUploadImage = async (e) => {
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
      await api.post("/super_admin/backend/create_blog", {
        title: formData.title,
        photo: formData.photo,
        description: formData.description,
        tags: tagsArray,
      });
      refreshData?.();
      setFormData({ title: "", photo: "", description: "", tags: "" });
      if (editorRef.current) editorRef.current.innerHTML = "";
      toast.success("Blog created successfully!", { autoClose: 3000 });
      setTimeout(() => window.location.reload(), 3000);
    } catch {
      toast.error("Failed to create blog. Try again.", { autoClose: 3000 });
    } finally {
      setLoading(false);
    }
  };

  // Keep state synced when typing in the editor
  const syncFromEditor = () =>
    setFormData((f) => ({
      ...f,
      description: editorRef.current?.innerHTML || "",
    }));

  // Keyboard shortcuts (Cmd/Ctrl+B/I/U)
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

  // Optional: paste as plain text toggle
  const onEditorPaste = (e) => {
    if (!stripOnPaste) return;
    e.preventDefault();
    const text = e.clipboardData.getData("text/plain");
    exec("insertText", text);
  };

  // Live counts
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
          Create New Blog
        </Typography>

        {message.text && (
          <Alert severity={message.type || "info"}>{message.text}</Alert>
        )}

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

          {/* ===== Enhanced Toolbar (keeps original actions + adds full editor controls) ===== */}
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
            {/* Block format */}
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
              <option value="BLOCKQUOTE">Quote</option>
              <option value="PRE">Code Block</option>
            </TextField>

            {/* Inline formatting (original) */}
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

            {/* Extra inline */}
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

            {/* Lists (original) */}
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

            {/* Alignment */}
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

            {/* Links (original + unlink) */}
            <Tooltip title="Link">
              <IconButton onClick={handleLink}>
                <LinkIcon />
              </IconButton>
            </Tooltip>
            <Tooltip title="Unlink">
              <IconButton onClick={handleUnlink}>⛓️‍⬛</IconButton>
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

            {/* Undo / Redo (original) */}
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

            {/* Extras on the right */}
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

          {/* Scrollable editor area (unchanged logic, enhanced UX) */}
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

          {/* Live counts */}
          <Typography variant="caption" color="text.secondary">
            {(() => {
              const { words, chars } = getCounts();
              return `Words: ${words} • Characters: ${chars}`;
            })()}
          </Typography>

          {/* Image Preview (original) */}
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

          {/* Upload Photo (original) */}
          <Button
            variant="contained"
            component="label"
            sx={{ m: 2, backgroundColor: "#ff9800" }}
          >
            Upload Photo
            <input type="file" hidden onChange={handleUploadImage} />
          </Button>

          {/* Actions (original) */}
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
