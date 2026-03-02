"use client";

import React from 'react';
import { TripType, TerrainType } from '@/types';
import { X } from 'lucide-react';

export interface TripFilters {
  authors: string[];
  types: TripType[];
  terrains: TerrainType[];
  minDistance: number | null;
  minElevation: number | null;
}

interface TripFiltersProps {
  filters: TripFilters;
  onFiltersChange: (filters: TripFilters) => void;
  availableAuthors: Array<{ slug: string; name: string; emoji: string }>;
}

const QUICK_FILTERS = {
  distance: [
    { label: '< 100km', value: 0 },
    { label: '100-300km', value: 100 },
    { label: '300-500km', value: 300 },
    { label: '> 500km', value: 500 },
  ],
  elevation: [
    { label: '< 1000m', value: 0 },
    { label: '1000-3000m', value: 1000 },
    { label: '3000-5000m', value: 3000 },
    { label: '> 5000m', value: 5000 },
  ],
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

export default function TripFiltersComponent({ filters, onFiltersChange, availableAuthors }: TripFiltersProps) {
  const toggleAuthor = (authorSlug: string) => {
    const newAuthors = filters.authors.includes(authorSlug)
      ? filters.authors.filter(a => a !== authorSlug)
      : [...filters.authors, authorSlug];
    onFiltersChange({ ...filters, authors: newAuthors });
  };

  const toggleType = (type: TripType) => {
    const newTypes = filters.types.includes(type)
      ? filters.types.filter(t => t !== type)
      : [...filters.types, type];
    onFiltersChange({ ...filters, types: newTypes });
  };

  const toggleTerrain = (terrain: TerrainType) => {
    const newTerrains = filters.terrains.includes(terrain)
      ? filters.terrains.filter(t => t !== terrain)
      : [...filters.terrains, terrain];
    onFiltersChange({ ...filters, terrains: newTerrains });
  };

  const setMinDistance = (value: number | null) => {
    onFiltersChange({ ...filters, minDistance: value });
  };

  const setMinElevation = (value: number | null) => {
    onFiltersChange({ ...filters, minElevation: value });
  };

  const clearFilters = () => {
    onFiltersChange({
      authors: [],
      types: [],
      terrains: [],
      minDistance: null,
      minElevation: null,
    });
  };

  const hasActiveFilters = 
    filters.authors.length > 0 ||
    filters.types.length > 0 ||
    filters.terrains.length > 0 ||
    filters.minDistance !== null ||
    filters.minElevation !== null;

  return (
    <div className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-lg p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-xs font-bold uppercase tracking-widest text-black/70">Filtri</h3>
        {hasActiveFilters && (
          <button
            onClick={clearFilters}
            className="text-xs font-bold text-red-600 hover:text-red-700 flex items-center gap-1"
          >
            <X className="w-3 h-3" />
            Rimuovi
          </button>
        )}
      </div>

      {/* Lazer Filter */}
      <div>
        <h4 className="text-xs font-bold text-black/60 mb-2">Lazer</h4>
        <div className="flex flex-wrap gap-2">
          {availableAuthors.map(author => (
            <button
              key={author.slug}
              onClick={() => toggleAuthor(author.slug)}
              className={`px-3 py-2 rounded-lg text-sm transition-all ${
                filters.authors.includes(author.slug)
                  ? 'bg-black text-white'
                  : 'bg-gray-100 text-black hover:bg-gray-200'
              }`}
            >
              <span className="mr-1">{author.emoji}</span>
              {author.name}
            </button>
          ))}
        </div>
      </div>

      {/* Trip Type Filter */}
      <div>
        <h4 className="text-xs font-bold text-black/60 mb-2">Durata</h4>
        <div className="flex flex-wrap gap-2">
          {TRIP_TYPES.map(type => (
            <button
              key={type.value}
              onClick={() => toggleType(type.value)}
              className={`px-3 py-2 rounded-lg text-sm transition-all ${
                filters.types.includes(type.value)
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-black hover:bg-gray-200'
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
        <h4 className="text-xs font-bold text-black/60 mb-2">Terreno</h4>
        <div className="flex flex-wrap gap-2">
          {TERRAIN_TYPES.map(terrain => (
            <button
              key={terrain.value}
              onClick={() => toggleTerrain(terrain.value)}
              className={`px-3 py-2 rounded-lg text-sm transition-all ${
                filters.terrains.includes(terrain.value)
                  ? 'bg-green-600 text-white'
                  : 'bg-gray-100 text-black hover:bg-gray-200'
              }`}
            >
              <span className="mr-1">{terrain.emoji}</span>
              {terrain.label}
            </button>
          ))}
        </div>
      </div>

      {/* Distance Filter */}
      <div>
        <h4 className="text-xs font-bold text-black/60 mb-2">Distanza</h4>
        <div className="grid grid-cols-2 gap-2">
          {QUICK_FILTERS.distance.map(option => (
            <button
              key={option.value}
              onClick={() => setMinDistance(filters.minDistance === option.value ? null : option.value)}
              className={`px-3 py-2 rounded-lg text-xs transition-all ${
                filters.minDistance === option.value
                  ? 'bg-yellow-600 text-white'
                  : 'bg-gray-100 text-black hover:bg-gray-200'
              }`}
            >
              {option.label}
            </button>
          ))}
        </div>
      </div>

      {/* Elevation Filter */}
      <div>
        <h4 className="text-xs font-bold text-black/60 mb-2">Dislivello</h4>
        <div className="grid grid-cols-2 gap-2">
          {QUICK_FILTERS.elevation.map(option => (
            <button
              key={option.value}
              onClick={() => setMinElevation(filters.minElevation === option.value ? null : option.value)}
              className={`px-3 py-2 rounded-lg text-xs transition-all ${
                filters.minElevation === option.value
                  ? 'bg-orange-600 text-white'
                  : 'bg-gray-100 text-black hover:bg-gray-200'
              }`}
            >
              {option.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
