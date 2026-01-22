import { getMembers } from "@/lib/content";
import Image from "next/image";

export const metadata = {
  title: "Members — LAZY TEAM",
  description: "Meet the individuals who make up the Lazy Team.",
};

export default async function MembersPage() {
  const members = await getMembers();

  return (
    <div className="pt-40 pb-32 px-6">
      <div className="max-w-7xl mx-auto">
        <header className="mb-20 text-center max-w-3xl mx-auto">
          <h1 className="text-xs font-bold uppercase tracking-[0.2em] opacity-30 mb-6">The Collective</h1>
          <h2 className="text-6xl md:text-8xl font-bold tracking-tighter mb-8 font-serif">The Team.</h2>
          <p className="text-xl opacity-50 tracking-tight leading-relaxed">
            The faces behind the miles. A diverse group of riders united by a shared love for the road.
          </p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
          {members.map((member) => (
            <div key={member.slug} className="group">
              <div className="relative aspect-square overflow-hidden rounded-3xl bg-zinc-100 dark:bg-zinc-900 mb-8 border border-foreground/5 shadow-xl transition-transform duration-500 group-hover:-translate-y-2">
                <Image
                  src={member.avatar}
                  alt={member.name}
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
              <div className="text-center">
                <span className="text-[10px] font-bold uppercase tracking-widest opacity-30 block mb-2">{member.role}</span>
                <h3 className="text-3xl font-bold tracking-tight mb-2 font-serif">{member.name}</h3>
                <p className="text-sm font-bold opacity-50 uppercase tracking-widest mb-6">&quot;{member.nickname}&quot;</p>
                <p className="opacity-60 max-w-xs mx-auto text-sm leading-relaxed">
                  {member.bio}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
