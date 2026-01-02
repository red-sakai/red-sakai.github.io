import { NavbarCapsule } from "./components/sections/NavbarCapsule";

const modelSrc = "/3d-models/low_poly_sun.glb";

export default function Home() {
  return (
    <main className="relative isolate min-h-screen w-full overflow-hidden bg-white text-[#0f172a]">
      <model-viewer
        src={modelSrc}
        alt="Low poly sun in motion"
        camera-controls
        auto-rotate
        disable-tap
        interaction-prompt="none"
        exposure="1"
        shadow-intensity="0"
        className="absolute inset-0 block h-full w-full"
        style={{
          background: "white",
          objectFit: "cover",
          transform: "translateX(12vw)",
          transformOrigin: "center",
        }}
      />

      <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-white via-white/92 to-white/0" aria-hidden />

      <div className="relative z-10 flex min-h-screen flex-col">
        <div className="flex w-full justify-center px-6 py-6 sm:px-10">
          <NavbarCapsule />
        </div>

        <div className="flex flex-1 flex-col gap-10 px-6 pb-12 sm:px-10 lg:flex-row lg:items-center lg:gap-16">
          <section className="flex-1 max-w-3xl space-y-4 lg:space-y-6">
            <p className="text-sm uppercase tracking-[0.35em] text-amber-600/90">Hi, I'm</p>
            <h1 className="text-4xl font-semibold leading-tight sm:text-5xl">
              Jhered Miguel Republica
            </h1>
            <p className="text-lg text-[#334155] sm:text-xl">
              A computer engineering student who is passionate about software development and cybersecurity.
            </p>
          </section>

          <div className="relative flex-1 min-h-[60vh] lg:min-h-[75vh]">
            <div className="absolute inset-0" aria-hidden />
          </div>
        </div>
      </div>
    </main>
  );
}
