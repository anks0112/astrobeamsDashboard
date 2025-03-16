import React, { useEffect, useState } from "react";
import { Box, Typography, MenuItem, Select } from "@mui/material";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import { useDispatch, useSelector } from "react-redux";
import { fetchAstrologerEarnings } from "../../redux/slices/earnings";

const EarningsTableView = () => {
  const [selectedYear, setSelectedYear] = useState("2024"); // Default Year
  const [selectedMonth, setSelectedMonth] = useState(""); // Default Empty
  const dispatch = useDispatch();
  // ✅ Fetch earnings data from Redux store
  const { earnings } = useSelector((state) => state.earnings);

  useEffect(() => {
    dispatch(fetchAstrologerEarnings());
  }, [dispatch]);

  const handleYearChange = (event) => {
    setSelectedYear(event.target.value);
  };

  const handleMonthChange = (event) => {
    setSelectedMonth(event.target.value);
  };

  // ✅ Years for Dropdown (Expands as Needed)
  const years = ["2024", "2025"];

  // ✅ Months for Dropdown (Mapped for Readability)
  const months = [
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
  ];

  const columns = [
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
      field: "email",
      headerName: "Email",
      flex: 1.5,
      minWidth: 200,
      align: "center",
      headerAlign: "center",
      renderCell: (params) => params.value || "N/A",
    },
    {
      field: "totalEarnings",
      headerName: "Total Earnings",
      flex: 1,
      minWidth: 150,
      align: "center",
      headerAlign: "center",
      renderCell: (params) =>
        params.value !== undefined ? `₹${params.value}/-` : "N/A",
    },
  ];

  // ✅ Filter earnings based on Selected Month & Year
  const selectedPeriod =
    selectedYear && selectedMonth ? `${selectedYear}-${selectedMonth}` : "";

  const rows =
    earnings?.map((astro) => {
      // ✅ Find the transaction matching the selected year & month
      const monthEarnings = astro.Transactions?.find(
        (t) => t.month === selectedPeriod
      );

      return {
        id: astro._id,
        name: astro.name || "N/A",
        phone: astro.phone || "N/A",
        email: astro.email || "N/A",
        totalEarnings: monthEarnings ? monthEarnings.totalAmount : "0",
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

        {/* ✅ Year & Month Selection Dropdowns */}
        <Box sx={{ display: "flex", gap: 2 }}>
          {/* Year Selection */}
          <Select
            value={selectedYear}
            onChange={handleYearChange}
            sx={{ minWidth: 100 }}
          >
            {years.map((year) => (
              <MenuItem key={year} value={year}>
                {year}
              </MenuItem>
            ))}
          </Select>

          {/* Month Selection */}
          <Select
            value={selectedMonth}
            onChange={handleMonthChange}
            displayEmpty
            sx={{ minWidth: 150 }}
          >
            <MenuItem value="" disabled>
              Select Month
            </MenuItem>
            {months.map((month) => (
              <MenuItem key={month.value} value={month.value}>
                {month.label}
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
          columns={columns}
          initialState={{ pagination: { paginationModel: { pageSize: 10 } } }}
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
