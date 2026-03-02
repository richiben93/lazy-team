import Image from "next/image";
import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-blue-900 text-yellow-300 py-32 px-6 border-t-4 border-yellow-400">
      <div className="max-w-[1600px] mx-auto flex flex-col md:flex-row justify-between items-end gap-12">
        <div className="flex flex-col gap-8">
          <div className="relative w-24 h-24 rounded-full overflow-hidden border-4 border-yellow-400 shadow-xl antimanieristic" style={{ "--random-rotation": -4 } as React.CSSProperties}>
            <Image 
              src="/stemma.jpg" 
              alt="Lazy Team Logo" 
              fill 
              className="object-cover"
            />
          </div>
          <h2 className="text-4xl md:text-6xl font-black tracking-tight uppercase font-handwritten flex items-center gap-2 text-glow">Lazy Team 🌽</h2>
          <div className="flex flex-wrap gap-x-8 gap-y-4 text-xs font-bold uppercase tracking-[0.3em] text-yellow-200">
            <Link href="/trips" className="hover:text-yellow-100 transition-colors">viaggi</Link>
            <Link href="/members" className="hover:text-yellow-100 transition-colors">membri</Link>
            <Link href="/about" className="hover:text-yellow-100 transition-colors">chi siamo</Link>
            <a href="https://www.instagram.com/lazy.team_erman.bike/" className="hover:text-yellow-100 transition-colors" target="_blank" rel="noopener noreferrer">instagram</a>
          </div>
        </div>
        
        <div className="text-right">
          <p className="text-sm font-handwritten italic text-yellow-200 mb-4">
            forgiato nel laboratorio della strada aperta
          </p>
          <div className="text-xs font-bold uppercase tracking-[0.4em] text-yellow-300/60">
            © 2026 lazy team — ciclismo antimanieristico
          </div>
        </div>
      </div>
    </footer>
  );
}
