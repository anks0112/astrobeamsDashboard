import React, { useEffect } from "react";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import BlogLayout from "./BlogLayout";
import { CircularProgress, Typography, Container } from "@mui/material";

const BlogPageWrapper = () => {
  const { id } = useParams(); // Get blog ID from URL
  const dispatch = useDispatch();
  const { blogs, loading, error } = useSelector((state) => state.allBlogs);

  const blog = blogs.find((b) => b._id === id);

  return (
    <BlogLayout
      title={blog?.title || ""}
      body={blog?.description || ""}
      image={blog?.photo || ""}
    />
  );
};

export default BlogPageWrapper;
