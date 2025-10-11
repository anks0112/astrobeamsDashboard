import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import CardContainer from "../Components/DashboardComponents/CardContainer";
import UsersTableView from "../Components/Users/UsersTableView";
import AstrologersTableView from "../Components/AstroComponents/AstrologersTableView";
import UserBarChart from "../Components/DashboardComponents/UserBarChart";

import { fetchAllAstrologers } from "../redux/slices/fetchAllAstrologers";
import { fetchAllCustomers } from "../redux/slices/allUsers";
import api from "../utils/api";

const Dashboard = () => {
  const dispatch = useDispatch();

  // ---------------------------------------------
  // ✅ State Management
  // ---------------------------------------------
  const [stats, setStats] = useState({});
  const [customerStats, setCustomerStats] = useState([]);
  const [loadingStats, setLoadingStats] = useState(true);
  const [loadingCustomers, setLoadingCustomers] = useState(true);

  const { users, loading: usersLoading } = useSelector(
    (state) => state.allUsers
  );
  const { astrologers, loading: astrologersLoading } = useSelector(
    (state) => state.allAstrologers
  );

  // ---------------------------------------------
  // ✅ Fetch Data on Mount
  // ---------------------------------------------
  useEffect(() => {
    dispatch(fetchAllAstrologers());
    dispatch(fetchAllCustomers());

    const fetchStats = async () => {
      try {
        setLoadingStats(true);
        const response = await api.get("/super_admin/backend/stats");
        setStats(response.data.data);
      } catch (error) {
        console.error("Error fetching stats:", error);
      } finally {
        setLoadingStats(false);
      }
    };

    const fetchCustomerStats = async () => {
      try {
        setLoadingCustomers(true);
        const response = await api.get(
          "/super_admin/backend/monthwise_onboarding_users"
        );
        setCustomerStats(response.data.data);
      } catch (error) {
        console.error("Error fetching customer stats:", error);
      } finally {
        setLoadingCustomers(false);
      }
    };

    fetchStats();
    fetchCustomerStats();
  }, [dispatch]);

  // ---------------------------------------------
  // ✅ Loading Placeholders
  // ---------------------------------------------
  const renderLoader = (text = "Loading...") => (
    <div
      style={{
        textAlign: "center",
        padding: "30px 0",
        fontSize: "16px",
        color: "#777",
      }}
    >
      {text}
    </div>
  );

  // ---------------------------------------------
  // ✅ Render
  // ---------------------------------------------
  return (
    <div style={{ width: "100%", padding: "20px" }}>
      {/* 📊 User Growth Chart */}
      {loadingCustomers ? (
        renderLoader("Loading user stats...")
      ) : (
        <UserBarChart apiData={customerStats || []} />
      )}

      {/* 📈 Overview Cards */}
      {loadingStats ? (
        renderLoader("Loading summary cards...")
      ) : (
        <CardContainer stats={stats} />
      )}

      {/* 👥 Users Table */}
      {usersLoading ? (
        renderLoader("Loading users...")
      ) : (
        <UsersTableView users={users} />
      )}

      {/* 🔮 Astrologers Table */}
      {astrologersLoading
        ? renderLoader("Loading astrologers...")
        : astrologers && (
            <AstrologersTableView astrologers={astrologers.data} />
          )}
    </div>
  );
};

export default Dashboard;
