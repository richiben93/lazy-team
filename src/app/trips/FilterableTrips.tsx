"use client";

import { useState, useMemo } from "react";
import { Trip } from "@/types";
import TripCard from "@/components/trip/TripCard";
import { Search } from "lucide-react";

interface FilterableTripsProps {
  initialTrips: Trip[];
}

type SortOption = "newest" | "longest" | "elevation";

export default function FilterableTrips({ initialTrips }: FilterableTripsProps) {
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState<SortOption>("newest");
  const [selectedTag, setSelectedTag] = useState<string | null>(null);

  const tags = useMemo(() => {
    const allTags = initialTrips.flatMap((t) => t.tags);
    return Array.from(new Set(allTags)).sort();
  }, [initialTrips]);

  const filteredTrips = useMemo(() => {
    return initialTrips
      .filter((trip) => {
        const matchesSearch = trip.title.toLowerCase().includes(search.toLowerCase()) || 
                             trip.location.toLowerCase().includes(search.toLowerCase());
        const matchesTag = selectedTag ? trip.tags.includes(selectedTag) : true;
        return matchesSearch && matchesTag;
      })
      .sort((a, b) => {
        if (sortBy === "newest") return new Date(b.date).getTime() - new Date(a.date).getTime();
        if (sortBy === "longest") return b.stats.distance - a.stats.distance;
        if (sortBy === "elevation") return b.stats.elevationGain - a.stats.elevationGain;
        return 0;
      });
  }, [initialTrips, search, sortBy, selectedTag]);

  return (
    <div>
      <div className="flex flex-col md:flex-row gap-8 justify-between items-center mb-16 pb-8 border-b border-foreground/5">
        <div className="relative w-full md:w-96">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted" />
          <input
            type="text"
            placeholder="Search trips..."
            className="w-full pl-12 pr-4 py-4 bg-zinc-50 dark:bg-zinc-950 border border-foreground/5 rounded-2xl focus:outline-none focus:ring-1 focus:ring-foreground/20 text-sm"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <div className="flex flex-wrap gap-4 items-center justify-center">
          <div className="flex bg-zinc-50 dark:bg-zinc-950 p-1 rounded-xl border border-foreground/5">
            {(["newest", "longest", "elevation"] as SortOption[]).map((option) => (
              <button
                key={option}
                onClick={() => setSortBy(option)}
                className={`px-4 py-2 text-[10px] uppercase tracking-widest font-bold rounded-lg transition-colors ${
                  sortBy === option ? "bg-foreground text-background" : "hover:bg-foreground/5 text-secondary"
                }`}
              >
                {option}
              </button>
            ))}
          </div>

          <div className="h-8 w-px bg-foreground/5 hidden md:block" />

          <div className="flex flex-wrap gap-2 justify-center">
            <button
              onClick={() => setSelectedTag(null)}
              className={`px-4 py-2 text-[10px] uppercase tracking-widest font-bold rounded-full border transition-colors ${
                selectedTag === null ? "bg-foreground text-background border-foreground" : "border-foreground/20 text-secondary hover:text-foreground"
              }`}
            >
              All
            </button>
            {tags.map((tag) => (
              <button
                key={tag}
                onClick={() => setSelectedTag(tag)}
                className={`px-4 py-2 text-[10px] uppercase tracking-widest font-bold rounded-full border transition-colors ${
                  selectedTag === tag ? "bg-foreground text-background border-foreground" : "border-foreground/20 text-secondary hover:text-foreground"
                }`}
              >
                {tag}
              </button>
            ))}
          </div>
        </div>
      </div>

      {filteredTrips.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-12 gap-y-20">
          {filteredTrips.map((trip, i) => (
            <TripCard key={trip.slug} trip={trip} index={i} />
          ))}
        </div>
      ) : (
        <div className="py-40 text-center">
          <p className="text-xl text-muted">No trips found matching your criteria.</p>
        </div>
      )}
    </div>
  );
}
