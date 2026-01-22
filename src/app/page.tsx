import { getTrips } from "@/lib/content";
import TripCard from "@/components/trip/TripCard";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import GlobalMapClient from "@/components/map/GlobalMapClient";
import Parallax from "@/components/motion/Parallax";
import SectionReveal from "@/components/motion/SectionReveal";
import TextReveal from "@/components/motion/TextReveal";

export default async function Home() {
  const trips = await getTrips();
  const featuredTrips = trips.slice(0, 3);

  return (
    <div className="pt-20">
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center px-6 overflow-hidden">
        <div className="absolute inset-0 z-0 opacity-20">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[100vw] h-[100vw] bg-zinc-200 dark:bg-zinc-800 rounded-full blur-3xl animate-pulse" />
        </div>
        
        <div className="relative z-10 text-center max-w-5xl">
          <Parallax offset={100}>
            <h1 className="text-[12vw] md:text-[10vw] font-bold tracking-tighter leading-[0.8] mb-8">
              <TextReveal>LAZY TEAM</TextReveal>
            </h1>
          </Parallax>
          <SectionReveal delay={0.2}>
            <p className="text-xl md:text-2xl font-medium tracking-tight opacity-60 mb-12 max-w-2xl mx-auto">
              Exploring the world&apos;s most epic roads, one pedal stroke at a time. A collective of cyclists chasing horizons and coffee.
            </p>
          </SectionReveal>
          <SectionReveal delay={0.4}>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
              <Link 
                href="/trips" 
                className="bg-foreground text-background px-10 py-5 rounded-full text-sm font-bold uppercase tracking-widest hover:scale-105 transition-transform flex items-center gap-3"
              >
                Explore our rides <ArrowRight className="w-4 h-4" />
              </Link>
              <Link 
                href="/about" 
                className="px-10 py-5 rounded-full text-sm font-bold uppercase tracking-widest border border-foreground/10 hover:bg-foreground/5 transition-colors"
              >
                The Team
              </Link>
            </div>
          </SectionReveal>
        </div>
      </section>

      {/* Map Section */}
      <section className="px-6 pb-32 min-h-screen flex flex-col justify-center">
        <SectionReveal className="max-w-7xl mx-auto w-full">
          <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-8">
            <div className="max-w-xl">
              <h2 className="text-4xl md:text-6xl font-bold tracking-tighter mb-6 font-serif">
                <TextReveal>A global map of pain.</TextReveal>
              </h2>
              <p className="opacity-50 text-lg">Every climb, every descent, and every wrong turn documented through GPS and grit.</p>
            </div>
          </div>
          <GlobalMapClient trips={trips} />
        </SectionReveal>
      </section>

      {/* Featured Trips Section */}
      <section className="bg-zinc-50 dark:bg-zinc-950 py-32 px-6 border-y border-foreground/5 min-h-screen flex flex-col justify-center">
        <SectionReveal className="max-w-7xl mx-auto w-full">
          <div className="flex justify-between items-end mb-16">
            <div>
              <h2 className="text-xs font-bold uppercase tracking-[0.2em] opacity-30 mb-4">Latest adventures</h2>
              <h3 className="text-4xl md:text-6xl font-bold tracking-tighter font-serif">
                <TextReveal>Featured Stories</TextReveal>
              </h3>
            </div>
            <Link href="/trips" className="hidden md:flex items-center gap-2 text-sm font-bold uppercase tracking-widest opacity-50 hover:opacity-100 transition-opacity group">
              View all trips <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {featuredTrips.map((trip, i) => (
              <TripCard key={trip.slug} trip={trip} index={i} />
            ))}
          </div>

          <Link 
            href="/trips" 
            className="md:hidden mt-12 flex items-center justify-center gap-2 text-sm font-bold uppercase tracking-widest p-6 border border-foreground/10 rounded-2xl"
          >
            View all trips <ArrowRight className="w-4 h-4" />
          </Link>
        </SectionReveal>
      </section>

      {/* Quote Section */}
      <section className="py-40 px-6 text-center min-h-screen flex flex-col justify-center">
        <SectionReveal className="max-w-4xl mx-auto">
          <blockquote className="text-4xl md:text-6xl font-serif italic tracking-tight mb-12">
            &quot;It doesn&apos;t get easier, you just go faster.&quot;
          </blockquote>
          <cite className="text-sm font-bold uppercase tracking-widest opacity-30 not-italic">
            — Greg LeMond (Our Patron Saint)
          </cite>
        </SectionReveal>
      </section>
    </div>
  );
}
