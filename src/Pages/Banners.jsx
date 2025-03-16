import React, { useEffect, useState } from "react";
import BannersTableView from "../Components/Banners/BannersTableView";
import { useDispatch, useSelector } from "react-redux";
import { fetchBanners } from "../redux/slices/allBanners";

const Banners = () => {
  const dispatch = useDispatch();

  const { banners } = useSelector((state) => state.allBanners);

  useEffect(() => {
    dispatch(fetchBanners());
  }, []);

  return (
    <div>
      <BannersTableView banners={banners} />
    </div>
  );
};

export default Banners;
