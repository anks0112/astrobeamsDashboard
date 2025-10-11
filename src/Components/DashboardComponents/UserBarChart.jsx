import React, { useMemo, useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";

const MONTHS = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

const UserBarChart = ({ apiData }) => {
  const [selectedYear, setSelectedYear] = useState("2025");

  console.log(apiData);

  // 🧮 Extract unique years from API data
  const years = [...new Set(apiData.map((item) => item.year))];

  // 🧾 Prepare data for selected year
  const filteredData = useMemo(() => {
    const yearData = apiData.filter((d) => d.year === selectedYear);

    // Map all 12 months; if not found, set total_users = 0
    const fullYearData = MONTHS.map((month) => {
      const match = yearData.find((d) => d.month === month);
      return {
        month,
        total_users: match ? match.total_users : 0,
      };
    });

    return fullYearData;
  }, [apiData, selectedYear]);

  const noData = filteredData.every((item) => item.total_users === 0);

  return (
    <div style={{ width: "100%", maxWidth: "100%", margin: "0 auto" }}>
      <h3 style={{ marginBottom: 10 }}>Monthly User Growth ({selectedYear})</h3>

      {/* 🔽 Year Filter */}
      <select
        value={selectedYear}
        onChange={(e) => setSelectedYear(e.target.value)}
        style={{
          padding: "8px 12px",
          borderRadius: "6px",
          marginBottom: "20px",
          border: "1px solid #ccc",
        }}
      >
        {years.map((year) => (
          <option key={year} value={year}>
            {year}
          </option>
        ))}
      </select>

      {/* 📊 Chart */}
      <div style={{ width: "100%", height: 400 }}>
        {noData ? (
          <div
            style={{
              height: 400,
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              color: "#999",
              fontSize: 18,
            }}
          >
            No data available for {selectedYear}
          </div>
        ) : (
          <ResponsiveContainer>
            <BarChart
              data={filteredData}
              margin={{ top: 20, right: 30, left: 0, bottom: 20 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#eee" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip
                cursor={{ fill: "rgba(255,198,49,0.1)" }}
                contentStyle={{
                  backgroundColor: "#fff",
                  borderRadius: "8px",
                  border: "1px solid #ddd",
                }}
              />
              <Legend />
              <defs>
                <linearGradient id="barColor" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#FFC631" stopOpacity={0.9} />
                  <stop offset="95%" stopColor="#8B1C1C" stopOpacity={0.8} />
                </linearGradient>
              </defs>
              <Bar
                dataKey="total_users"
                name="Total Users"
                fill="url(#barColor)"
                radius={[6, 6, 0, 0]}
                barSize={40}
              />
            </BarChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
};

export default UserBarChart;
