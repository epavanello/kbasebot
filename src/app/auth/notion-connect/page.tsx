"use client";
import React, { useEffect } from "react";
import { useSearchParams } from "next/navigation";

const Page = () => {
  const searchParams = useSearchParams();
  const code = searchParams.get("code");

  useEffect(() => {
    if (code) {
      window.opener.postMessage({ "notion-code": code }, "*");
      window.close();
    }
  }, [code]);

  return (
    <div className="h-screen w-full flex justify-center items-center">
      <p className="text-3xl font-bold text-primary">Connecting to Notion...</p>
    </div>
  );
};

export default Page;
