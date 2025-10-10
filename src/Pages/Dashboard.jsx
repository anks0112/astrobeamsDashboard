import React, { useEffect, useState } from "react";
import CardContainer from "../Components/DashboardComponents/CardContainer";
import UsersTableView from "../Components/Users/UsersTableView";
import { useDispatch, useSelector } from "react-redux";
import { fetchAllAstrologers } from "../redux/slices/fetchAllAstrologers";
import { fetchAllCustomers } from "../redux/slices/allUsers";
import AstrologersTableView from "../Components/AstroComponents/AstrologersTableView";
import api from "../utils/api";

const Dashboard = () => {
  const dispatch = useDispatch();
  const [stats, setStats] = useState({});

  useEffect(() => {
    dispatch(fetchAllAstrologers());
    dispatch(fetchAllCustomers());

    const fetchStats = async () => {
      try {
        const response = await api.get("/super_admin/backend/stats");
        setStats(response.data.data);
      } catch (error) {
        console.error("Error fetching stats:", error);
      }
    };

    fetchStats();
  }, [dispatch]);

  console.log(stats);

  const { users } = useSelector((state) => state.allUsers);
  const { astrologers } = useSelector((state) => state.allAstrologers);

  return (
    <div>
      <CardContainer stats={stats} />
      <UsersTableView users={users} />
      {astrologers && <AstrologersTableView astrologers={astrologers.data} />}
    </div>
  );
};

export default Dashboard;
