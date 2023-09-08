import React from "react";

const Cta = () => {
  return (
    <div className="mx-auto py-2 container sm:py-10 sm:px-6 lg:px-8">
      <div className="relative px-6 py-4 shadow-xl sm:rounded-3xl sm:px-10 sm:pb-0 sm:pt-10 md:px-12 lg:px-20 overflow-hidden">
        <div className="absolute -z-10 inset-0 bg-gray-100/60 mix-blend-multiply" />
        <div
          className="absolute -z-10 -left-80 -top-56 blur-3xl"
          aria-hidden="true"
        >
          <div
            className="aspect-[1097/845] w-[68.5625rem] bg-gradient-to-r from-[#ff4694] to-[#776fff] opacity-[0.15]"
            style={{
              clipPath:
                "polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)",
            }}
          />
        </div>
        <div
          className="hidden md:absolute -z-10 md:bottom-16 md:left-[50rem] md:block md:blur-3xl"
          aria-hidden="true"
        >
          <div
            className="aspect-[1097/845] w-[68.5625rem] bg-gradient-to-r from-[#ff4694] to-[#776fff] opacity-25"
            style={{
              clipPath:
                "polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)",
            }}
          />
        </div>

        <div className="w-full h-full aspect-[4/5] sm:aspect-[4/3] md:aspect-[16/12] lg:aspect-[16/8] xl:aspect-[16/6]">
          <iframe
            title="subscribe form"
            width="100%"
            height="100%"
            frameBorder="0"
            scrolling="auto"
            className="ml-auto mr-auto"
            src="https://9c5e3f47.sibforms.com/serve/MUIFAJH4Ss21x2Vq39WYH5Li4YI1zZTRozLQqSTXI6hhVM8i390RcE-nCkiFA5NQij67XvVbYeujjHLvR0xpUqyIap9VL8UfBV41rntukeYt2C9YfNc4yMMhHUKo1rXhpJNbLpHAso5mmgVNyxFFfwNQfduNWp-09nSf89bxqJBy5IWfN7CZnEuFtViPNkUN0P4AS2IHnNXWfnnK"
          ></iframe>
        </div>
      </div>
    </div>
  );
};

export default Cta;
