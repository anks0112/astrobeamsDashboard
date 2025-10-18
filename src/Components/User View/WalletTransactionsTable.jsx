import * as React from "react";
import { Box, Chip } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";

const WalletTransactionsTable = ({ rows }) => {
  const columns = [
    { field: "_id", headerName: "ID", flex: 1.5, minWidth: 180 },
    // { field: "user_id", headerName: "User ID", flex: 1.5, minWidth: 180 },
    {
      field: "amount",
      headerName: "Amount (₹)",
      flex: 0.6,
      minWidth: 100,
      renderCell: (params) => (
        <strong style={{ color: "#1976d2" }}>{params.row.amount}</strong>
      ),
    },
    {
      field: "type",
      headerName: "Type",
      flex: 0.5,
      minWidth: 100,
      renderCell: (params) => (
        <Chip
          label={params.value}
          color={params.value === "Credit" ? "success" : "error"}
          size="small"
        />
      ),
    },
    {
      field: "status",
      headerName: "Status",
      flex: 0.6,
      minWidth: 120,
      renderCell: (params) => {
        const color =
          params.value === "Completed"
            ? "success"
            : params.value === "Failed"
            ? "error"
            : "default";
        return <Chip label={params.value} color={color} size="small" />;
      },
    },
    {
      field: "interaction_id",
      headerName: "Interaction ID",
      flex: 1.3,
      minWidth: 150,
      renderCell: (params) => params.value || "—",
    },
    // {
    //   field: "receipt",
    //   headerName: "Receipt",
    //   flex: 1,
    //   minWidth: 100,
    //   renderCell: (params) =>
    //     params.value ? (
    //       <span style={{ color: "#1976d2", fontWeight: 500 }}>
    //         {params.value}
    //       </span>
    //     ) : (
    //       "—"
    //     ),
    // },
    {
      field: "createdAt",
      headerName: "Created At",
      flex: 0.8,
      minWidth: 160,
      valueGetter: (params) => {
        const raw = params;
        if (!raw) return "—";
        const date = new Date(raw);
        if (isNaN(date.getTime())) return "—";
        return date.toLocaleString("en-IN", {
          day: "2-digit",
          month: "short",
          year: "numeric",
          hour: "2-digit",
          minute: "2-digit",
        });
      },
    },
  ];

  // assign id for DataGrid
  const formattedRows = rows.map((row, i) => ({ id: i + 1, ...row }));

  return (
    <Box sx={{ height: 650, width: "100%", bgcolor: "background.paper", p: 2 }}>
      <DataGrid
        rows={formattedRows}
        columns={columns}
        disableColumnMenu
        disableRowSelectionOnClick
        density="comfortable"
        pageSize={10}
        rowsPerPageOptions={[10, 20, 50]}
      />
    </Box>
  );
};

export default WalletTransactionsTable;
