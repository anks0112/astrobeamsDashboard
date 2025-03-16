import React, { useEffect } from "react";
import CardContainer from "../Components/DashboardComponents/CardContainer";
import UsersTableView from "../Components/Users/UsersTableView";
import { useDispatch, useSelector } from "react-redux";
import { fetchAllAstrologers } from "../redux/slices/fetchAllAstrologers";
import { fetchAllCustomers } from "../redux/slices/allUsers";
import AstrologersTableView from "../Components/AstroComponents/AstrologersTableView";

const Dashboard = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchAllAstrologers());
    dispatch(fetchAllCustomers());
  }, [dispatch]);

  const { users } = useSelector((state) => state.allUsers);
  const { astrologers } = useSelector((state) => state.allAstrologers);

  return (
    <div>
      <CardContainer />
      <UsersTableView users={users} />
      {astrologers && <AstrologersTableView astrologers={astrologers.data} />}
    </div>
  );
};

export default Dashboard;
