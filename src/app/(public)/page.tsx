"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import {
  MapPin,
  Utensils,
  Store,
  Building2,
  ArrowRight,
  Map as MapIcon,
  Landmark,
  TreePine,
} from "lucide-react";
import { motion } from "motion/react";
import { PlaceCategory } from "@/types";
import { Place } from "@/types";
import { getPlaces } from "@/lib/supabase/queries";
import SearchBar from "@/components/SearchBar";
import {
  APIProvider,
  Map,
  AdvancedMarker,
  Pin,
} from "@vis.gl/react-google-maps";
import {
  MAPS_API_KEY,
  MAP_ID,
  DEFAULT_CENTER,
  DEFAULT_ZOOM,
  hasValidMapKey,
} from "@/lib/maps/config";

export default function Home() {
  const router = useRouter();
  const [places, setPlaces] = useState<Place[]>([]);

  useEffect(() => {
    getPlaces().then(setPlaces);
  }, []);

  const turismoPlaces = places.filter(
    (p) => p.category === PlaceCategory.TURISMO
  );

  return (
    <div className="w-full">
      <section className="relative h-[650px] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img
            src="/images/celajes.jpg"
            alt="Andean Landscape"
            className="w-full h-full object-cover"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-primary/60 via-primary/30 to-background z-10"></div>
        </div>

        <div className="relative z-20 max-w-7xl mx-auto px-4 text-center flex flex-col items-center">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-5xl md:text-7xl font-bold text-on-primary mb-6 drop-shadow-lg tracking-tight"
          >
            Descubre la Pradera de los Celajes
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-lg md:text-xl text-white mb-10 max-w-2xl drop-shadow-sm leading-relaxed"
          >
            Tu plataforma integral para explorar el patrimonio, comercio y
            cultura de la región Apurímac.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
            className="mb-10 w-full flex justify-center"
          >
            <SearchBar variant="hero" />
          </motion.div>

          <div className="flex flex-wrap justify-center gap-3">
            <PillButton icon={<TreePine className="w-4 h-4" />} label="Turismo" onClick={() => router.push("/explore?cat=turismo")} />
            <PillButton icon={<Utensils className="w-4 h-4" />} label="Gastronomía" onClick={() => router.push("/explore?cat=gastronomia")} />
            <PillButton icon={<Store className="w-4 h-4" />} label="Comercio" onClick={() => router.push("/explore?cat=comercio")} />
            <PillButton icon={<Building2 className="w-4 h-4" />} label="Hospedaje" onClick={() => router.push("/explore?cat=hospedaje")} />
          </div>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 py-20">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          <StatCard
            icon={<TreePine className="text-secondary" />}
            value={String(turismoPlaces.length || 0)}
            label="Atractivos"
            color="bg-secondary-container/20"
          />
          <StatCard
            icon={<Utensils className="text-tertiary" />}
            value={String(places.filter((p) => p.category === PlaceCategory.GASTRONOMIA).length || 0)}
            label="Restaurantes"
            color="bg-tertiary-container/10"
          />
          <StatCard
            icon={<Store className="text-primary" />}
            value={String(places.filter((p) => p.category === PlaceCategory.COMERCIO).length || 0)}
            label="Comercios"
            color="bg-primary-container/10"
          />
          <StatCard
            icon={<MapIcon className="text-secondary" />}
            value={String(new Set(places.map((p) => p.district)).size || 0)}
            label="Distritos"
            color="bg-secondary-container/20"
          />
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 py-20 bg-surface-container-low/30 rounded-3xl mb-20 border border-outline-variant/10">
        <div className="flex justify-between items-end mb-12">
          <div>
            <h2 className="text-3xl font-bold text-primary mb-2">
              Atractivos Destacados
            </h2>
            <p className="text-on-surface-variant">
              Explora las maravillas arqueológicas y naturales de la región.
            </p>
          </div>
          <Link
            href="/explore"
            className="text-secondary hover:text-secondary-container font-bold flex items-center gap-1 transition-all group"
          >
            Ver todos{" "}
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {turismoPlaces.slice(0, 3).map((place, idx) => (
            <motion.div
              key={place.id}
              whileHover={{ y: -8 }}
              className={`group relative rounded-2xl overflow-hidden shadow-md bg-surface-container-lowest h-80 ${
                idx === 0 ? "md:col-span-2" : ""
              }`}
            >
              <img
                src={place.imageUrl}
                alt={place.name}
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-primary/90 via-primary/40 to-transparent"></div>
              <div className="absolute bottom-0 left-0 p-8 w-full">
                <span className="bg-tertiary-fixed text-on-tertiary-fixed-variant px-3 py-1 rounded-full text-xs font-bold uppercase tracking-widest inline-block mb-3">
                  {place.subcategory}
                </span>
                <h3 className="text-2xl font-bold text-on-primary mb-2">
                  {place.name}
                </h3>
                <Link
                  href={`/explore/${place.id}`}
                  className="text-on-primary/80 text-sm hover:text-white flex items-center gap-1"
                >
                  Ver detalles <ArrowRight className="w-3 h-3" />
                </Link>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 py-24 border-y border-outline-variant/20 mb-20">
        <div className="flex flex-col md:flex-row items-center gap-16">
          <div className="w-full md:w-1/3 flex flex-col">
            <h2 className="text-3xl font-bold text-primary mb-4">
              Navega la Región
            </h2>
            <p className="text-on-surface-variant mb-8 leading-relaxed">
              Encuentra fácilmente los mejores puntos de interés, restaurantes y
              servicios locales en nuestro mapa interactivo georreferenciado.
            </p>
            <div className="space-y-4 mb-8">
              <div className="flex items-start gap-4 p-4 bg-surface-container-lowest rounded-xl shadow-sm border border-outline-variant/20">
                <MapPin className="text-secondary w-5 h-5 mt-1" />
                <div>
                  <h4 className="font-bold text-primary">
                    Andahuaylas Centro
                  </h4>
                  <p className="text-xs text-on-surface-variant">
                    Zona comercial y gastronómica.
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-4 p-4 bg-surface-container-lowest rounded-xl shadow-sm border border-outline-variant/20">
                <Landmark className="text-tertiary-container w-5 h-5 mt-1" />
                <div>
                  <h4 className="font-bold text-primary">Ruta Chanka</h4>
                  <p className="text-xs text-on-surface-variant">
                    Sitios arqueológicos principales.
                  </p>
                </div>
              </div>
            </div>
            <Link
              href="/explore"
              className="bg-primary text-on-primary px-8 py-4 rounded-xl font-bold shadow-lg hover:bg-primary-container transition-all flex items-center justify-center gap-2 w-full md:w-fit"
            >
              <MapIcon className="w-5 h-5" /> Abrir Mapa Completo
            </Link>
          </div>
          <div className="w-full md:w-2/3 aspect-video rounded-3xl overflow-hidden shadow-2xl relative border-8 border-surface-container-lowest">
            {hasValidMapKey ? (
              <APIProvider apiKey={MAPS_API_KEY}>
                <Map
                  mapId={MAP_ID}
                  defaultZoom={DEFAULT_ZOOM}
                  defaultCenter={DEFAULT_CENTER}
                  gestureHandling="cooperative"
                  className="w-full h-full"
                >
                  {places.map((place) => (
                    <AdvancedMarker
                      key={place.id}
                      position={{ lat: place.coordinates.lat, lng: place.coordinates.lng }}
                    >
                      <Pin
                        background={
                          place.category === PlaceCategory.TURISMO
                            ? "#16a34a"
                            : place.category === PlaceCategory.GASTRONOMIA
                            ? "#ea580c"
                            : place.category === PlaceCategory.COMERCIO
                            ? "#2563eb"
                            : "#7c3aed"
                        }
                        glyphColor="#fff"
                        borderColor="#fff"
                      />
                    </AdvancedMarker>
                  ))}
                </Map>
              </APIProvider>
            ) : (
              <div className="w-full h-full bg-surface-variant flex items-center justify-center">
                <div className="bg-white/90 backdrop-blur px-6 py-3 rounded-full shadow-lg border border-outline-variant flex items-center gap-3">
                  <div className="w-3 h-3 bg-green-500 rounded-full animate-ping"></div>
                  <span className="font-bold text-primary">
                    Navegación Interactiva Activa
                  </span>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}

function PillButton({
  icon,
  label,
  onClick,
}: {
  icon: React.ReactNode;
  label: string;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className="bg-surface-bright/90 backdrop-blur-sm border border-outline-variant/50 text-primary px-5 py-2.5 rounded-full font-medium shadow-sm hover:bg-secondary hover:text-on-secondary transition-all flex items-center gap-2 group"
    >
      <span className="text-secondary group-hover:text-current">{icon}</span>
      {label}
    </button>
  );
}

function StatCard({
  icon,
  value,
  label,
  color,
}: {
  icon: React.ReactNode;
  value: string;
  label: string;
  color: string;
}) {
  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      className="bg-surface-container-lowest rounded-2xl p-8 shadow-sm border border-outline-variant/20 flex flex-col items-center text-center group"
    >
      <div
        className={`${color} p-4 rounded-full mb-6 group-hover:scale-110 transition-transform`}
      >
        {icon}
      </div>
      <span className="text-4xl font-bold text-primary mb-1">{value}</span>
      <span className="text-xs text-on-surface-variant font-bold uppercase tracking-widest">
        {label}
      </span>
    </motion.div>
  );
}
