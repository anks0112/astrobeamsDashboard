// components/support/TicketDetails.jsx
import React, { useState } from "react";
import {
  Avatar,
  Box,
  Chip,
  Divider,
  Paper,
  Stack,
  Typography,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  TextField,
} from "@mui/material";
import api from "../../utils/api";

const ellipsisOneLine = {
  whiteSpace: "nowrap",
  overflow: "hidden",
  textOverflow: "ellipsis",
};

const formatDateTime = (iso) =>
  iso
    ? new Date(iso).toLocaleString("en-IN", {
        year: "numeric",
        month: "short",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
      })
    : "-";

const TicketDetails = ({ ticket }) => {
  const t = Array.isArray(ticket) ? ticket?.[0] : ticket;
  if (!t) return null;

  const [photoPreviewOpen, setPhotoPreviewOpen] = useState(false);

  const status = (t.status || "").toLowerCase();
  const isOpen = status === "open";
  const totalMsgs = Array.isArray(t.messages) ? t.messages.length : 0;
  const lastMsgAt =
    totalMsgs > 0 ? t.messages[totalMsgs - 1]?.timestamp : undefined;

  const [confirmOpen, setConfirmOpen] = useState(false);
  const [remark, setRemark] = useState("");

  const handleCloseChat = async () => {
    try {
      const res = await api.post("super_admin/backend/close_support_ticket", {
        support_id: t._id,
        resolved_remark: remark.trim(),
      });
      if (res?.status === 200 || res?.data?.success) {
        alert("Chat closed successfully");
        setConfirmOpen(false);
        setRemark("");
        window.location.reload();
      } else {
        alert(res?.data?.msg || "Failed to close chat");
      }
    } catch (e) {
      alert(e?.message || "Error closing chat");
    }
  };

  return (
    <Paper
      sx={{
        p: 2,
        mx: { xs: 0, md: 2 },
        my: { xs: 2, md: 0 },

        borderRadius: 2,
        width: { xs: "100%", md: "50%" },
      }}
    >
      <Stack direction="row" alignItems="center" spacing={2}>
        <Box sx={{ minWidth: 0 }}>
          <Typography variant="h6" sx={{ ...ellipsisOneLine, maxWidth: 260 }}>
            {t?.user_details?.name || "-"}
          </Typography>
          <Typography
            variant="body2"
            color="text.secondary"
            sx={{ ...ellipsisOneLine, maxWidth: 260 }}
            title={t?.user_details?.email}
          >
            {t?.user_details?.email || "-"}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {t?.user_details?.phone || "-"}
          </Typography>
        </Box>
        <Box sx={{ flexGrow: 1 }} />

        <Button
          variant="contained"
          color="error"
          size="small"
          sx={{ ml: 1 }}
          onClick={() => setConfirmOpen(true)}
          disabled={!isOpen || status.toLowerCase() === "closed"}
        >
          Close Ticket
        </Button>
      </Stack>

      <Divider sx={{ my: 2 }} />

      <Stack spacing={1.2}>
        <Chip
          size="small"
          label={status || "-"}
          sx={{
            textTransform: "lowercase",
            bgcolor: isOpen ? "success.light" : "error.light",
            color: isOpen ? "success.dark" : "error.dark",
            fontWeight: 600,
          }}
        />
        <Avatar
          src={t.photo}
          alt={t?.user_details?.name || "User"}
          sx={{
            width: 64,
            height: 64,
            cursor: t.photo ? "pointer" : "default",
            border: t.photo ? "2px solid #ccc" : "none",
          }}
          onClick={() => t.photo && setPhotoPreviewOpen(true)}
        />

        <Row label="Ticket ID" value={t._id} mono />
        <Row label="User Type" value={t.user_type || "-"} />
        <Row
          label="Description"
          value={t.description || "-"}
          title={t.description}
        />
        <Row label="Created At" value={formatDateTime(t.createdAt)} />
        <Row label="Updated At" value={formatDateTime(t.updatedAt)} />
        <Row label="Messages" value={`${totalMsgs}`} />
        <Row label="Last Message" value={formatDateTime(lastMsgAt)} />
      </Stack>
      <Dialog open={confirmOpen} onClose={() => setConfirmOpen(false)}>
        <DialogTitle>Close chat?</DialogTitle>
        <DialogContent>
          <DialogContentText sx={{ mb: 2 }}>
            This will close the support ticket. Please add a resolution remark.
          </DialogContentText>
          <TextField
            autoFocus
            fullWidth
            label="Resolution remark"
            value={remark}
            onChange={(e) => setRemark(e.target.value)}
            multiline
            minRows={2}
            required
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setConfirmOpen(false)}>Cancel</Button>
          <Button
            color="error"
            variant="contained"
            onClick={handleCloseChat}
            disabled={!remark.trim()}
          >
            Confirm
          </Button>
        </DialogActions>
      </Dialog>
      <Dialog
        open={photoPreviewOpen}
        onClose={() => setPhotoPreviewOpen(false)}
        maxWidth="md"
      >
        <DialogTitle>Profile Photo</DialogTitle>
        <DialogContent>
          <Box
            component="img"
            src={t.photo}
            alt="Profile"
            sx={{
              width: "100%",
              height: "100%",
              borderRadius: 1,
            }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setPhotoPreviewOpen(false)}>Close</Button>
        </DialogActions>
      </Dialog>
    </Paper>
  );
};

const Row = ({ label, value, mono = false, oneLine = false, title }) => (
  <Stack direction="row" spacing={1}>
    <Typography variant="body2" color="text.secondary" sx={{ width: 120 }}>
      {label}
    </Typography>
    <Typography
      variant="body2"
      sx={{
        fontFamily: mono
          ? "ui-monospace, SFMono-Regular, Menlo, monospace"
          : undefined,
        ...(oneLine ? ellipsisOneLine : {}),
      }}
      title={title}
    >
      {value || "-"}
    </Typography>
  </Stack>
);

export default TicketDetails;
