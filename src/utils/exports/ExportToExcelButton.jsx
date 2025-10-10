import React from "react";
import { Button } from "@mui/material";
import * as XLSX from "xlsx";

const ExportToExcelButton = ({ rows }) => {
  const handleExportToExcel = () => {
    // Prepare formatted data
    const formatted = rows.map((r) => ({
      Name: r.name,
      Phone: r.phone || "",
      Email: r.email || "",
      Gender: r.gender || "",
      "Date of Birth": r.dob ? new Date(r.dob).toLocaleDateString("en-GB") : "",
      Balance: r.balance || "0",
      "Joined On": r.createdAt
        ? new Date(r.createdAt).toLocaleDateString("en-GB")
        : "",
    }));

    // Create worksheet
    const ws = XLSX.utils.json_to_sheet(formatted);

    // ✅ Mark the phone column as text to preserve format (no apostrophes shown)
    const phoneCol = Object.keys(formatted[0]).indexOf("Phone");
    const range = XLSX.utils.decode_range(ws["!ref"]);
    for (let row = range.s.r + 1; row <= range.e.r; row++) {
      const cellAddress = XLSX.utils.encode_cell({ r: row, c: phoneCol });
      const cell = ws[cellAddress];
      if (cell && cell.v) cell.t = "s"; // force string type
    }

    // Create and download Excel
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Users");
    XLSX.writeFile(wb, "Users.xlsx");
  };

  return (
    <Button
      variant="contained"
      size="small"
      sx={{
        backgroundColor: "#FF7300",
        color: "#fff",
        fontWeight: "bold",
        "&:hover": { backgroundColor: "#e86900" },
      }}
      onClick={handleExportToExcel}
    >
      Export to Excel
    </Button>
  );
};

export default ExportToExcelButton;
