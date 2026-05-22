"use client";

import { useState, useMemo, useEffect } from "react";
import {
  APIProvider,
  Map,
  AdvancedMarker,
  Pin,
} from "@vis.gl/react-google-maps";
import {
  Search,
  MapPin,
  Star,
  Navigation,
  Info,
  List,
  Grid3x3,
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import Link from "next/link";
import { Place, PlaceCategory } from "@/types";
import { getPlaces } from "@/lib/supabase/queries";
import { MAPS_API_KEY, MAP_ID, DEFAULT_CENTER, DEFAULT_ZOOM, hasValidMapKey } from "@/lib/maps/config";

export default function ExploreClient({
  initialQuery = "",
  initialCategory = "all",
}: {
  initialQuery?: string;
  initialCategory?: string;
}) {
  const [allPlaces, setAllPlaces] = useState<Place[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState(initialQuery);
  const [selectedCategory, setSelectedCategory] = useState<PlaceCategory | "all">(
    Object.values(PlaceCategory).includes(initialCategory as PlaceCategory)
      ? (initialCategory as PlaceCategory)
      : "all"
  );
  const [selectedPlace, setSelectedPlace] = useState<Place | null>(null);
  const [viewMode, setViewMode] = useState<"map" | "list">("map");

  useEffect(() => {
    getPlaces().then((places) => {
      setAllPlaces(places);
      setLoading(false);
    });
  }, []);

  const filteredPlaces = useMemo(() => {
    const list = allPlaces.length > 0 ? allPlaces : [];
    return list.filter((place) => {
      const matchesSearch =
        place.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        place.description.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory =
        selectedCategory === "all" || place.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });
  }, [searchQuery, selectedCategory, allPlaces]);

  if (loading) {
    return (
      <div className="h-[calc(100vh-80px)] flex items-center justify-center bg-surface">
        <div className="w-8 h-8 border-2 border-secondary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!hasValidMapKey && viewMode === "map") {
    return <MapKeySplashScreen />;
  }

  return (
    <div className="h-[calc(100vh-80px)] flex flex-col md:flex-row overflow-hidden bg-background">
      <aside className="w-full md:w-96 bg-surface-container-lowest border-r border-outline-variant/30 flex flex-col shadow-sm z-10">
        <div className="p-6 border-b border-outline-variant/20 bg-surface-bright/50">
          <h1 className="text-xl font-bold text-primary mb-4 flex items-center gap-2">
            <MapPin className="text-secondary w-5 h-5" /> Explorar Región
          </h1>
          <div className="relative mb-4">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-outline w-4 h-4" />
            <input
              type="text"
              placeholder="Buscar atractivos, comida..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-surface-container border border-outline-variant rounded-xl text-sm focus:ring-1 focus:ring-secondary outline-none transition-all"
            />
          </div>
          <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
            <CategoryChip
              active={selectedCategory === "all"}
              onClick={() => setSelectedCategory("all")}
              label="Todos"
            />
            <CategoryChip
              active={selectedCategory === PlaceCategory.TURISMO}
              onClick={() => setSelectedCategory(PlaceCategory.TURISMO)}
              label="Turismo"
            />
            <CategoryChip
              active={selectedCategory === PlaceCategory.GASTRONOMIA}
              onClick={() => setSelectedCategory(PlaceCategory.GASTRONOMIA)}
              label="Comida"
            />
            <CategoryChip
              active={selectedCategory === PlaceCategory.COMERCIO}
              onClick={() => setSelectedCategory(PlaceCategory.COMERCIO)}
              label="Comercio"
            />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          <div className="flex justify-between items-center text-xs font-bold text-on-surface-variant uppercase tracking-wider px-2">
            <span>{filteredPlaces.length} Resultados</span>
            <div className="flex gap-1">
              <button
                onClick={() => setViewMode("list")}
                className={`p-1.5 rounded ${
                  viewMode === "list"
                    ? "bg-secondary-container text-on-secondary-container"
                    : "hover:bg-surface-container"
                }`}
              >
                <List className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => setViewMode("map")}
                className={`p-1.5 rounded ${
                  viewMode === "map"
                    ? "bg-secondary-container text-on-secondary-container"
                    : "hover:bg-surface-container"
                }`}
              >
                <Grid3x3 className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {filteredPlaces.length === 0 ? (
            <div className="text-center py-20 opacity-50 space-y-2">
              <Search className="w-10 h-10 mx-auto" />
              <p>No se encontraron resultados</p>
            </div>
          ) : (
            filteredPlaces.map((place) => (
              <PlaceListItem
                key={place.id}
                place={place}
                isSelected={selectedPlace?.id === place.id}
                onClick={() => setSelectedPlace(place)}
              />
            ))
          )}
        </div>
      </aside>

      <div className="flex-1 relative">
        {viewMode === "map" ? (
          <APIProvider apiKey={MAPS_API_KEY} version="weekly">
            <Map
              defaultCenter={DEFAULT_CENTER}
              defaultZoom={DEFAULT_ZOOM}
              mapId={MAP_ID}
              style={{ width: "100%", height: "100%" }}
              disableDefaultUI={false}
              clickableIcons={true}
            >
              {filteredPlaces.map((place) => (
                <AdvancedMarker
                  key={place.id}
                  position={place.coordinates}
                  title={place.name}
                  onClick={() => setSelectedPlace(place)}
                >
                  <Pin
                    background={getCategoryColor(place.category)}
                    glyphColor="#fff"
                    scale={selectedPlace?.id === place.id ? 1.2 : 1.0}
                  />
                </AdvancedMarker>
              ))}
            </Map>
          </APIProvider>
        ) : (
          <div className="h-full bg-surface-container-low/20 p-8 overflow-y-auto">
            <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredPlaces.map((place) => (
                <div
                  key={place.id}
                  className="bg-surface-container-lowest rounded-2xl overflow-hidden shadow-sm border border-outline-variant/30 group hover:shadow-md transition-all"
                >
                  <div className="aspect-video relative overflow-hidden">
                    <img
                      src={place.imageUrl}
                      alt={place.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute top-2 right-2 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-full text-[10px] font-bold text-primary flex items-center gap-1 shadow-sm uppercase tracking-tighter">
                      <Star className="w-3 h-3 text-yellow-500 fill-yellow-500" />{" "}
                      {place.rating}
                    </div>
                  </div>
                  <div className="p-4">
                    <h3 className="font-bold text-primary group-hover:text-secondary transition-colors truncate">
                      {place.name}
                    </h3>
                    <p className="text-xs text-on-surface-variant mb-4 line-clamp-2 mt-1">
                      {place.description}
                    </p>
                    <div className="flex justify-between items-center">
                      <span className="text-[10px] bg-secondary-container text-on-secondary-container px-2 py-1 rounded font-bold uppercase tracking-widest">
                        {place.subcategory || place.category}
                      </span>
                      <Link
                        href={`/explore/${place.id}`}
                        className="text-xs font-bold text-secondary flex items-center gap-1"
                      >
                        Ver más <Navigation className="w-3 h-3" />
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        <AnimatePresence>
          {selectedPlace && viewMode === "map" && (
            <motion.div
              initial={{ x: 400, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: 400, opacity: 0 }}
              className="absolute right-6 top-6 bottom-6 w-80 lg:w-96 bg-surface/95 backdrop-blur-md rounded-3xl shadow-2xl border border-outline-variant/30 flex flex-col z-20 pointer-events-auto"
            >
              <button
                onClick={() => setSelectedPlace(null)}
                className="absolute top-4 right-4 w-8 h-8 rounded-full bg-black/20 hover:bg-black/40 text-white flex items-center justify-center z-30 transition-all border border-white/20"
              >
                ?
              </button>

              <div className="h-64 relative overflow-hidden rounded-t-3xl">
                <img
                  src={selectedPlace.imageUrl}
                  alt={selectedPlace.name}
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent"></div>
                <div className="absolute bottom-4 left-6 text-on-primary">
                  <h2 className="text-xl font-bold mb-1">
                    {selectedPlace.name}
                  </h2>
                  <div className="flex items-center gap-2 text-sm opacity-90">
                    <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />{" "}
                    {selectedPlace.rating} ({selectedPlace.reviewsCount}{" "}
                    reseñas)
                  </div>
                </div>
              </div>

              <div className="flex-1 p-8 overflow-y-auto space-y-6">
                <div>
                  <h4 className="text-[10px] font-bold text-outline uppercase tracking-widest mb-2">
                    Descripción
                  </h4>
                  <p className="text-sm text-on-surface-variant leading-relaxed line-clamp-4">
                    {selectedPlace.description}
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="p-3 bg-surface-container rounded-xl">
                    <h5 className="text-[10px] font-bold text-outline uppercase mb-1">
                      Categoría
                    </h5>
                    <p className="text-xs font-bold text-primary">
                      {selectedPlace.subcategory || selectedPlace.category}
                    </p>
                  </div>
                  <div className="p-3 bg-surface-container rounded-xl">
                    <h5 className="text-[10px] font-bold text-outline uppercase mb-1">
                      Distrito
                    </h5>
                    <p className="text-xs font-bold text-primary">
                      {selectedPlace.district}
                    </p>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center gap-3 text-xs text-on-surface-variant">
                    <MapPin className="w-4 h-4 text-secondary shrink-0" />
                    <span>{selectedPlace.address}</span>
                  </div>
                  {selectedPlace.hours && (
                    <div className="flex items-center gap-3 text-xs text-on-surface-variant">
                      <Info className="w-4 h-4 text-secondary shrink-0" />
                      <span>{selectedPlace.hours}</span>
                    </div>
                  )}
                </div>

                <Link
                  href={`/explore/${selectedPlace.id}`}
                  className="block w-full bg-primary text-on-primary text-center py-4 rounded-xl font-bold shadow-lg hover:opacity-90 transition-all mt-4"
                >
                  Ver Perfil Completo
                </Link>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

function CategoryChip({
  active,
  onClick,
  label,
}: {
  active: boolean;
  onClick: () => void;
  label: string;
}) {
  return (
    <button
      onClick={onClick}
      className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all whitespace-nowrap border ${
        active
          ? "bg-secondary text-on-secondary border-secondary shadow-sm"
          : "bg-surface border-outline-variant text-on-surface-variant hover:bg-surface-container"
      }`}
    >
      {label}
    </button>
  );
}

function PlaceListItem({
  place,
  isSelected,
  onClick,
}: {
  place: Place;
  isSelected: boolean;
  onClick: () => void;
}) {
  return (
    <div
      onClick={onClick}
      className={`p-4 rounded-2xl cursor-pointer border-2 transition-all flex gap-4 bg-surface-container-lowest ${
        isSelected
          ? "border-secondary ring-4 ring-secondary/10 shadow-md"
          : "border-transparent hover:bg-surface-container shadow-sm"
      }`}
    >
      <div className="w-20 h-20 rounded-xl overflow-hidden shrink-0 border border-outline-variant/10">
        <img
          src={place.imageUrl}
          alt={place.name}
          className="w-full h-full object-cover"
          referrerPolicy="no-referrer"
        />
      </div>
      <div className="flex-1 min-w-0">
        <h4 className="font-bold text-primary truncate text-sm">
          {place.name}
        </h4>
        <div className="flex items-center gap-2 text-[10px] text-on-surface-variant mt-1 mb-2">
          <span className="bg-outline-variant/30 px-1.5 py-0.5 rounded font-bold uppercase tracking-tight">
            {place.subcategory || place.category}
          </span>
          <span className="flex items-center gap-0.5">
            <Star className="w-2.5 h-2.5 text-yellow-500 fill-yellow-500" />{" "}
            {place.rating}
          </span>
        </div>
        <div className="flex items-center gap-1.5 text-[10px] text-on-surface-variant">
          <MapPin className="w-3 h-3 text-secondary" />
          <span className="truncate">{place.district}</span>
        </div>
      </div>
    </div>
  );
}

function getCategoryColor(cat: PlaceCategory) {
  switch (cat) {
    case PlaceCategory.TURISMO:
      return "#2f56c2";
    case PlaceCategory.GASTRONOMIA:
      return "#c77858";
    case PlaceCategory.COMERCIO:
      return "#000a38";
    case PlaceCategory.HOSPEDAJE:
      return "#4a4a4a";
    default:
      return "#000a38";
  }
}

function MapKeySplashScreen() {
  return (
    <div className="h-[calc(100vh-80px)] flex items-center justify-center p-8 bg-surface-container-low/30">
      <div className="max-w-xl w-full bg-surface-container-lowest p-12 rounded-[40px] shadow-2xl border border-outline-variant/20 text-center flex flex-col items-center">
        <div className="w-24 h-24 bg-secondary/10 rounded-full flex items-center justify-center mb-8">
          <MapPin className="w-10 h-10 text-secondary" />
        </div>
        <h2 className="text-3xl font-bold text-primary mb-4 tracking-tight">
          Acceso al Mapa Georreferenciado
        </h2>
        <p className="text-on-surface-variant mb-10 leading-relaxed">
          Para visualizar el mapa interactivo de Andahuaylas se requiere una
          clave de Google Maps Platform válida.
        </p>

        <div className="w-full bg-surface-container-low rounded-3xl p-8 text-left space-y-6 mb-10 border border-outline-variant/10">
          <div className="flex gap-4">
            <div className="w-8 h-8 rounded-full bg-primary text-on-primary flex items-center justify-center font-bold text-sm shrink-0">
              1
            </div>
            <div>
              <p className="text-sm font-bold text-primary">
                Configurar Secretos
              </p>
              <p className="text-xs text-on-surface-variant">
                Define <code className="bg-surface-container-highest px-1 rounded">NEXT_PUBLIC_GOOGLE_MAPS_API_KEY</code> en tu{" "}
                <code className="bg-surface-container-highest px-1 rounded">.env.local</code>.
              </p>
            </div>
          </div>
          <div className="flex gap-4">
            <div className="w-8 h-8 rounded-full bg-primary text-on-primary flex items-center justify-center font-bold text-sm shrink-0">
              2
            </div>
            <div>
              <p className="text-sm font-bold text-primary">
                Ingresar Clave
              </p>
              <p className="text-xs text-on-surface-variant">
                Usa tu API key de Google Cloud habilitando Maps JavaScript API y Geocoding API.
              </p>
            </div>
          </div>
        </div>

        <p className="text-[10px] text-outline uppercase tracking-widest">
          Plataforma de Información Turística Centralizada
        </p>
      </div>
    </div>
  );
}
