import { NavbarCapsule } from "./components/sections/NavbarCapsule";
import { HouseScene3D } from "./components/sections/HouseScene3D";

export default function Home() {
  return (
    <main className="min-h-screen">
      <div className="relative min-h-[100svh]">
        <div className="absolute inset-0">
          <HouseScene3D
            className="h-[100svh] w-full"
            heightClassName="h-[100svh]"
            housePosition={[-2, -0.6, 7]}
            houseRotation={[0, Math.PI / 5, 0]}
            houseScale={1.3}
            cameraPosition={[9.52, 1.72, -3.27]}
          />
        </div>

        <div className="relative z-10 px-6 py-10">
          <div className="mx-auto flex w-full max-w-5xl justify-center">
            <NavbarCapsule />
          </div>
        </div>
      </div>
    </main>
  );
}
