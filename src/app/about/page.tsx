import Image from "next/image";

export const metadata = {
  title: "About — LAZY TEAM 🌽",
  description: "Learn more about the mission and history of Lazy Team.",
};

export default function AboutPage() {
  return (
    <div className="pt-40 pb-32 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
          <div>
            <h1 className="text-xs font-bold uppercase tracking-[0.2em] text-muted mb-6">The Story</h1>
            <h2 className="text-6xl md:text-8xl font-bold tracking-tighter mb-12 font-serif leading-tight">
              We ride because it&apos;s hard.
            </h2>
            <div className="space-y-8 text-xl text-secondary leading-relaxed tracking-tight">
              <p>
                Lazy Team was born from a simple idea: that the best way to see the world is at 25 kilometers per hour. We aren&apos;t professional athletes, but we treat every climb like a world championship.
              </p>
              <p>
                Founded in 2023, what started as a few friends meeting for Sunday coffee rides evolved into an obsession with exploring the most challenging and beautiful terrain we could find.
              </p>
              <p>
                Our philosophy is simple: Ride long, eat well, and never take yourself too seriously. The &quot;Lazy&quot; in our name is ironic—or maybe it&apos;s a reflection of how we feel after a 2,000-meter climb.
              </p>
            </div>
          </div>
          <div className="relative aspect-[3/4] rounded-3xl overflow-hidden shadow-2xl">
            <div className="absolute inset-0 bg-zinc-200 dark:bg-zinc-800 animate-pulse" />
            <Image 
              src="https://images.unsplash.com/photo-1518063319789-7217e6706b04?auto=format&fit=crop&q=80&w=2000" 
              alt="Team riding" 
              fill 
              className="object-cover"
            />
          </div>
        </div>

        <section className="mt-40 grid grid-cols-1 md:grid-cols-3 gap-12">
          <ValueCard 
            title="Exploration" 
            description="We seek out the roads less traveled, the steepest gradients, and the most rewarding views."
          />
          <ValueCard 
            title="Community" 
            description="Cycling is better together. We support each other through every mechanical and every bonk."
          />
          <ValueCard 
            title="Storytelling" 
            description="Every ride is an adventure worth documenting. We share our stories to inspire others to get out and ride."
          />
        </section>
      </div>
    </div>
  );
}

function ValueCard({ title, description }: { title: string; description: string }) {
  return (
    <div className="p-12 bg-zinc-50 dark:bg-zinc-950 rounded-3xl border border-foreground/10 shadow-lg">
      <h3 className="text-2xl font-bold mb-6 font-serif">{title}</h3>
      <p className="text-secondary leading-relaxed">{description}</p>
    </div>
  );
}
