export function GridBackground() {
  return (
    <>
      <svg
        className="absolute inset-0 h-full w-full stroke-current -z-10 text-gray-200 dark:text-gray-700"
        style={{
          WebkitMaskImage:
            "radial-gradient(100% 100% at top right,white,transparent)",
          maskImage:
            "radial-gradient(100% 100% at top right,white,transparent)",
        }}
        aria-hidden="true"
      >
        <defs>
          <pattern
            id="1d4240dd-898f-445f-932d-e2872fd12de3"
            width="200"
            height="200"
            x="50%"
            y="0"
            patternUnits="userSpaceOnUse"
          >
            <path d="M.5 200V.5H200" fill="none"></path>
          </pattern>
        </defs>
        <svg x="50%" y="0" className="overflow-visible fill-primary opacity-20">
          <path
            d="M-200 0h201v201h-201Z M600 0h201v201h-201Z M-400 600h201v201h-201Z M200 800h201v201h-201Z"
            strokeWidth="0"
          ></path>
        </svg>
        <rect
          width="100%"
          height="100%"
          strokeWidth="0"
          fill="url(#1d4240dd-898f-445f-932d-e2872fd12de3)"
        ></rect>
      </svg>
      <div
        className="absolute inset-x-0 top-10 -z-10 flex justify-center overflow-hidden"
        aria-hidden="true"
        style={{
          transform:
            "transform: translate3d(var(--tw-translate-x), var(--tw-translate-y), 0) rotate(var(--tw-rotate)) skewX(var(--tw-skew-x)) skewY(var(--tw-skew-y)) scaleX(var(--tw-scale-x)) scaleY(var(--tw-scale-y))",
          filter:
            "blur(64px) var(--tw-brightness) var(--tw-contrast) var(--tw-grayscale) var(--tw-hue-rotate) var(--tw-invert) var(--tw-saturate) var(--tw-sepia) var(--tw-drop-shadow)",
        }}
      >
        <div
          className="aspect-[1108/632] w-[69.25rem] flex-none bg-gradient-to-r from-[#80caff] to-primary opacity-20"
          style={{
            clipPath:
              "polygon(73.6% 51.7%, 91.7% 11.8%, 100% 46.4%, 97.4% 82.2%, 92.5% 84.9%, 75.7% 64%, 55.3% 47.5%, 46.5% 49.4%, 45% 62.9%, 50.3% 87.2%, 21.3% 64.1%, 0.1% 100%, 5.4% 51.1%, 21.4% 63.9%, 58.9% 0.2%, 73.6% 51.7%)",
          }}
        ></div>
      </div>
    </>
  );
}
