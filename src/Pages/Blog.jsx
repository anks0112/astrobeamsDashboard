import React, { useEffect } from "react";
import BlogsTableView from "../Components/BlogPageComponents/BlogTableView";
import { Button } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { fetchBlogs } from "../redux/slices/allBlogs";

const Blog = () => {
  const dispatch = useDispatch();
  const { blogs, loading } = useSelector((state) => state.allBlogs);
  useEffect(() => {
    dispatch(fetchBlogs()); // Fetch blogs on mount
  }, [dispatch]);

  return (
    <div>
      <BlogsTableView blogs={blogs || []} />
    </div>
  );
};

export default Blog;
