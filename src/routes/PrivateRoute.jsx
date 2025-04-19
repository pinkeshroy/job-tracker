import React from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import { useSelector } from "react-redux";
import Layout from "../components/Layout.jsx";
import ViewJobs from "../pages/Jobs/ViewJobs.jsx";
import Dashboard from "../pages/Jobs/Dashboard.jsx";
import RecruiterDashboard from "../pages/Jobs/RecruiterDashboard.jsx";
import Unauthorized from "../pages/Unauthorized.jsx";

// Map of routes with role-based restrictions (null = open to all authenticated users)
export const protectedRoutesMap = Object.freeze({
  "/dashboard": { element: <Dashboard /> },
  "/jobs": { element: <ViewJobs /> },
  "/recruiter/dashboard": { element: <RecruiterDashboard /> }
});

const PrivateRoute = () => {
  const token = useSelector((state) => state.auth.token);

  return (
    <Routes>
      {Object.entries(protectedRoutesMap).map(([path, config]) => {
        const { element } = config;
        return (
          <Route
            key={path}
            path={path}
            element={token ? <Layout> {element} </Layout> : <Unauthorized/>}
          />
        );
      })}
    </Routes>
  );
};

export default PrivateRoute;
