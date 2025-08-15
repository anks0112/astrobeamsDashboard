import React, { useMemo, useRef, useState, useEffect } from "react";
import { Box, TextField, IconButton, Typography, Paper } from "@mui/material";
import { Send, AddPhotoAlternate } from "@mui/icons-material";
import PersonIcon from "@mui/icons-material/Person";
import api from "../../utils/api";

// Chat Component
const ChatComponent = ({ support_id, messages, status }) => {
  const fileInputRef = useRef(null);
  const listRef = useRef(null);
  const [message, setMessage] = useState("");

  const statusLower = (status ?? "").toLowerCase();
  const isClosed = statusLower === "closed";

  // 👉 Local state that the UI renders from (kept in sync with prop)
  const [chatMessages, setChatMessages] = useState([]);

  // Normalize incoming prop once or when it changes
  useEffect(() => {
    const initial = Array.isArray(messages)
      ? messages
      : messages?.messages ?? [];
    setChatMessages(initial);
  }, [messages]);

  const targetId = support_id;

  const handleClick = () => fileInputRef.current?.click();

  const formatTimestamp = (ts) => {
    if (!ts) return "";
    const d = new Date(ts);
    return d.toLocaleString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
  };

  const formatDate = (ts) => {
    if (!ts) return "";
    const date = new Date(ts);
    const today = new Date();
    const yesterday = new Date();
    yesterday.setDate(today.getDate() - 1);
    if (date.toDateString() === today.toDateString()) return "Today";
    if (date.toDateString() === yesterday.toDateString()) return "Yesterday";
    return date.toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  const groupMessagesByDate = (list) =>
    list.reduce((acc, msg) => {
      const key = formatDate(msg?.timestamp) || "Unknown";
      (acc[key] ||= []).push(msg);
      return acc;
    }, {});

  const groupedMessages = useMemo(
    () => groupMessagesByDate(chatMessages),
    [chatMessages]
  );

  // auto-scroll when messages update
  useEffect(() => {
    listRef.current?.scrollTo({
      top: listRef.current.scrollHeight,
      behavior: "smooth",
    });
  }, [chatMessages.length]);

  const handleImageUpload = async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const allowed = ["image/jpeg", "image/png", "image/gif", "image/webp"];
    if (!allowed.includes(file.type)) {
      alert("Please upload a valid image file (JPEG, PNG, GIF, or WEBP).");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await api.post("/backend/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      if (res?.data?.success && res?.data?.url) {
        // Send image URL
        const result = await sendMessageApi(targetId, res.data.url, "image");
        if (result.success) {
          // Append to local chat and clear file input
          const newMsg = {
            _id: "local-" + Date.now(),
            sender: "support",
            message: res.data.url,
            type: "image",
            timestamp: new Date().toISOString(),
          };
          setChatMessages((prev) => [...prev, newMsg]);
          event.target.value = "";
        } else {
          alert(result.error || "Failed to send image.");
        }
      } else {
        alert("Image upload failed!");
      }
    } catch (e) {
      console.error("Image upload error:", e);
      alert("Error uploading image. Please try again.");
    }
  };

  const handleSend = async () => {
    const text = message.trim();
    if (!text) return;
    if (!targetId) {
      console.warn("Missing support_id for sending message");
      return;
    }
    const result = await sendMessageApi(targetId, text);
    if (result.success) {
      // 👉 Clear input
      setMessage("");
      // 👉 Append the sent message to local chat
      const newMsg = {
        _id: "local-" + Date.now(),
        sender: "support",
        message: text,
        type: "text",
        timestamp: new Date().toISOString(),
      };
      setChatMessages((prev) => [...prev, newMsg]);
    } else {
      console.error("Failed to send message:", result.error);
      alert(result.error || "Failed to send message.");
    }
  };

  const sendMessageApi = async (id, msg, type = "text") => {
    try {
      const res = await api.post("/super_admin/backend/send_support_msg", {
        support_id: id,
        message: msg,
        type,
      });
      if (res?.status === 200) return { success: true, data: res.data };
      return { success: false, error: res?.data?.msg || "Unknown error" };
    } catch (e) {
      return { success: false, error: e?.message || "Error occurred" };
    }
  };

  return (
    <Paper sx={styles.chatContainer}>
      {/* Chat Messages Section */}
      <Box sx={styles.chatMessages} ref={listRef}>
        {Object.keys(groupedMessages).map((date) => (
          <Box key={date}>
            <Typography sx={styles.dateHeader}>{date}</Typography>
            {groupedMessages[date].map((msg, idx) => {
              const sender = String(msg?.sender || "").toLowerCase();
              const isUserSide =
                sender === "customer" || sender === "astrologer";
              const isSupport = sender === "support";
              return (
                <Box
                  key={msg?._id || msg?.timestamp || `${date}-${idx}`}
                  sx={{
                    ...styles.messageContainer,
                    justifyContent: isUserSide ? "flex-start" : "flex-end",
                  }}
                >
                  {isUserSide && <PersonIcon sx={styles.avatarIcon} />}
                  <Box sx={styles.messageWrapper}>
                    {msg?.type === "image" ? (
                      <Box
                        component="img"
                        src={msg?.message}
                        alt="attachment"
                        sx={styles.imageBubble}
                      />
                    ) : (
                      <Typography
                        sx={{
                          ...styles.messageBubble,
                          backgroundColor: isUserSide ? "#E0F7FA" : "#ff9800",
                          color: isUserSide ? "#000" : "#fff",
                        }}
                      >
                        {msg?.message}
                      </Typography>
                    )}

                    <Typography sx={styles.timestamp}>
                      {formatTimestamp(msg?.timestamp)}
                    </Typography>
                  </Box>
                  {isSupport && <PersonIcon sx={styles.avatarIcon} />}
                </Box>
              );
            })}
          </Box>
        ))}
        {chatMessages.length === 0 && (
          <Typography
            sx={{ textAlign: "center", color: "text.secondary", py: 2 }}
          >
            No messages yet.
          </Typography>
        )}
      </Box>

      {/* Message Input Section */}
      <Box sx={styles.inputContainer}>
        <IconButton
          onClick={handleClick}
          aria-label="attach image"
          disabled={isClosed}
        >
          <AddPhotoAlternate sx={styles.icon} />
          <input
            type="file"
            accept="image/*"
            ref={fileInputRef}
            hidden
            onChange={handleImageUpload}
          />
        </IconButton>
        <TextField
          fullWidth
          variant="outlined"
          placeholder="Type a message"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={(e) =>
            e.key === "Enter" &&
            !e.shiftKey &&
            (e.preventDefault(), handleSend())
          }
          sx={styles.inputField}
        />
        <IconButton
          onClick={handleSend}
          sx={styles.sendButton}
          aria-label="send message"
          disabled={!message.trim() || !targetId || isClosed}
        >
          <Send />
        </IconButton>
      </Box>
    </Paper>
  );
};

// Styles
const styles = {
  chatContainer: {
    padding: { xs: "15px", md: "20px" },
    borderRadius: "12px",
    boxShadow: "0px 4px 10px rgba(0,0,0,0.1)",
    maxWidth: { xs: "100%", md: "700px" },
    width: "100%",
    display: "flex",
    flexDirection: "column",
    gap: "10px",
    margin: "0 auto",
  },
  chatMessages: {
    maxHeight: { xs: "300px", md: "100%" },
    overflowY: "auto",
    display: "flex",
    flexDirection: "column",
    gap: "15px",
    flexGrow: 1,
    scrollbarWidth: "none",
    "-ms-overflow-style": "none",
    "&::-webkit-scrollbar": { display: "none" },
  },
  dateHeader: {
    fontWeight: "bold",
    textAlign: "center",
    color: "#777",
    mb: "10px",
    fontSize: "0.85rem",
  },
  messageContainer: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
  },
  messageWrapper: {
    display: "flex",
    flexDirection: "column",
    maxWidth: "75%",
  },
  avatarIcon: {
    fontSize: { xs: "24px", md: "32px" },
    backgroundColor: "#ff9800",
    color: "white",
    borderRadius: "50%",
    padding: "5px",
  },
  messageBubble: {
    padding: { xs: "8px", md: "12px" },
    borderRadius: "20px",
    fontSize: "0.95rem",
    wordWrap: "break-word",
  },
  imageBubble: {
    maxWidth: 280,
    maxHeight: 280,
    borderRadius: "12px",
    display: "block",
  },

  timestamp: {
    fontSize: "0.75rem",
    color: "#999",
    alignSelf: "flex-end",
    mt: "2px",
  },
  inputContainer: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
    borderTop: "1px solid #ddd",
    padding: { xs: "5px 0", md: "10px 0" },
  },
  inputField: {
    flex: 1,
    "& .MuiOutlinedInput-root": {
      borderRadius: "20px",
      backgroundColor: "#F8F9FA",
    },
  },
  sendButton: {
    backgroundColor: "#ff9800",
    color: "white",
    "&:hover": { backgroundColor: "#ca6f00ff" },
  },
  icon: { color: "#ff9800" },
};

export default ChatComponent;
