import React from "react";
import { createBrowserRouter, RouterProvider, Outlet } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css"; // Import styles
import Navbar from "./Components/Navbar/Navbar";
import Astrologers from "./Pages/Astrologers";
import Users from "./Pages/Users";
import SupportTicket from "./Pages/SupportTicket";
import Banners from "./Pages/Banners";
import Sidebar from "./Components/Sidebar/Sidebar";
import Dashboard from "./Pages/Dashboard";
import Login from "./Pages/Login";
import Blog from "./Pages/Blog";
import "./Styles/global.css";
import BlogPageWrapper from "./Components/BlogPageComponents/BlogPageWrapper";
import AstrologerView from "./Pages/AstrologerView";
import Earnings from "./Pages/Earnings";
import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";

// ✅ Layout Component (Navbar, Sidebar & Dynamic Content)
const Layout = () => {
  return (
    <div className="main">
      <div className="navbar">
        <Navbar />
      </div>
      <div className="container">
        <div className="menuContainer">
          <Sidebar />
        </div>
        <div className="contentContainer">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

const ProtectedRoute = ({ children }) => {
  const { isLoggedIn } = useSelector((state) => state.authSlice);

  if (!isLoggedIn) {
    return <Navigate to="/" replace />;
  }

  return children;
};

// ✅ Define Routes
const router = createBrowserRouter([
  { path: "/", element: <Login /> },
  {
    path: "/",
    element: (
      <ProtectedRoute>
        <Layout />
      </ProtectedRoute>
    ),
    children: [
      { path: "/dashboard", element: <Dashboard /> },
      { path: "/astrologers", element: <Astrologers /> },
      { path: "/users", element: <Users /> },
      { path: "/earnings", element: <Earnings /> },
      { path: "/support-ticket", element: <SupportTicket /> },
      { path: "/banners", element: <Banners /> },
      { path: "/blog", element: <Blog /> },
      { path: "/blog-inner/:id", element: <BlogPageWrapper /> },
      { path: "/astrologer-view/:id", element: <AstrologerView /> },
    ],
  },
  // { path: "*", element: <NotFound /> },
]);

// ✅ Main App Component
const App = () => {
  return (
    <>
      <RouterProvider router={router} />
      <ToastContainer
        position="top-center"
        autoClose={4000}
        hideProgressBar
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        role="alert"
      />
    </>
  );
};

export default App;
