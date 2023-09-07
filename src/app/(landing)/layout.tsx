import React from "react";
import LandingNav from "@/components/landing/landing-nav";

const Layout = ({ children }) => {
  return (
    <div>
      <LandingNav />
      {children}
    </div>
  );
};

export default Layout;
