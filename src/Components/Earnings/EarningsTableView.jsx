import React, { useEffect, useMemo, useState } from "react";
import { Box, Typography, MenuItem, Select } from "@mui/material";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import { useDispatch, useSelector } from "react-redux";
import { fetchAstrologerEarnings } from "../../redux/slices/earnings";

const EarningsTableView = () => {
  const dispatch = useDispatch();
  const { earnings } = useSelector((state) => state.earnings);

  const [selectedYear, setSelectedYear] = useState("");
  const [selectedMonth, setSelectedMonth] = useState("");

  useEffect(() => {
    dispatch(fetchAstrologerEarnings());
  }, [dispatch]);

  // formatters/helpers
  const inr = (v) => `₹${Number(v || 0).toLocaleString("en-IN")}/-`;
  const norm = (s) => (s || "").toString().trim();

  // gather all available YYYY-MM periods
  const allPeriods = useMemo(() => {
    return (earnings || [])
      .flatMap((a) => (a.Transactions || []).map((t) => norm(t.month)))
      .filter(Boolean);
  }, [earnings]);

  // auto-pick latest period once data arrives
  useEffect(() => {
    if (!selectedYear && !selectedMonth && allPeriods.length) {
      const latest = [...allPeriods].sort().at(-1); // "YYYY-MM"
      const [y, m] = latest.split("-");
      setSelectedYear(y);
      setSelectedMonth(m.padStart(2, "0"));
    }
  }, [allPeriods, selectedYear, selectedMonth]);

  const selectedPeriod =
    selectedYear && selectedMonth
      ? `${selectedYear}-${selectedMonth.padStart(2, "0")}`
      : "";

  const years = useMemo(() => {
    const ys = Array.from(
      new Set(allPeriods.map((p) => p.split("-")[0]))
    ).sort();
    return ys.length ? ys : ["2024", "2025"];
  }, [allPeriods]);

  const handleYearChange = (e) => setSelectedYear(e.target.value);
  const handleMonthChange = (e) => setSelectedMonth(e.target.value);

  // build rows: include both raw numbers (for any logic/export) and pre-formatted text for display
  const rows =
    (earnings || []).map((astro) => {
      const txs = (astro.Transactions || []).map((t) => ({
        ...t,
        month: norm(t.month),
      }));

      let monthEarnings = txs.find((t) => t.month === selectedPeriod);
      if (!monthEarnings && txs.length) {
        monthEarnings = [...txs]
          .sort((a, b) => a.month.localeCompare(b.month))
          .at(-1);
      }

      const m = monthEarnings || {
        month: selectedPeriod || "—",
        totalAmount: 0,
        commissionDeduction: 0,
        finalPayment: 0,
      };

      const total = Number(m.totalAmount ?? 0);
      const comm = Number(m.commissionDeduction ?? 0);
      const final = Number(m.finalPayment ?? 0);

      return {
        id: astro._id,
        name: astro.name ?? "N/A",
        phone: astro.phone ?? "N/A",
        month: m.month,

        // raw values (kept if you need them elsewhere)
        totalAmountRaw: total,
        commissionDeductionRaw: comm,
        finalPaymentRaw: final,

        // display strings used by the grid
        totalAmountText: inr(total),
        commissionDeductionText: inr(comm),
        finalPaymentText: inr(final),
      };
    }) || [];

  return (
    <Box sx={{ padding: "20px" }}>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 2,
        }}
      >
        <Typography variant="h6" sx={{ fontWeight: "bold" }}>
          Astrologers Monthly Earnings
        </Typography>

        <Box sx={{ display: "flex", gap: 2 }}>
          <Select
            value={selectedYear}
            onChange={handleYearChange}
            sx={{ minWidth: 100 }}
            displayEmpty
          >
            <MenuItem value="" disabled>
              Select Year
            </MenuItem>
            {years.map((year) => (
              <MenuItem key={year} value={year}>
                {year}
              </MenuItem>
            ))}
          </Select>

          <Select
            value={selectedMonth}
            onChange={handleMonthChange}
            sx={{ minWidth: 150 }}
            displayEmpty
            disabled={!selectedYear}
          >
            <MenuItem value="" disabled>
              Select Month
            </MenuItem>
            {[
              { label: "January", value: "01" },
              { label: "February", value: "02" },
              { label: "March", value: "03" },
              { label: "April", value: "04" },
              { label: "May", value: "05" },
              { label: "June", value: "06" },
              { label: "July", value: "07" },
              { label: "August", value: "08" },
              { label: "September", value: "09" },
              { label: "October", value: "10" },
              { label: "November", value: "11" },
              { label: "December", value: "12" },
            ].map((m) => (
              <MenuItem key={m.value} value={m.value}>
                {m.label}
              </MenuItem>
            ))}
          </Select>
        </Box>
      </Box>

      <Box
        sx={{
          borderRadius: "10px",
          boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)",
          backgroundColor: "#FEF2E7",
          overflow: "hidden",
        }}
      >
        <DataGrid
          rows={rows}
          // columns show pre-formatted text fields
          columns={[
            {
              field: "name",
              headerName: "Name",
              flex: 1.5,
              minWidth: 150,
              align: "center",
              headerAlign: "center",
            },
            {
              field: "phone",
              headerName: "Phone",
              flex: 1,
              minWidth: 150,
              align: "center",
              headerAlign: "center",
            },
            {
              field: "month",
              headerName: "Month",
              flex: 0.8,
              minWidth: 120,
              align: "center",
              headerAlign: "center",
            },

            {
              field: "totalAmountText",
              headerName: "Total Amount",
              flex: 1,
              minWidth: 150,
              align: "center",
              headerAlign: "center",
            },
            {
              field: "commissionDeductionText",
              headerName: "Commission Deduction",
              flex: 1.2,
              minWidth: 180,
              align: "center",
              headerAlign: "center",
            },
            {
              field: "finalPaymentText",
              headerName: "Final Payment",
              flex: 1,
              minWidth: 150,
              align: "center",
              headerAlign: "center",
            },
          ]}
          getRowId={(r) => r.id}
          initialState={{ pagination: { paginationModel: { pageSize: 10 } } }}
          slots={{ toolbar: GridToolbar }}
          slotProps={{
            toolbar: {
              showQuickFilter: true,
              quickFilterProps: { debounceMs: 1000 },
            },
          }}
          pageSizeOptions={[10]}
          disableRowSelectionOnClick
          disableColumnFilter
          disableDensitySelector
          disableColumnSelector
          sx={{
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
    </Box>
  );
};

export default EarningsTableView;
