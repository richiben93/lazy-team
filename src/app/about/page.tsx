import Image from "next/image";
import { getAboutContent } from "@/lib/about-content";

export const metadata = {
  title: "About — LAZY TEAM 🌽",
  description: "Learn more about the mission and history of Lazy Team.",
};

export default function AboutPage() {
  const content = getAboutContent();

  return (
    <div className="pt-40 pb-32 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
          <div>
            <h1 className="text-xs font-bold uppercase tracking-[0.2em] text-muted mb-6">{content.title}</h1>
            <h2 className="text-6xl md:text-8xl font-bold tracking-tighter mb-12 font-serif leading-tight">
              {content.subtitle}
            </h2>
            <div className="space-y-8 text-xl text-secondary leading-relaxed tracking-tight whitespace-pre-wrap">
              {content.description}
            </div>
          </div>
          {content.image && (
            <div className="relative aspect-[3/4] rounded-3xl overflow-hidden shadow-2xl">
              <div className="absolute inset-0 bg-zinc-200 dark:bg-zinc-800 animate-pulse" />
              <Image 
                src={content.image} 
                alt="Team riding" 
                fill 
                className="object-cover"
              />
            </div>
          )}
        </div>

        <section className="mt-40 grid grid-cols-1 md:grid-cols-3 gap-12">
          {content.values.map((value, index) => (
            <ValueCard 
              key={index}
              title={value.title} 
              description={value.description}
            />
          ))}
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
