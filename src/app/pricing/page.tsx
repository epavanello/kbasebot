"use client";

import React from "react";
import PricingTable from "./pricing-table";

const Page = () => {
  return (
    <div className="mx-auto max-w-7xl px-6 lg:px-8  h-[100vh] flex flex-col justify-center items-center">
      <div className="flex justify-center w-full items-center">
        <PricingTable />
      </div>
    </div>
  );
};

export default Page;
