import React, { useEffect } from "react";
import UsersTableView from "../Components/Users/UsersTableView";
import { useDispatch, useSelector } from "react-redux";
import { fetchAllCustomers } from "../redux/slices/allUsers";

const Users = () => {
  const dispatch = useDispatch();

  const { users, loading, error } = useSelector((state) => state.allUsers);
  console.log(users);

  useEffect(() => {
    dispatch(fetchAllCustomers());
  }, [dispatch]);

  return (
    <div>
      <UsersTableView users={users} />
    </div>
  );
};

export default Users;
