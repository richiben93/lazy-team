"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { useState, useEffect, useCallback } from "react";
import { Menu, X } from "lucide-react";

import Image from "next/image";

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const navItems = [
  { name: "Home", path: "/" },
  { name: "Viaggi", path: "/trips" },
  { name: "Membri", path: "/members" },
  { name: "Chi siamo", path: "/about" },
];

export default function Header() {
  const pathname = usePathname();
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [pathname]);

  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileMenuOpen]);

  const toggleMobileMenu = useCallback(() => {
    setMobileMenuOpen((prev) => !prev);
  }, []);

  return (
    <>
      <header
        className={cn(
          "fixed top-0 left-0 right-0 z-[9999] transition-all duration-300",
          isScrolled
            ? "bg-[#1743C6]/95 backdrop-blur-md shadow-lg py-1"
            : "bg-[#1743C6] py-2"
        )}
      >
        <div className="max-w-7xl mx-auto px-6 flex items-center justify-between transition-all duration-300">
          <Link
            href="/"
            className="flex items-center gap-2 hover:opacity-70 transition-opacity"
          >
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
                fontSize: isScrolled ? "1.25rem" : "1.5rem",
              }}
              transition={{ duration: 0.3 }}
              className="font-bold tracking-tight font-handwritten text-white"
            >
              Lazy Team
            </motion.span>
          </Link>

          {/* Desktop navigation */}
          <nav className="hidden md:flex items-center space-x-6">
            {navItems.map((item) => (
              <Link
                key={item.path}
                href={item.path}
                className={cn(
                  "text-xs font-medium uppercase tracking-widest hover:text-white transition-colors relative block py-1",
                  pathname === item.path
                    ? "text-white"
                    : "text-white/70"
                )}
              >
                {item.name}
                {pathname === item.path && (
                  <motion.div
                    layoutId="nav-underline"
                    className="absolute -bottom-1 left-0 right-0 h-px bg-white"
                    transition={{
                      type: "spring",
                      stiffness: 380,
                      damping: 30,
                    }}
                  />
                )}
              </Link>
            ))}
          </nav>

          {/* Mobile hamburger button */}
          <button
            className="md:hidden p-2 text-white hover:text-white/70 transition-colors"
            onClick={toggleMobileMenu}
            aria-label={mobileMenuOpen ? "Chiudi menu" : "Apri menu"}
          >
            {mobileMenuOpen ? (
              <X className="w-6 h-6" />
            ) : (
              <Menu className="w-6 h-6" />
            )}
          </button>
        </div>
      </header>

      {/* Mobile menu overlay */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-[9998] bg-[#1743C6] flex flex-col items-center justify-center"
          >
            <nav className="flex flex-col items-center gap-8">
              {navItems.map((item, i) => (
                <motion.div
                  key={item.path}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ delay: i * 0.05, duration: 0.3 }}
                >
                  <Link
                    href={item.path}
                    className={cn(
                      "text-2xl font-bold uppercase tracking-widest transition-colors",
                      pathname === item.path
                        ? "text-white"
                        : "text-white/60 hover:text-white"
                    )}
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    {item.name}
                  </Link>
                </motion.div>
              ))}
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
