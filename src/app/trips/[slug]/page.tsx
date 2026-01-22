import { getTripBySlug, getTrips } from "@/lib/content";
import { notFound } from "next/navigation";
import Image from "next/image";
import { MDXRemote } from "next-mdx-remote/rsc";
import ElevationChart from "./ElevationChart";
import Gallery from "@/components/trip/Gallery";
import { ArrowLeft, ArrowRight, Calendar, MapPin, Ruler, TrendingUp } from "lucide-react";
import Link from "next/link";
import TripMapClient from "@/components/map/TripMapClient";
import React from "react";

export async function generateStaticParams() {
  const trips = await getTrips();
  return trips.map((trip) => ({
    slug: trip.slug,
  }));
}

export default async function TripDetailPage(props: { params: Promise<{ slug: string }> }) {
  const params = await props.params;
  const result = await getTripBySlug(params.slug);
  
  if (!result) notFound();

  const { trip, content } = result;
  const trips = await getTrips();
  const currentIndex = trips.findIndex(t => t.slug === trip.slug);
  const prevTrip = currentIndex < trips.length - 1 ? trips[currentIndex + 1] : null;
  const nextTrip = currentIndex > 0 ? trips[currentIndex - 1] : null;

  return (
    <article className="pt-20">
      {/* Hero Section */}
      <header className="relative h-[80vh] w-full overflow-hidden flex items-end">
        <Image 
          src={trip.coverImage} 
          alt={trip.title} 
          fill 
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
        
        <div className="relative z-10 w-full max-w-7xl mx-auto px-6 pb-20">
          <Link 
            href="/trips" 
            className="inline-flex items-center gap-2 text-white/60 hover:text-white transition-colors text-xs font-bold uppercase tracking-[0.2em] mb-8 group"
          >
            <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" /> Back to trips
          </Link>
          <div className="flex flex-wrap gap-3 mb-6">
            {trip.tags.map(tag => (
              <span key={tag} className="px-3 py-1 bg-white/20 backdrop-blur-md text-white rounded-full text-[10px] font-bold uppercase tracking-widest">
                {tag}
              </span>
            ))}
          </div>
          <h1 className="text-5xl md:text-8xl font-bold text-white tracking-tighter mb-8 font-serif leading-[0.9]">
            {trip.title}
          </h1>
          
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12 pt-8 border-t border-white/20">
            <StatItem icon={Calendar} label="Date" value={new Date(trip.date).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })} />
            <StatItem icon={MapPin} label="Location" value={trip.location} />
            <StatItem icon={Ruler} label="Distance" value={`${(trip.stats.distance / 1000).toFixed(1)} km`} />
            <StatItem icon={TrendingUp} label="Elevation" value={`${trip.stats.elevationGain} m+`} />
          </div>
        </div>
      </header>

      {/* Map & Stats Section */}
      <section className="py-24 px-6 bg-zinc-50 dark:bg-zinc-950 border-b border-foreground/5">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            <div className="lg:col-span-2 h-[60vh] rounded-3xl overflow-hidden border border-foreground/10 shadow-2xl">
              <TripMapClient geojsonUrl={trip.geojsonUrl} bounds={trip.stats.bounds} />
            </div>
            <div className="flex flex-col justify-between">
              <div>
                <h3 className="text-xs font-bold uppercase tracking-[0.2em] opacity-30 mb-8">Route Profile</h3>
                <ElevationChart geojsonUrl={trip.geojsonUrl} />
              </div>
              <div className="mt-12 p-8 bg-white dark:bg-black rounded-3xl border border-foreground/5">
                <p className="text-sm italic opacity-60 leading-relaxed font-serif">
                  &quot;{trip.excerpt}&quot;
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Story Section */}
      <section className="py-32 px-6">
        <div className="max-w-3xl mx-auto prose prose-xl dark:prose-invert prose-headings:font-serif prose-headings:tracking-tighter prose-p:tracking-tight prose-p:leading-relaxed opacity-90">
          <MDXRemote source={content} />
        </div>
      </section>

      {/* Gallery Section */}
      {trip.photos && <Gallery photos={trip.photos} />}

      {/* Navigation Section */}
      <section className="py-20 px-6 border-t border-foreground/5">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row gap-6">
          {prevTrip && (
            <Link href={`/trips/${prevTrip.slug}`} className="flex-1 group">
              <div className="p-12 bg-zinc-50 dark:bg-zinc-950 rounded-3xl border border-foreground/5 transition-all hover:border-foreground/20">
                <span className="text-[10px] font-bold uppercase tracking-widest opacity-30 block mb-4">Previous Trip</span>
                <h4 className="text-2xl font-bold tracking-tight flex items-center gap-4">
                  <ArrowLeft className="w-5 h-5 transition-transform group-hover:-translate-x-2" />
                  {prevTrip.title}
                </h4>
              </div>
            </Link>
          )}
          {nextTrip && (
            <Link href={`/trips/${nextTrip.slug}`} className="flex-1 group text-right">
              <div className="p-12 bg-zinc-50 dark:bg-zinc-950 rounded-3xl border border-foreground/5 transition-all hover:border-foreground/20">
                <span className="text-[10px] font-bold uppercase tracking-widest opacity-30 block mb-4">Next Trip</span>
                <h4 className="text-2xl font-bold tracking-tight flex items-center justify-end gap-4">
                  {nextTrip.title}
                  <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-2" />
                </h4>
              </div>
            </Link>
          )}
        </div>
      </section>
    </article>
  );
}

function StatItem({ icon: Icon, label, value }: { icon: React.ElementType, label: string, value: string }) {
  return (
    <div className="text-white">
      <div className="flex items-center gap-2 opacity-50 mb-2">
        <Icon className="w-3 h-3" />
        <span className="text-[10px] font-bold uppercase tracking-widest">{label}</span>
      </div>
      <p className="text-xl font-bold tracking-tight">{value}</p>
    </div>
  );
}
