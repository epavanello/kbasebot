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
      <Script
        id="plausible"
        defer
        data-domain="kbasebot.com"
        src="https://plausible.emadev.co/js/script.js"
      ></Script>
      <Script id="plausible-function" type="text/javascript">
        {`window.plausible = window.plausible || function() { (window.plausible.q = window.plausible.q || []).push(arguments) }`}
      </Script>
      <Script id="clarity-ms" type="text/javascript">
        {`(function(c,l,a,r,i,t,y){
            c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
            t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
            y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
        })(window, document, "clarity", "script", "ixk349l6vh");`}
      </Script>
    </>
  );
};

export default Analytics;
