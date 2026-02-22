// src/pages/Luxury.js
import React from "react";
import { useLocation } from "react-router-dom";
import Fashionaids from "../components/aids/Fashionaids";
import Designeraids from "../components/aids/Designeraids";
import Kidsaids from "../components/aids/Kidsaids";

const Luxury = () => {
  const location = useLocation();
  const path = location.pathname.toLowerCase();

  return (
    <div>
      {path.includes("fashionaids") && <Fashionaids />}
      {path.includes("designeraids") && <Designeraids />}
      {path.includes("kidsaids") && <Kidsaids />}
    </div>
  );
};

export default Luxury;
