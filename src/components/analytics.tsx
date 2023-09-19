"use client";
import React from "react";
import Script from "next/script";

const GA_MEASUREMENT_ID = "G-RC26S8911V";

const Analytics = () => {
  return (
    <>
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`}
      />
      <Script id="google-analytics">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
 
          gtag('config', '${GA_MEASUREMENT_ID}');
        `}
      </Script>
      <script
        defer
        data-domain="kbasebot.com"
        src="https://kbase-plausible.toc.ink/js/script.js"
      ></script>
    </>
  );
};

export default Analytics;
