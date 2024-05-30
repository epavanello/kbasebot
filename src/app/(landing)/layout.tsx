import React from "react";
import LandingNav from "@/components/landing/landing-nav";
import { Footer } from "@/components/landing/footer";

const Layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="flex h-full flex-col">
      <LandingNav />
      <div className="flex-1">{children}</div>
      <Footer />
    </div>
  );
};

export default Layout;
