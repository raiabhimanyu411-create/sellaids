// src/components/admindashboard/Layout.js

import React from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";
import Header from "./Header";
// import { useSessionChecker } from "./useSessionChecker";

const Layout = () => {
//   useSessionChecker()
  return (
    <div className="flex min-h-screen bg-gray-100">
      <Sidebar />
      <div className="ml-64 flex-1 flex flex-col">
        <Header />
        <main className="p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default Layout;
