"use client";
import React, { useState } from "react";

const testimonials = [
  "Really cool product helping companies automate internal documentation / support. Also very neat that you have GDPR compliance already at this early stage.",
  "This is the killer product! Super excited to see how it grows :) Congratulations and thanks for making and sharing with us.",
  "KBaseBot has transformed our customer service experience. The ease of use and time-saving features are unmatched.",
  "Training KBaseBot with our existing PDFs and DOCX files was a breeze. It's revolutionized our internal documentation process.",
  "Our lead generation has seen a significant boost since we started using KBaseBot. It's an essential tool for our business growth.",
  "Automating conversations with KBaseBot has not only improved our efficiency but also increased customer satisfaction.",
  "Embedding KBaseBot on our website was incredibly easy. It's user-friendly and has enhanced our customer interaction.",
  "The value offered by KBaseBot's free plan is impressive. It's a great starting point for businesses exploring chatbot solutions.",
  "Being able to view conversation logs in KBaseBot has provided valuable insights into our customer interactions.",
  "Managing our knowledge base has never been easier since we started using KBaseBot. It's intuitive and highly efficient.",
  "The customization options in KBaseBot are extensive. We've tailored it to fit our specific business needs perfectly.",
  "KBaseBot's scalable pricing plans are excellent. It's a tool that can grow alongside your business.",
];

const testimonialToRender = [...testimonials, ...testimonials];

const Testimonials = () => {
  const [scrollIndex, setScrollIndex] = useState(0);
  const ref = React.useRef<HTMLDivElement>(null);
  const [manualScroll, setManualScroll] = React.useState(false);

  React.useEffect(() => {
    if (ref.current && !manualScroll) {
      const rect = ref.current.children.item(scrollIndex)?.getBoundingClientRect();

      if (!rect) return;

      const left = rect.left;

      ref.current.scrollBy({
        left: left - ref.current.clientWidth / 2 + rect.width / 2,
        behavior: "smooth",
      });
    }
  }, [scrollIndex, manualScroll]);

  React.useEffect(() => {
    if (ref.current && !manualScroll) {
      // find the first item with left greater than half of the width
      const index =
        Array.from(ref.current.children).findIndex((child) => {
          const rect = child.getBoundingClientRect();
          return rect.left > ref.current!.clientWidth / 2;
        }) - 1;

      setScrollIndex(index === -1 ? 0 : index);

      const incrementScrollIndex = () => {
        setScrollIndex((prev) => {
          if (prev === testimonialToRender.length - 1) {
            return 0;
          }
          return prev + 1;
        });
      };

      const interval = setInterval(incrementScrollIndex, 5000);
      return () => {
        clearInterval(interval);
      };
    }
  }, [manualScroll]);

  return (
    <div id="testimonials" className="pt-12 sm:pt-24">
      <h1 className="text-4xl font-extrabold sm:text-center sm:text-6xl mb-12">Trusted by companies of all sizes</h1>
      <div className="testimonial">
        <div
          className="scroller"
          ref={ref}
          onTouchStart={() => setManualScroll(true)}
          onTouchEnd={() => setManualScroll(false)}
        >
          {testimonialToRender.map((testimonial, index) => (
            <div key={index} className="testimonial-item">
              <div className="testimonial-item__content">{testimonial}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Testimonials;
