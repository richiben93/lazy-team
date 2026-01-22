import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-white text-black py-32 px-6 border-t border-black/5">
      <div className="max-w-[1600px] mx-auto flex flex-col md:flex-row justify-between items-end gap-12">
        <div>
          <h2 className="text-4xl md:text-6xl font-black tracking-tighter mb-8 uppercase italic">lazy team</h2>
          <div className="flex flex-wrap gap-x-8 gap-y-4 text-xs font-bold uppercase tracking-[0.3em] opacity-40">
            <Link href="/trips" className="hover:opacity-100 transition-opacity">trips</Link>
            <Link href="/members" className="hover:opacity-100 transition-opacity">members</Link>
            <Link href="/about" className="hover:opacity-100 transition-opacity">about</Link>
            <a href="https://instagram.com" className="hover:opacity-100 transition-opacity">instagram</a>
          </div>
        </div>
        
        <div className="text-right">
          <p className="text-sm font-serif italic opacity-60 mb-4 lowercase">
            crafted in the workshop of the open road
          </p>
          <div className="text-[10px] font-bold uppercase tracking-[0.4em] opacity-20">
            © 2026 lazy team — all rights reserved
          </div>
        </div>
      </div>
    </footer>
  );
}
