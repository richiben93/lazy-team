"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { useState, useEffect } from "react";

import Image from "next/image";

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const navItems = [
  { name: "Home", path: "/" },
  { name: "Trips", path: "/trips" },
  { name: "Laziers", path: "/members" },
  { name: "About", path: "/about" },
];

export default function Header() {
  const pathname = usePathname();
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header 
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
        isScrolled ? "bg-[#1743C6]/95 backdrop-blur-sm shadow-lg py-1" : "bg-[#1743C6] py-2"
      )}
    >
      <div className="max-w-7xl mx-auto px-6 flex items-center justify-between transition-all duration-300">
        <Link href="/" className="flex items-center gap-2 hover:opacity-70 transition-opacity">
          <motion.div 
            animate={{ scale: isScrolled ? 0.75 : 0.9 }}
            transition={{ duration: 0.3 }}
            className="relative w-10 h-10 rounded-full overflow-hidden border-2 border-white/20 shadow-lg"
          >
            <Image 
              src="/stemma.jpg" 
              alt="Lazy Team Logo" 
              fill 
              className="object-cover"
            />
          </motion.div>
          <motion.span 
            animate={{ 
              opacity: isScrolled ? 0.8 : 1, 
              x: isScrolled ? -5 : 0,
              fontSize: isScrolled ? "1.25rem" : "1.5rem"
            }}
            transition={{ duration: 0.3 }}
            className="font-bold tracking-tight font-handwritten text-white"
          >
            Lazy Team
          </motion.span>
        </Link>

        <nav className="flex items-center space-x-6">
          {navItems.map((item, index) => {
            // When scrolled, hide all links except Home
            if (isScrolled && index > 0) return null;
            
            return (
              <Link
                key={item.path}
                href={item.path}
                className={cn(
                  "text-[10px] font-medium uppercase tracking-widest hover:text-white transition-colors relative block py-1",
                  pathname === item.path ? "text-white" : "text-white/70"
                )}
              >
                {item.name}
                {pathname === item.path && (
                  <motion.div
                    layoutId="nav-underline"
                    className="absolute -bottom-1 left-0 right-0 h-px bg-white"
                    transition={{ type: "spring", stiffness: 380, damping: 30 }}
                  />
                )}
              </Link>
            );
          })}
        </nav>
      </div>
    </header>
  );
}
