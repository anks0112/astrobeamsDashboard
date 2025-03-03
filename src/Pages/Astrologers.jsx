import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

import { fetchAllAstrologers } from "../redux/slices/fetchAllAstrologers";
import AstrologersTableView from "../Components/AstroComponents/AstrologersTableView";

const Astrologers = () => {
  const dispatch = useDispatch();

  const { astrologers, loading, error } = useSelector(
    (state) => state.allAstrologers
  );

  // console.log(astrologers);

  useEffect(() => {
    dispatch(fetchAllAstrologers());
  }, []);

  return (
    <>
      {astrologers && (
        <AstrologersTableView astrologers={astrologers.data || []} />
      )}
    </>
  );
};

export default Astrologers;
