import { getTrips, getMembers } from "@/lib/content";
import FilterableTrips from "./FilterableTrips";

export const metadata = {
  title: "Viaggi — LAZY TEAM",
  description: "Sfoglia la nostra collezione di avventure in bicicletta.",
};

export default async function TripsPage() {
  const trips = await getTrips();
  const members = await getMembers();

  return (
    <div className="pt-40 pb-32 px-6">
      <div className="max-w-7xl mx-auto">
        <header className="mb-20">
          <h1 className="text-xs font-bold uppercase tracking-[0.2em] text-muted mb-6">Archivio</h1>
          <h2 className="text-6xl md:text-8xl font-bold tracking-tighter mb-8 font-serif">I nostri viaggi.</h2>
          <p className="max-w-2xl text-xl md:text-2xl text-secondary tracking-tight leading-relaxed">
            Dai passi alpini alle strade costiere della riviera. Ogni viaggio è una storia.
          </p>
        </header>

        <FilterableTrips initialTrips={trips} members={members} />
      </div>
    </div>
  );
}
