"use client";

import { useState, useMemo } from "react";
import { Trip, Member, TripType, TerrainType } from "@/types";
import TripCard from "@/components/trip/TripCard";
import { Search, Filter, X } from "lucide-react";

interface FilterableTripsProps {
  initialTrips: Trip[];
  members: Member[];
}

type SortOption = "newest" | "longest" | "elevation";

const SORT_LABELS: Record<SortOption, string> = {
  newest: "Recenti",
  longest: "Distanza",
  elevation: "Dislivello",
};

const TRIP_TYPES: Array<{ value: TripType; label: string; emoji: string }> = [
  { value: 'one-day', label: 'Giornata', emoji: '☀️' },
  { value: 'overnight', label: 'Pernottamento', emoji: '🌙' },
  { value: 'multi-day', label: 'Più giorni', emoji: '🏕️' },
];

const TERRAIN_TYPES: Array<{ value: TerrainType; label: string; emoji: string }> = [
  { value: 'road', label: 'Strada', emoji: '🛣️' },
  { value: 'gravel', label: 'Gravel', emoji: '🪨' },
  { value: 'mtb', label: 'MTB', emoji: '⛰️' },
  { value: 'mixed', label: 'Misto', emoji: '🔀' },
];

export default function FilterableTrips({ initialTrips, members }: FilterableTripsProps) {
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState<SortOption>("newest");
  const [selectedTag, setSelectedTag] = useState<string | null>(null);
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);
  
  // Advanced filters
  const [selectedAuthors, setSelectedAuthors] = useState<string[]>([]);
  const [selectedTypes, setSelectedTypes] = useState<TripType[]>([]);
  const [selectedTerrains, setSelectedTerrainTypes] = useState<TerrainType[]>([]);
  const [distanceFilter, setDistanceFilter] = useState<'all' | '<100' | '100-300' | '300-500' | '>500'>('all');
  const [elevationFilter, setElevationFilter] = useState<'all' | '<1000' | '1000-3000' | '3000-5000' | '>5000'>('all');

  const tags = useMemo(() => {
    const allTags = initialTrips.flatMap((t) => t.tags);
    return Array.from(new Set(allTags)).sort();
  }, [initialTrips]);

  const memberMap = useMemo(() => {
    return members.reduce((acc, member) => {
      acc[member.slug] = member;
      return acc;
    }, {} as Record<string, Member>);
  }, [members]);

  const availableAuthors = useMemo(() => {
    const uniqueAuthors = Array.from(new Set(initialTrips.map(t => t.author)));
    return uniqueAuthors
      .map(slug => memberMap[slug])
      .filter(Boolean);
  }, [initialTrips, memberMap]);

  const filteredTrips = useMemo(() => {
    return initialTrips
      .filter((trip) => {
        const matchesSearch = trip.title.toLowerCase().includes(search.toLowerCase()) || 
                             trip.location.toLowerCase().includes(search.toLowerCase());
        const matchesTag = selectedTag ? trip.tags.includes(selectedTag) : true;
        const matchesAuthor = selectedAuthors.length === 0 || selectedAuthors.includes(trip.author);
        const matchesType = selectedTypes.length === 0 || selectedTypes.includes(trip.type);
        const matchesTerrain = selectedTerrains.length === 0 || selectedTerrains.includes(trip.terrain);
        
        let matchesDistance = true;
        if (distanceFilter !== 'all') {
          const distanceKm = trip.stats.distance / 1000;
          if (distanceFilter === '<100') matchesDistance = distanceKm < 100;
          else if (distanceFilter === '100-300') matchesDistance = distanceKm >= 100 && distanceKm < 300;
          else if (distanceFilter === '300-500') matchesDistance = distanceKm >= 300 && distanceKm < 500;
          else if (distanceFilter === '>500') matchesDistance = distanceKm >= 500;
        }
        
        let matchesElevation = true;
        if (elevationFilter !== 'all') {
          const elevation = trip.stats.elevationGain;
          if (elevationFilter === '<1000') matchesElevation = elevation < 1000;
          else if (elevationFilter === '1000-3000') matchesElevation = elevation >= 1000 && elevation < 3000;
          else if (elevationFilter === '3000-5000') matchesElevation = elevation >= 3000 && elevation < 5000;
          else if (elevationFilter === '>5000') matchesElevation = elevation >= 5000;
        }
        
        return matchesSearch && matchesTag && matchesAuthor && matchesType && matchesTerrain && matchesDistance && matchesElevation;
      })
      .sort((a, b) => {
        if (sortBy === "newest") return new Date(b.date).getTime() - new Date(a.date).getTime();
        if (sortBy === "longest") return b.stats.distance - a.stats.distance;
        if (sortBy === "elevation") return b.stats.elevationGain - a.stats.elevationGain;
        return 0;
      });
  }, [initialTrips, search, sortBy, selectedTag, selectedAuthors, selectedTypes, selectedTerrains, distanceFilter, elevationFilter]);

  const toggleAuthor = (slug: string) => {
    setSelectedAuthors(prev => 
      prev.includes(slug) ? prev.filter(s => s !== slug) : [...prev, slug]
    );
  };

  const toggleType = (type: TripType) => {
    setSelectedTypes(prev => 
      prev.includes(type) ? prev.filter(t => t !== type) : [...prev, type]
    );
  };

  const toggleTerrain = (terrain: TerrainType) => {
    setSelectedTerrainTypes(prev => 
      prev.includes(terrain) ? prev.filter(t => t !== terrain) : [...prev, terrain]
    );
  };

  const clearAdvancedFilters = () => {
    setSelectedAuthors([]);
    setSelectedTypes([]);
    setSelectedTerrainTypes([]);
    setDistanceFilter('all');
    setElevationFilter('all');
  };

  const hasAdvancedFilters = selectedAuthors.length > 0 || selectedTypes.length > 0 || 
                             selectedTerrains.length > 0 || distanceFilter !== 'all' || elevationFilter !== 'all';

  return (
    <div>
      <div className="flex flex-col gap-8 mb-16 pb-8 border-b border-foreground/5">
        {/* Search and Sort */}
        <div className="flex flex-col md:flex-row gap-4 justify-between items-center">
          <div className="relative w-full md:w-96">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted" />
            <input
              type="text"
              placeholder="Cerca viaggi..."
              className="w-full pl-12 pr-4 py-4 bg-zinc-50 dark:bg-zinc-950 border border-foreground/5 rounded-2xl focus:outline-none focus:ring-1 focus:ring-foreground/20 text-sm"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <div className="flex gap-4 items-center">
            <div className="flex bg-zinc-50 dark:bg-zinc-950 p-1 rounded-xl border border-foreground/5 overflow-x-auto">
              {(["newest", "longest", "elevation"] as SortOption[]).map((option) => (
                <button
                  key={option}
                  onClick={() => setSortBy(option)}
                  className={`px-4 py-2 text-xs uppercase tracking-widest font-bold rounded-lg transition-colors whitespace-nowrap ${
                    sortBy === option ? "bg-foreground text-background" : "hover:bg-foreground/5 text-secondary"
                  }`}
                >
                  {SORT_LABELS[option]}
                </button>
              ))}
            </div>

            <button
              onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
              className={`p-3 rounded-xl transition-colors flex-shrink-0 ${
                showAdvancedFilters ? 'bg-blue-600 text-white' : 'bg-zinc-50 dark:bg-zinc-950 border border-foreground/5 hover:bg-zinc-100'
              }`}
              aria-label={showAdvancedFilters ? "Chiudi filtri" : "Apri filtri avanzati"}
            >
              {showAdvancedFilters ? <X className="w-4 h-4" /> : <Filter className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {/* Tags - horizontal scroll on mobile */}
        <div className="flex gap-2 overflow-x-auto pb-2 -mx-2 px-2 scrollbar-hide">
          <button
            onClick={() => setSelectedTag(null)}
            className={`px-4 py-2 text-xs uppercase tracking-widest font-bold rounded-full border transition-colors whitespace-nowrap flex-shrink-0 ${
              selectedTag === null ? "bg-foreground text-background border-foreground" : "border-foreground/20 text-secondary hover:text-foreground"
            }`}
          >
            Tutti
          </button>
          {tags.map((tag) => (
            <button
              key={tag}
              onClick={() => setSelectedTag(tag)}
              className={`px-4 py-2 text-xs uppercase tracking-widest font-bold rounded-full border transition-colors whitespace-nowrap flex-shrink-0 ${
                selectedTag === tag ? "bg-foreground text-background border-foreground" : "border-foreground/20 text-secondary hover:text-foreground"
              }`}
            >
              {tag}
            </button>
          ))}
        </div>

        {/* Advanced Filters */}
        {showAdvancedFilters && (
          <div className="bg-zinc-50 dark:bg-zinc-950 rounded-2xl p-6 space-y-6 border border-foreground/5">
            <div className="flex justify-between items-center">
              <h3 className="text-xs font-bold uppercase tracking-widest text-muted">Filtri avanzati</h3>
              {hasAdvancedFilters && (
                <button
                  onClick={clearAdvancedFilters}
                  className="text-xs font-bold text-red-600 hover:text-red-700 flex items-center gap-1"
                >
                  <X className="w-3 h-3" />
                  Rimuovi
                </button>
              )}
            </div>

            {/* Lazer Filter */}
            <div>
              <h4 className="text-xs font-bold text-muted mb-2">Lazer</h4>
              <div className="flex flex-wrap gap-2">
                {availableAuthors.map(author => (
                  <button
                    key={author.slug}
                    onClick={() => toggleAuthor(author.slug)}
                    className={`px-3 py-2 rounded-lg text-sm transition-all ${
                      selectedAuthors.includes(author.slug)
                        ? 'bg-black text-white'
                        : 'bg-white dark:bg-zinc-900 text-black dark:text-white hover:bg-gray-200 dark:hover:bg-zinc-800'
                    }`}
                  >
                    <span className="mr-1">{author.emoji}</span>
                    {author.nickname || author.name}
                  </button>
                ))}
              </div>
            </div>

            {/* Duration Filter */}
            <div>
              <h4 className="text-xs font-bold text-muted mb-2">Durata</h4>
              <div className="flex flex-wrap gap-2">
                {TRIP_TYPES.map(type => (
                  <button
                    key={type.value}
                    onClick={() => toggleType(type.value)}
                    className={`px-3 py-2 rounded-lg text-sm transition-all ${
                      selectedTypes.includes(type.value)
                        ? 'bg-blue-600 text-white'
                        : 'bg-white dark:bg-zinc-900 hover:bg-gray-200 dark:hover:bg-zinc-800'
                    }`}
                  >
                    <span className="mr-1">{type.emoji}</span>
                    {type.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Terrain Filter */}
            <div>
              <h4 className="text-xs font-bold text-muted mb-2">Terreno</h4>
              <div className="flex flex-wrap gap-2">
                {TERRAIN_TYPES.map(terrain => (
                  <button
                    key={terrain.value}
                    onClick={() => toggleTerrain(terrain.value)}
                    className={`px-3 py-2 rounded-lg text-sm transition-all ${
                      selectedTerrains.includes(terrain.value)
                        ? 'bg-green-600 text-white'
                        : 'bg-white dark:bg-zinc-900 hover:bg-gray-200 dark:hover:bg-zinc-800'
                    }`}
                  >
                    <span className="mr-1">{terrain.emoji}</span>
                    {terrain.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Distance and Elevation Filters */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="text-xs font-bold text-muted mb-2">Distanza</h4>
                <div className="flex flex-wrap gap-2">
                  {(['<100', '100-300', '300-500', '>500'] as const).map(range => (
                    <button
                      key={range}
                      onClick={() => setDistanceFilter(distanceFilter === range ? 'all' : range)}
                      className={`px-3 py-2 rounded-lg text-xs transition-all ${
                        distanceFilter === range
                          ? 'bg-yellow-600 text-white'
                          : 'bg-white dark:bg-zinc-900 hover:bg-gray-200 dark:hover:bg-zinc-800'
                      }`}
                    >
                      {range}km
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <h4 className="text-xs font-bold text-muted mb-2">Dislivello</h4>
                <div className="flex flex-wrap gap-2">
                  {(['<1000', '1000-3000', '3000-5000', '>5000'] as const).map(range => (
                    <button
                      key={range}
                      onClick={() => setElevationFilter(elevationFilter === range ? 'all' : range)}
                      className={`px-3 py-2 rounded-lg text-xs transition-all ${
                        elevationFilter === range
                          ? 'bg-orange-600 text-white'
                          : 'bg-white dark:bg-zinc-900 hover:bg-gray-200 dark:hover:bg-zinc-800'
                      }`}
                    >
                      {range}m
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Results count */}
        <div className="text-center">
          <p className="text-sm text-muted">
            {filteredTrips.length === initialTrips.length ? (
              <><span className="font-bold text-foreground">{initialTrips.length}</span> viaggi</>
            ) : (
              <>
                <span className="font-bold text-foreground">{filteredTrips.length}</span> di{" "}
                <span className="font-bold text-foreground">{initialTrips.length}</span> viaggi
              </>
            )}
          </p>
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
          <p className="text-xl text-muted">Nessun viaggio trovato con i criteri selezionati.</p>
        </div>
      )}
    </div>
  );
}
