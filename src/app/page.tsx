import React from "react";
import Link from "next/link";

const Page = () => {
  return (
    <div className="flex flex-col justify-center items-center h-screen">
      <p className="text-8xl font-black text-primary">Chatbot Ai</p>

      <Link
        className={"px-10 py-4 text-lg border-2 hover:bg-secondary mt-10"}
        href="/auth"
      >
        Go to login
      </Link>
    </div>
  );
};

export default Page;
