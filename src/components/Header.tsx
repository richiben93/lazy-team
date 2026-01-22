"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const navItems = [
  { name: "Home", path: "/" },
  { name: "Trips", path: "/trips" },
  { name: "Members", path: "/members" },
  { name: "About", path: "/about" },
];

export default function Header() {
  const pathname = usePathname();

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b border-foreground/5">
      <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
        <Link href="/" className="text-2xl font-bold tracking-tighter hover:opacity-70 transition-opacity">
          LAZY TEAM
        </Link>
        <nav className="hidden md:flex items-center space-x-8">
          {navItems.map((item) => (
            <Link
              key={item.path}
              href={item.path}
              className={cn(
                "text-sm font-medium uppercase tracking-widest hover:opacity-100 transition-opacity relative block",
                pathname === item.path ? "opacity-100" : "opacity-50"
              )}
            >
              {item.name}
              {pathname === item.path && (
                <motion.div
                  layoutId="nav-underline"
                  className="absolute -bottom-1 left-0 right-0 h-px bg-foreground"
                  transition={{ type: "spring", stiffness: 380, damping: 30 }}
                />
              )}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}
