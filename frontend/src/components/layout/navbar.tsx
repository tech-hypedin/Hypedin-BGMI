'use client';

import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { AnimatePresence, motion, useScroll, useSpring } from 'framer-motion';
import { Menu, X } from 'lucide-react';
import { Button } from '../ui/button';

// Order mirrors the page's narrative flow.
const SECTION_IDS = ['program', 'why-join', 'role', 'missions', 'ranks', 'perks'];
const NAV_LINKS = [
  { label: 'PROGRAM', href: '/#program', section: 'program' },
  { label: 'WHY JOIN', href: '/#why-join', section: 'why-join' },
  { label: 'YOUR ROLE', href: '/#role', section: 'role' },
  { label: 'MISSIONS', href: '/#missions', section: 'missions' },
  { label: 'RANKS', href: '/#ranks', section: 'ranks' },
  { label: 'PERKS', href: '/#perks', section: 'perks' },
];

export function Navbar() {
  const router = useRouter();
  const pathname = usePathname();
  const { scrollY, scrollYProgress } = useScroll();
  const progress = useSpring(scrollYProgress, { stiffness: 140, damping: 30 });
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState<string | null>(null);

  useEffect(() => scrollY.on('change', (y) => setScrolled(y > 40)), [scrollY]);

  // close the mobile menu on navigation
  useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);

  // scrollspy — highlight the section currently in view (home page only)
  useEffect(() => {
    if (pathname !== '/') {
      setActiveSection(null);
      return;
    }
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) setActiveSection(entry.target.id);
        }
      },
      { rootMargin: '-35% 0px -55% 0px' }
    );
    for (const id of SECTION_IDS) {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    }
    return () => observer.disconnect();
  }, [pathname]);

  return (
    <motion.header
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      className={`fixed top-0 inset-x-0 z-50 border-b transition-all duration-300 ${
        scrolled ? 'bg-black/95 border-border backdrop-blur-md' : 'bg-black/60 border-transparent backdrop-blur-sm'
      }`}
    >
      <nav
        aria-label="Main navigation"
        className={`max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between transition-all duration-300 ${
          scrolled ? 'h-16' : 'h-20'
        }`}
      >
        {/* Logo lockup */}
        <Link href="/" className="flex items-center gap-3 group" aria-label="BGMI Campus Champion home">
          <Image
            src="/bgmi-logo-white.webp"
            alt="BGMI logo"
            width={64}
            height={43}
            priority
            className="w-14 h-auto"
          />
          <span className="hidden sm:block border-l border-border pl-3">
            <span className="block font-heading text-lg leading-none text-white tracking-[0.15em]">CAMPUS MVP</span>
          </span>
        </Link>

        {/* Desktop links */}
        <div className="hidden lg:flex items-center gap-7">
          {NAV_LINKS.map((link) => {
            const isActive =
              (link.section && link.section === activeSection) ||
              (!link.section && pathname === link.href);
            return (
              <Link
                key={link.label}
                href={link.href}
                aria-current={isActive ? 'true' : undefined}
                className={`relative font-teko text-base tracking-[0.2em] transition-colors group ${
                  isActive ? 'text-white' : 'text-muted-foreground hover:text-white'
                }`}
              >
                {link.label}
                <span
                  className={`absolute -bottom-1 left-0 h-px bg-primary transition-all duration-300 ${
                    isActive ? 'w-full' : 'w-0 group-hover:w-full'
                  }`}
                />
              </Link>
            );
          })}
        </div>

        <div className="flex items-center gap-3">
          <Button size="default" onClick={() => router.push('/application')} className="hidden sm:inline-flex font-bold">
            APPLY NOW
          </Button>

          <Button size="default" onClick={() => router.push('/login')} className="hidden sm:inline-flex font-bold bg-transparent text-foreground hover:text-background">
            Login In
          </Button>
          {/* Mobile menu toggle */}
          <button
            type="button"
            onClick={() => setMenuOpen((o) => !o)}
            aria-expanded={menuOpen}
            aria-controls="mobile-menu"
            aria-label={menuOpen ? 'Close menu' : 'Open menu'}
            className="lg:hidden w-10 h-10 border border-border flex items-center justify-center text-white hover:border-primary/60 transition-colors"
          >
            {menuOpen ? <X className="w-5 h-5" aria-hidden="true" /> : <Menu className="w-5 h-5" aria-hidden="true" />}
          </button>
        </div>
      </nav>

      {/* Mobile menu */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            id="mobile-menu"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            className="lg:hidden overflow-hidden bg-black/95 backdrop-blur-md border-t border-border"
          >
            <div className="px-6 py-6 flex flex-col gap-1">
              {NAV_LINKS.map((link, i) => (
                <motion.div
                  key={link.label}
                  initial={{ opacity: 0, x: -16 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.05, duration: 0.25 }}
                >
                  <Link
                    href={link.href}
                    onClick={() => setMenuOpen(false)}
                    className="block font-teko text-xl sm:text-2xl tracking-[0.12em] sm:tracking-[0.2em] text-foreground hover:text-primary py-3 border-b border-border/50 transition-colors"
                  >
                    {link.label}
                  </Link>
                </motion.div>
              ))}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: NAV_LINKS.length * 0.05 + 0.1 }}
                className="pt-4"
              >
                <Button
                  className="w-full"
                  onClick={() => {
                    setMenuOpen(false);
                    router.push('/application');
                  }}
                >
                  APPLY NOW
                </Button>

                <Button
                  className="w-full mt-1 bg-transparent text-foreground"
                  onClick={() => {
                    setMenuOpen(false);
                    router.push('/login');
                  }}
                >
                  LOG IN
                </Button>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      {/* Reading-progress bar — gold line tracking page scroll */}
      <motion.div
        style={{ scaleX: progress }}
        className="absolute bottom-0 left-0 right-0 h-px bg-primary origin-left"
        aria-hidden="true"
      />
    </motion.header>
  );
}
