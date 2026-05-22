"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Search } from "lucide-react";
import { Place } from "@/types";
import { searchPlaces } from "@/lib/supabase/queries";

interface SearchBarProps {
  variant: "hero" | "nav";
}

export default function SearchBar({ variant }: SearchBarProps) {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState<Place[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const wrapperRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (query.length === 0) {
      setSuggestions([]);
      return;
    }
    const timer = setTimeout(async () => {
      const results = await searchPlaces(query);
      setSuggestions(results.slice(0, 5));
    }, 200);
    return () => clearTimeout(timer);
  }, [query]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      router.push(`/explore?q=${encodeURIComponent(query.trim())}`);
    }
  };

  const handleSelect = (placeId: string) => {
    router.push(`/explore/${placeId}`);
    setShowSuggestions(false);
    setQuery("");
  };

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        wrapperRef.current &&
        !wrapperRef.current.contains(e.target as Node)
      ) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  if (variant === "hero") {
    return (
      <form
        onSubmit={handleSubmit}
        ref={wrapperRef}
        className="relative w-full max-w-3xl"
      >
        <div className="bg-surface/95 backdrop-blur-md p-2 rounded-full shadow-xl flex items-center border border-outline-variant/30 group focus-within:ring-2 focus-within:ring-secondary/50 transition-all">
          <Search className="text-on-surface-variant ml-4 mr-2 w-5 h-5 shrink-0" />
          <input
            type="text"
            placeholder="¿Qué estás buscando? (Ej. Laguna de Pacucha, Restaurantes...)"
            className="flex-grow bg-transparent border-none focus:ring-0 text-lg py-3 outline-none min-w-0"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setShowSuggestions(true);
            }}
            onFocus={() => setShowSuggestions(true)}
          />
          <button
            type="submit"
            className="bg-secondary text-on-secondary px-8 py-3 rounded-full font-bold shadow-lg hover:bg-secondary-container hover:text-on-secondary-container transition-all shrink-0"
          >
            Buscar
          </button>
        </div>
        {showSuggestions && suggestions.length > 0 && (
          <div className="absolute top-full left-0 right-0 mt-2 bg-surface rounded-2xl shadow-xl border border-outline-variant/20 overflow-hidden z-50">
            {suggestions.map((p) => (
              <button
                key={p.id}
                type="button"
                onClick={() => handleSelect(p.id)}
                className="w-full flex items-center gap-3 px-6 py-3 hover:bg-surface-container transition-all text-left"
              >
                <img
                  src={p.imageUrl}
                  alt=""
                  className="w-10 h-10 rounded-lg object-cover shrink-0"
                  referrerPolicy="no-referrer"
                />
                <div className="min-w-0">
                  <p className="font-bold text-primary text-sm truncate">
                    {p.name}
                  </p>
                  <p className="text-xs text-on-surface-variant truncate">
                    {p.subcategory || p.category}
                  </p>
                </div>
              </button>
            ))}
          </div>
        )}
      </form>
    );
  }

  return (
    <form onSubmit={handleSubmit} ref={wrapperRef} className="relative">
      <div className="flex items-center bg-surface-container-highest border border-outline-variant rounded-full transition-all focus-within:ring-1 focus-within:ring-secondary">
        <Search className="ml-3 text-outline w-4 h-4 shrink-0" />
        <input
          type="text"
          placeholder="Buscar..."
          className="pl-2 pr-4 py-2 bg-transparent text-sm focus:outline-none w-40 xl:w-48"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setShowSuggestions(true);
          }}
          onFocus={() => setShowSuggestions(true)}
        />
      </div>
      {showSuggestions && suggestions.length > 0 && (
        <div className="absolute top-full right-0 mt-2 w-80 bg-surface rounded-2xl shadow-xl border border-outline-variant/20 overflow-hidden z-50">
          {suggestions.map((p) => (
            <button
              key={p.id}
              type="button"
              onClick={() => handleSelect(p.id)}
              className="w-full flex items-center gap-3 px-4 py-3 hover:bg-surface-container transition-all text-left"
            >
              <img
                src={p.imageUrl}
                alt=""
                className="w-8 h-8 rounded-lg object-cover shrink-0"
                referrerPolicy="no-referrer"
              />
              <div className="min-w-0">
                <p className="font-bold text-primary text-xs truncate">
                  {p.name}
                </p>
                <p className="text-[10px] text-on-surface-variant truncate">
                  {p.subcategory || p.category}
                </p>
              </div>
            </button>
          ))}
        </div>
      )}
    </form>
  );
}
