import { getTrips } from "@/lib/content";
import FilterableTrips from "./FilterableTrips";

export const metadata = {
  title: "Trips — LAZY TEAM",
  description: "Browse our collection of cycling adventures.",
};

export default async function TripsPage() {
  const trips = await getTrips();

  return (
    <div className="pt-40 pb-32 px-6">
      <div className="max-w-7xl mx-auto">
        <header className="mb-20">
          <h1 className="text-xs font-bold uppercase tracking-[0.2em] opacity-30 mb-6">Archive</h1>
          <h2 className="text-6xl md:text-8xl font-bold tracking-tighter mb-8 font-serif">Our Rides.</h2>
          <p className="max-w-2xl text-xl md:text-2xl opacity-50 tracking-tight leading-relaxed">
            From the high mountain passes of the Alps to the winding coastal roads of the Riviera. Every trip is a story.
          </p>
        </header>

        <FilterableTrips initialTrips={trips} />
      </div>
    </div>
  );
}
