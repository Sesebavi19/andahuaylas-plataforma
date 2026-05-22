"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu } from "lucide-react";
import { useState } from "react";
import SearchBar from "@/components/SearchBar";

const NAV_LINKS = [
  { href: "/explore", label: "Explore" },
  { href: "/gastronomia", label: "Gastronomía" },
  { href: "/comercios", label: "Comercio" },
];

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <div className="min-h-screen flex flex-col">
      <nav className="bg-surface/80 backdrop-blur-md sticky top-0 z-50 border-b border-outline-variant/30 transition-all">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex justify-between items-center">
          <Link
            href="/"
            className="text-2xl font-bold text-primary tracking-tight"
          >
            Andahuaylas Go
          </Link>

          <div className="hidden md:flex items-center space-x-8 h-full">
            {NAV_LINKS.map((link) => {
              const isActive = pathname.startsWith(link.href);
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`h-full flex items-center px-4 font-medium transition-all ${
                    isActive
                      ? "text-secondary border-b-2 border-secondary"
                      : "text-on-surface-variant hover:text-primary"
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}
          </div>

          <div className="flex items-center gap-4">
            {pathname !== "/" && (
              <div className="hidden lg:block">
                <SearchBar variant="nav" />
              </div>
            )}
            <Link
              href="/admin/login"
              className="bg-primary text-on-primary px-4 py-2 rounded-lg text-sm font-medium hover:bg-primary-container hover:text-on-primary-container transition-all shadow-sm"
            >
              Partner Login
            </Link>
            <button
              className="md:hidden"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              <Menu className="w-6 h-6 text-on-surface" />
            </button>
          </div>
        </div>

        {isMenuOpen && (
          <div className="md:hidden bg-surface border-b border-outline-variant/30 px-4 py-4 space-y-2">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="block px-4 py-2 text-on-surface-variant hover:bg-surface-container rounded-lg"
              >
                {link.label}
              </Link>
            ))}
          </div>
        )}
      </nav>

      <main className="flex-1">{children}</main>

      <footer className="bg-primary-container text-on-primary-container border-t border-primary/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 grid grid-cols-1 md:grid-cols-3 gap-12">
          <div>
            <div className="text-2xl font-bold mb-4">Andahuaylas Go</div>
            <p className="text-on-primary-container/80 text-sm max-w-xs leading-relaxed">
              &copy; 2026 Andahuaylas Go. Todos los derechos reservados.
            </p>
          </div>
          <div className="space-y-4">
            <h4 className="font-bold uppercase tracking-wider text-sm">
              Enlaces
            </h4>
            <div className="flex flex-col space-y-2 text-sm text-on-primary-container/70">
              <Link href="/explore" className="hover:text-white transition-colors">
                Explorar
              </Link>
              <Link href="/gastronomia" className="hover:text-white transition-colors">
                Gastronomía
              </Link>
              <Link href="/comercios" className="hover:text-white transition-colors">
                Comercios
              </Link>
            </div>
          </div>
          <div className="space-y-4">
            <h4 className="font-bold uppercase tracking-wider text-sm">
              Contacto
            </h4>
            <div className="flex flex-col space-y-2 text-sm text-on-primary-container/70">
              <span>Plataforma de Información Turística</span>
              <span>Soporte</span>
              <span>Andahuaylas, Apurímac</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
