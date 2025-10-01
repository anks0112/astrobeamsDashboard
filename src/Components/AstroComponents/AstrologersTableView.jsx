import React, { useMemo, useState } from "react";
import {
  Box,
  Button,
  IconButton,
  Switch,
  Typography,
  Chip,
} from "@mui/material";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Delete, Edit, RemoveRedEye } from "@mui/icons-material";
import AddAstrologerModal from "./AddAstrologerModal";
import DeleteConfirmationModal from "../DeleteConfirmationModal";
import { toast } from "react-toastify";
import api from "../../utils/api";
import EditAstrologerModal from "./EditAstrologerModal";

const AstrologersTableView = ({ astrologers }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const [modalOpen, setModalOpen] = useState(false);
  const [openModal, setOpenModal] = useState(false);
  const [selectedAstrologerId, setSelectedAstrologerId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [statusLoading, setStatusLoading] = useState({});

  // Map of full records
  const recordById = useMemo(() => {
    return (astrologers || []).reduce((acc, a) => {
      acc[a._id] = a;
      return acc;
    }, {});
  }, [astrologers]);

  // Local UI state for switches (optimistic)
  const [activeStates, setActiveStates] = useState(() =>
    (astrologers || []).reduce((acc, a) => {
      acc[a._id] = typeof a.status === "boolean" ? a.status : false;
      return acc;
    }, {})
  );

  const handleToggleStatus = async (id, currentStatus) => {
    const full = recordById[id];

    const requiredFields = [
      "_id",
      "status",
      "name",
      "profile_photo",
      "gender",
      "dob",
      "city",
      "bio",
      "experience",
      "expertise",
      "voice_call_price",
      "chat_price",
      "voice_call_offer_price",
      "chat_offer_price",
      "current_balance",
      "withdrawl_balance",
      "commission",
      "offer_id",
      "language",
      "featured",
      "aadhar",
      "pan",
      "passbook_photo",
    ];

    const payload = requiredFields.reduce((acc, key) => {
      acc[key] = full?.[key];
      return acc;
    }, {});

    payload._id = id;
    payload.status = !currentStatus;

    setStatusLoading((m) => ({ ...m, [id]: true }));
    setActiveStates((prev) => ({ ...prev, [id]: !currentStatus }));

    try {
      await api.patch("/super_admin/backend/update_astrologer", payload);
      toast.success("Status updated", {
        position: "top-center",
        autoClose: 1500,
      });
    } catch (err) {
      setActiveStates((prev) => ({ ...prev, [id]: currentStatus }));
      console.error(err);
      toast.error("Failed to update status", {
        position: "top-center",
        autoClose: 2000,
      });
    } finally {
      setStatusLoading((m) => ({ ...m, [id]: false }));
    }
  };

  const isDashboard = location.pathname === "/dashboard";

  const handleDelete = async () => {
    if (!selectedAstrologerId) {
      toast.error("No Astrologer selected for deletion!");
      return;
    }
    setLoading(true);
    try {
      const response = await api.post(
        "/super_admin/backend/delete_astrologer",
        { astrologerId: selectedAstrologerId },
        { headers: { "Content-Type": "application/json" } }
      );
      if (response.status === 200) {
        toast.success("Astrologer deleted successfully!", {
          position: "top-center",
          autoClose: 3000,
        });
        setOpenModal(false);
        window.location.reload();
      }
    } catch (error) {
      console.error("❌ Delete Error:", error);
      toast.error(error.msg || "Error deleting astrologer.", {
        position: "top-center",
        autoClose: 3000,
      });
      setOpenModal(false);
    } finally {
      setLoading(false);
    }
  };

  const filteredAstrologers =
    location.pathname === "/dashboard"
      ? (astrologers || []).filter((astro) => astro.is_active)
      : astrologers || [];

  const rows = filteredAstrologers.map((a) => ({
    id: a._id,
    name: a.name || "-",
    city: a.city || "-",
    phone: a.phone || "-",
    current_balance:
      typeof a.current_balance === "number"
        ? a.current_balance.toFixed(2)
        : "-",
    status:
      activeStates[a._id] ?? (typeof a.status === "boolean" ? a.status : false),
    is_busy: a.is_busy || false,
  }));

  const columns = [
    {
      field: "name",
      headerName: "Name",
      flex: 1,
      align: "center",
      headerAlign: "center",
    },
    {
      field: "astro_status",
      headerName: "Astrologer Status",
      flex: 1,
      align: "center",
      headerAlign: "center",
      sortable: false,
      renderCell: (params) => (
        <Chip
          label={params.row.is_busy ? "In Call" : "Available"}
          color={params.row.is_busy ? "error" : "success"}
          size="small"
        />
      ),
    },
    {
      field: "city",
      headerName: "City",
      flex: 1,
      align: "center",
      headerAlign: "center",
    },
    {
      field: "phone",
      headerName: "Phone",
      flex: 1,
      align: "center",
      headerAlign: "center",
    },
    {
      field: "status",
      headerName: "Status",
      flex: 0.7,
      align: "center",
      headerAlign: "center",
      sortable: false,
      renderCell: (params) => (
        <Switch
          checked={Boolean(params.row.status)}
          onChange={() =>
            handleToggleStatus(params.row.id, Boolean(params.row.status))
          }
          disabled={Boolean(statusLoading[params.row.id])}
          sx={{
            "& .MuiSwitch-switchBase.Mui-checked": { color: "#ff9800" },
            "& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track": {
              backgroundColor: "#ff9800",
            },
          }}
        />
      ),
    },
    {
      field: "current_balance",
      headerName: "Current Balance",
      flex: 1,
      align: "center",
      headerAlign: "center",
    },
  ];

  if (!isDashboard) {
    columns.push({
      field: "actions",
      headerName: "Action",
      width: 200,
      align: "center",
      headerAlign: "center",
      renderCell: (params) => (
        <Box sx={{ display: "flex", justifyContent: "center", width: "100%" }}>
          <Link to={`/astrologer-view/${params.row.id}`}>
            <IconButton size="small" sx={{ color: "#ff9800" }}>
              <RemoveRedEye />
            </IconButton>
          </Link>
          <IconButton
            size="small"
            sx={{ color: "#ff9800" }}
            onClick={() => {
              setSelectedAstrologerId(params.row.id);
              setOpenModal(true);
            }}
          >
            <Delete />
          </IconButton>
          <IconButton
            size="small"
            sx={{ color: "#ff9800" }}
            onClick={() => {
              setSelectedAstrologerId(params.row.id);
              setEditModalOpen(true);
            }}
          >
            <Edit />
          </IconButton>
        </Box>
      ),
    });
  }

  return (
    <Box sx={{ padding: "20px" }}>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "20px",
        }}
      >
        <Typography variant="h6" sx={{ fontWeight: "bold" }}>
          {location.pathname === "/dashboard"
            ? "Active Astrologers"
            : "Astrologers"}
        </Typography>

        {location.pathname !== "/dashboard" && (
          <Button
            variant="contained"
            sx={{ color: "white", backgroundColor: "#ff9800" }}
            onClick={() => setModalOpen(true)}
          >
            Add Astrologers
          </Button>
        )}
      </Box>

      <Box
        sx={{
          borderRadius: "10px",
          boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)",
          overflow: "hidden",
          backgroundColor: "#FEF2E7",
        }}
      >
        <DataGrid
          rows={rows}
          columns={columns}
          initialState={{ pagination: { paginationModel: { pageSize: 10 } } }}
          slots={{ toolbar: GridToolbar }}
          slotProps={{
            toolbar: {
              showQuickFilter: true,
              quickFilterProps: { debounceMs: 1000 },
            },
          }}
          pageSizeOptions={[10]}
          autoHeight
          disableRowSelectionOnClick
          disableColumnFilter
          disableDensitySelector
          disableColumnSelector
          sx={{
            "& .MuiDataGrid-root": { textAlign: "center" },
            "& .MuiDataGrid-columnHeader": {
              backgroundColor: "#FEF2E7",
              fontWeight: "bold",
              textAlign: "center",
            },
            "& .MuiDataGrid-cell": {
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              textAlign: "center",
            },
            "& .MuiDataGrid-toolbarContainer": {
              flexDirection: "row-reverse",
              margin: "10px",
            },
          }}
        />
      </Box>

      <AddAstrologerModal
        open={modalOpen}
        handleClose={() => setModalOpen(false)}
      />

      <DeleteConfirmationModal
        open={openModal}
        handleClose={() => setOpenModal(false)}
        handleConfirm={handleDelete}
        title="Delete Astrologer"
        message="Are you sure you want to delete this Astrologer? This action cannot be undone."
        loading={loading}
      />

      <EditAstrologerModal
        open={editModalOpen}
        handleClose={() => setEditModalOpen(false)}
        astrologerId={selectedAstrologerId}
      />
    </Box>
  );
};

export default AstrologersTableView;
