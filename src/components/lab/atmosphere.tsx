export function Atmosphere() {
  return (
    <>
      <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
        <div
          className="bokeh h-[38rem] w-[38rem] -top-40 -left-32"
          style={{ background: "var(--iris-violet)" }}
        />
        <div
          className="bokeh h-[30rem] w-[30rem] top-1/3 -right-32"
          style={{ background: "var(--iris-teal)", animationDelay: "-6s" }}
        />
        <div
          className="bokeh h-[22rem] w-[22rem] bottom-0 left-1/3"
          style={{ background: "var(--iris-gold)", animationDelay: "-12s", opacity: 0.18 }}
        />
        <div
          className="bokeh h-[18rem] w-[18rem] top-1/4 left-1/2"
          style={{ background: "var(--iris-pink)", animationDelay: "-3s", opacity: 0.16 }}
        />
      </div>
      <div className="vignette-layer" />
      <div className="scanlines" />
      <div className="grain-layer" />
    </>
  );
}
