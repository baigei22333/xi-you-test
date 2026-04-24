export function CloudBackdrop() {
  return (
    <div
      className="pointer-events-none fixed inset-0 -z-10 overflow-hidden"
      aria-hidden
    >
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_20%_0%,rgba(244,213,141,0.12),transparent_55%),radial-gradient(ellipse_at_80%_10%,rgba(124,196,255,0.1),transparent_50%),radial-gradient(ellipse_at_50%_100%,rgba(196,92,72,0.08),transparent_45%)]" />
      <svg
        className="absolute -top-24 left-1/2 h-[420px] w-[1400px] -translate-x-1/2 opacity-[0.14]"
        viewBox="0 0 1200 200"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M40 140C80 100 120 90 180 100C220 60 300 50 360 90C420 50 520 60 580 100C640 70 720 80 780 120C860 80 940 90 1000 130C1060 100 1120 110 1160 140"
          stroke="currentColor"
          strokeWidth="3"
          className="text-[#f4d58d]"
        />
        <path
          d="M0 170C120 130 200 150 320 160C440 120 560 140 720 165C840 140 960 155 1200 175"
          stroke="currentColor"
          strokeWidth="2"
          className="text-[#9cb4d6]"
          opacity="0.6"
        />
      </svg>
    </div>
  );
}
