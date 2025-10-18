import { useEffect, useState } from "react";
import { useParams } from "react-router";
import api from "../utils/api";
import { Box, CircularProgress, Typography } from "@mui/material";
import UserProfile from "../Components/User View/UserProfileCard ";
import WalletTransactionsTable from "../Components/User View/WalletTransactionsTable";

const CustomerView = () => {
  const { id } = useParams();

  const [user, setUser] = useState({});
  const [userLoading, setUserLoading] = useState(false);
  const [transactions, setTransactions] = useState([]);
  const [transLoading, setTransLoading] = useState(false);

  const fetchUser = async () => {
    try {
      setUserLoading(true);
      const response = await api.get(
        `/super_admin/backend/fetch_particular_customer/${id}`
      );
      setUser(response.data?.data || {});
    } catch (error) {
      console.error("Error fetching user:", error);
    } finally {
      setUserLoading(false);
    }
  };

  const fetchTransations = async () => {
    try {
      setTransLoading(true);
      setUserLoading(true);
      const response = await api.get(`/super_admin/backend/transaction/${id}`);
      setTransactions(response.data?.data || {});
    } catch (error) {
      console.error("Error fetching user:", error);
    } finally {
      setTransLoading(false);
    }
  };

  useEffect(() => {
    fetchUser();
    fetchTransations();
  }, [id]);

  if (userLoading || transLoading) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "60vh",
        }}
      >
        <CircularProgress color="warning" />
      </Box>
    );
  }

  return (
    <>
      <UserProfile user={user} />
      <Typography variant="h5" sx={{ m: 2, fontWeight: "bold" }}>
        Transactions
      </Typography>
      <WalletTransactionsTable rows={transactions} />
    </>
  );
};

export default CustomerView;
