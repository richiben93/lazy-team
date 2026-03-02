import { getTrips, getMembers } from "@/lib/content";
import TripCard from "@/components/trip/TripCard";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import GlobalMapClient from "@/components/map/GlobalMapClient";
import Parallax from "@/components/motion/Parallax";
import SectionReveal from "@/components/motion/SectionReveal";
import TextReveal from "@/components/motion/TextReveal";

import Image from "next/image";

export default async function Home() {
  const trips = await getTrips();
  const members = await getMembers();
  const featuredTrips = trips.slice(0, 3);

  return (
    <div className="pt-20">
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center px-6 overflow-hidden bg-gradient-to-br from-background via-yellow-300 to-blue-500">
        {/* Route-like SVG background */}
        <svg className="absolute inset-0 w-full h-full opacity-10" viewBox="0 0 1000 1000" preserveAspectRatio="none">
          <path
            className="route-line"
            d="M 0,500 Q 250,300 500,500 T 1000,400"
            fill="none"
            stroke="currentColor"
            strokeWidth="3"
          />
          <path
            className="route-line"
            d="M 0,300 Q 300,100 600,300 T 1000,200"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            style={{ animationDelay: "0.3s" }}
          />
        </svg>
        
        <div className="relative z-10 text-center max-w-5xl flex flex-col items-center">
          <SectionReveal>
            <div className="relative w-48 h-48 md:w-64 md:h-64 mb-12 rounded-full overflow-hidden border-4 border-foreground shadow-2xl">
              <div className="absolute inset-0 bg-zinc-200 dark:bg-zinc-800 animate-pulse rounded-full" />
              <Image 
                src="/stemma.jpg" 
                alt="Lazy Team Logo" 
                fill 
                className="object-cover"
                priority
              />
            </div>
          </SectionReveal>
          <div className="mt-8 flex flex-col items-center">
            <Parallax offset={40}>
              <h1 className="text-[clamp(3rem,12vw,10rem)] font-bold tracking-tight leading-tight mb-16 font-handwritten text-black">
                <TextReveal>Lazy Team</TextReveal>
              </h1>
            </Parallax>
            
            <SectionReveal delay={0.2}>
              <div className="flex flex-col items-center space-y-4">
                <p className="text-xl md:text-2xl font-medium tracking-tight text-black max-w-2xl mx-auto italic text-center">
                  Ciclismo avventuroso, esplorativo, antimanieristico.
                </p>
                <p className="text-sm md:text-base font-bold uppercase tracking-widest text-black/60">
                  est. Modena 2016
                </p>
              </div>
            </SectionReveal>
          </div>
          <SectionReveal delay={0.4}>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
              <Link 
                href="/trips" 
                className="bg-foreground text-background px-10 py-5 rounded-full text-sm font-bold uppercase tracking-widest hover:scale-105 transition-transform flex items-center gap-3"
              >
                Esplora i viaggi <ArrowRight className="w-4 h-4" />
              </Link>
              <Link 
                href="/members" 
                className="px-10 py-5 rounded-full text-sm font-bold uppercase tracking-widest border border-foreground/10 hover:bg-foreground/5 transition-colors"
              >
                Il Team
              </Link>
            </div>
          </SectionReveal>
        </div>
      </section>

      {/* Map Section */}
      <section className="px-6 pb-32 min-h-screen flex flex-col justify-center bg-blue-600 text-yellow-300">
        <SectionReveal className="max-w-7xl mx-auto w-full">
          <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-8">
            <div className="max-w-xl">
              <h2 className="text-4xl md:text-6xl font-bold tracking-tight mb-6 font-handwritten">
                <TextReveal>Una mappa globale del dolore.</TextReveal>
              </h2>
              <p className="opacity-80 text-lg">Ogni salita, ogni discesa, ogni svolta sbagliata documentata tramite GPS e grinta.</p>
            </div>
          </div>
          <GlobalMapClient trips={trips} members={members} />
        </SectionReveal>
      </section>

      {/* Featured Trips Section */}
      <section className="bg-yellow-400 text-black py-32 px-6 border-y border-black/10 min-h-screen flex flex-col justify-center">
        <SectionReveal className="max-w-7xl mx-auto w-full">
          <div className="flex justify-between items-end mb-16">
            <div>
              <h2 className="text-xs font-bold uppercase tracking-[0.2em] text-black/70 mb-4">Ultime avventure</h2>
              <h3 className="text-4xl md:text-6xl font-bold tracking-tight font-handwritten">
                <TextReveal>Storie in evidenza</TextReveal>
              </h3>
            </div>
            <Link href="/trips" className="hidden md:flex items-center gap-2 text-sm font-bold uppercase tracking-widest text-black/70 hover:text-black transition-colors group">
              Tutti i viaggi <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {featuredTrips.map((trip, i) => (
              <TripCard key={trip.slug} trip={trip} index={i} />
            ))}
          </div>

          <Link 
            href="/trips" 
            className="md:hidden mt-12 flex items-center justify-center gap-2 text-sm font-bold uppercase tracking-widest p-6 border border-black/20 rounded-2xl"
          >
            Tutti i viaggi <ArrowRight className="w-4 h-4" />
          </Link>
        </SectionReveal>
      </section>

      {/* Quote Section */}
      <section className="py-40 px-6 text-center min-h-screen flex flex-col justify-center bg-gradient-to-br from-blue-700 to-blue-900 text-yellow-300">
        <SectionReveal className="max-w-4xl mx-auto">
          <blockquote className="text-4xl md:text-6xl font-handwritten italic tracking-tight mb-12">
            &quot;Non diventa più facile, vai solo più veloce.&quot;
          </blockquote>
          <cite className="text-sm font-bold uppercase tracking-widest text-yellow-200 not-italic">
            — Greg LeMond (Il nostro santo patrono)
          </cite>
        </SectionReveal>
      </section>
    </div>
  );
}
