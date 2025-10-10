import React from "react";
import { Button } from "@mui/material";
import * as XLSX from "xlsx";

const ExportEarningsToExcelButton = ({ rows }) => {
  const handleExportToExcel = () => {
    const formatted = rows.map((r) => ({
      Name: r.name,
      Phone: r.phone || "",
      Month: r.month || "",
      "Total Amount": r.totalAmountRaw ?? 0,
      "Commission Deduction": r.commissionDeductionRaw ?? 0,
      "TDS (10%)": r.tdsRaw ?? 0,
      "Net Payable": r.netPayableRaw ?? 0,
    }));

    // Create worksheet
    const ws = XLSX.utils.json_to_sheet(formatted);

    // --- ✅ Fix cell types ---
    const range = XLSX.utils.decode_range(ws["!ref"]);
    const keys = Object.keys(formatted[0]);
    const phoneCol = keys.indexOf("Phone");
    const numericCols = [
      "Total Amount",
      "Commission Deduction",
      "TDS (10%)",
      "Net Payable",
    ].map((k) => keys.indexOf(k));

    for (let r = range.s.r + 1; r <= range.e.r; r++) {
      // Force phone column to string
      if (phoneCol >= 0) {
        const addr = XLSX.utils.encode_cell({ r, c: phoneCol });
        if (ws[addr]) ws[addr].t = "s";
      }
      // Force numeric columns to number type
      numericCols.forEach((c) => {
        const addr = XLSX.utils.encode_cell({ r, c });
        if (ws[addr]) ws[addr].t = "n";
      });
    }

    // --- ✅ Add proper currency format (₹) ---
    numericCols.forEach((c) => {
      for (let r = range.s.r + 1; r <= range.e.r; r++) {
        const addr = XLSX.utils.encode_cell({ r, c });
        if (ws[addr]) ws[addr].z = "₹#,##0.00";
      }
    });

    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Earnings");
    XLSX.writeFile(wb, "Earnings.xlsx");
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

export default ExportEarningsToExcelButton;
