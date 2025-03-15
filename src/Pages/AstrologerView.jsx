import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useParams } from "react-router";
import AstrologerProfile from "../Components/AstrologerView/AstrologerProfile";
import AstrologerDetails from "../Components/AstrologerView/AstrologerDetails";
import AstrologerDocuments from "../Components/AstrologerView/AstrologerDocuments";
import AstrologerPricingStatus from "../Components/AstrologerView/AstrologerPricingStatus";
import AstrologerSessionsTable from "../Components/AstrologerView/AstrologerSessionsTable";
import { cleanFilterItem } from "@mui/x-data-grid/hooks/features/filter/gridFilterUtils";
import api from "../utils/api";

const AstrologerView = () => {
  const { id } = useParams();
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSessions = async () => {
      try {
        const response = await api.post(
          "/super_admin/backend/fetch_astrologer_orders",
          {
            astrologerId: id,
          }
        );
        setSessions(response.data.data || []);
      } catch (error) {
        console.error("Error fetching astrologer orders:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchSessions();
  }, [id]);

  const { astrologers, error } = useSelector((state) => state.allAstrologers);

  const astrologer = astrologers.data.find((a) => a._id === id);

  return (
    <div>
      {astrologer && <AstrologerProfile astrologer={astrologer} />}
      {astrologer && <AstrologerDetails astrologer={astrologer} />}
      {astrologer && <AstrologerDocuments astrologer={astrologer} />}
      {astrologer && <AstrologerPricingStatus astrologer={astrologer} />}
      {astrologer && <AstrologerSessionsTable sessions={sessions} />}
    </div>
  );
};

export default AstrologerView;
