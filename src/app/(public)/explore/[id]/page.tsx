"use client";

import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { useEffect, useState } from "react";
import {
  MapPin,
  Clock,
  Phone,
  Globe,
  Share2,
  Heart,
  Star,
  ArrowLeft,
  Navigation,
  Info,
  Camera,
  Calendar,
  Flag,
} from "lucide-react";
import { motion } from "motion/react";
import { Place } from "@/types";
import { getPlaceById, getPlaces } from "@/lib/supabase/queries";

export default function PlaceDetails() {
  const { id } = useParams();
  const router = useRouter();
  const [place, setPlace] = useState<Place | null>(null);
  const [relatedItems, setRelatedItems] = useState<Place[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (typeof id !== "string") return;
    getPlaceById(id).then((p) => {
      if (p) {
        setPlace(p);
        getPlaces().then((all) => {
          setRelatedItems(all.filter((x) => x.id !== p.id).slice(0, 3));
        });
      }
      setLoading(false);
    });
  }, [id]);

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center bg-surface">
        <div className="w-8 h-8 border-2 border-secondary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!place) {
    return (
      <div className="h-screen flex items-center justify-center">
        <p>Lugar no encontrado</p>
      </div>
    );
  }

  return (
    <div className="bg-background min-h-screen pb-20 font-sans">
      <section className="relative h-[550px] w-full overflow-hidden">
        <img
          src={place.imageUrl}
          alt={place.name}
          className="w-full h-full object-cover"
          referrerPolicy="no-referrer"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-black/30"></div>

        <div className="absolute top-8 left-8 z-20">
          <Link
            href="/explore"
            className="bg-white/20 backdrop-blur-md hover:bg-white/40 text-on-primary px-4 py-2 rounded-full flex items-center gap-2 transition-all border border-white/20 group"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />{" "}
            Volver a explorar
          </Link>
        </div>

        <div className="absolute bottom-12 left-1/2 -translate-x-1/2 max-w-7xl w-full px-8 flex justify-between items-end">
          <div>
            <div className="flex items-center gap-3 mb-4">
              <span className="bg-secondary text-on-secondary px-3 py-1 rounded-full text-xs font-bold uppercase tracking-widest shadow-lg">
                {place.subcategory || place.category}
              </span>
              <div className="flex items-center gap-1 text-white bg-black/30 backdrop-blur-sm px-2 py-1 rounded-full text-xs font-bold border border-white/10">
                <Star className="w-3.5 h-3.5 text-yellow-500 fill-yellow-500" />{" "}
                {place.rating}
              </div>
            </div>
            <h1 className="text-4xl md:text-6xl font-black text-on-primary tracking-tight drop-shadow-xl">
              {place.name}
            </h1>
            <div className="flex items-center gap-4 text-white/80 mt-4 font-medium">
              <div className="flex items-center gap-1.5">
                <MapPin className="w-4 h-4 text-secondary" /> {place.district},
                Andahuaylas
              </div>
              <div className="w-1.5 h-1.5 rounded-full bg-white/20"></div>
              <div className="flex items-center gap-1.5">
                <Clock className="w-4 h-4 text-secondary" /> Abierto ahora
              </div>
            </div>
          </div>

          <div className="flex gap-3">
            <button className="bg-white/10 backdrop-blur-md hover:bg-white/20 p-3 rounded-2xl text-white border border-white/20 transition-all shadow-lg">
              <Share2 className="w-6 h-6" />
            </button>
            <button className="bg-white/10 backdrop-blur-md hover:bg-white/20 p-3 rounded-2xl text-white border border-white/20 transition-all shadow-lg">
              <Heart className="w-6 h-6" />
            </button>
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-8 -mt-10 relative z-30">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          <div className="lg:col-span-2 space-y-12">
            <div className="bg-surface p-10 rounded-[40px] shadow-sm border border-outline-variant/10">
              <h3 className="text-2xl font-bold text-primary mb-6 flex items-center gap-3">
                <Info className="w-6 h-6 text-secondary" /> Sobre este lugar
              </h3>
              <p className="text-on-surface-variant leading-loose text-lg whitespace-pre-wrap">
                {place.description}
              </p>

              <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mt-12 border-t border-outline-variant/20 pt-10">
                <DetailItem
                  icon={<Calendar className="text-secondary" />}
                  label="Fundado"
                  value="Cultura Chanka"
                />
                <DetailItem
                  icon={<Navigation className="text-secondary" />}
                  label="Altitud"
                  value="3,126 msnm"
                />
                <DetailItem
                  icon={<Flag className="text-secondary" />}
                  label="Estado"
                  value="Conservado"
                />
                <DetailItem
                  icon={<Camera className="text-secondary" />}
                  label="Vista"
                  value="Panorámica"
                />
              </div>
            </div>

            {place.gallery && place.gallery.length > 0 && (
              <div className="space-y-6">
                <h3 className="text-2xl font-bold text-primary px-4">
                  Galería Visual
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4 h-[400px]">
                  <div className="col-span-2 row-span-2 rounded-3xl overflow-hidden border border-outline-variant/20">
                    <img
                      src={place.gallery[0]}
                      alt="Gallery 1"
                      className="w-full h-full object-cover hover:scale-105 transition-transform duration-700"
                      referrerPolicy="no-referrer"
                    />
                  </div>
                  {place.gallery.slice(1, 3).map((img, i) => (
                    <div
                      key={i}
                      className="rounded-3xl overflow-hidden border border-outline-variant/20"
                    >
                      <img
                        src={img}
                        alt={`Gallery ${i + 2}`}
                        className="w-full h-full object-cover hover:scale-105 transition-transform duration-700"
                        referrerPolicy="no-referrer"
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="space-y-6">
              <div className="flex justify-between items-center px-4">
                <h3 className="text-2xl font-bold text-primary">
                  Actividades Vinculadas
                </h3>
                <span className="text-sm font-bold text-secondary uppercase tracking-widest">
                  Sugerencias locales
                </span>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {relatedItems.map((item) => (
                  <Link
                    key={item.id}
                    href={"/explore/" + item.id}
                    className="bg-surface-container-low border border-outline-variant/10 rounded-3xl p-4 hover:shadow-lg transition-all group"
                  >
                    <div className="aspect-square rounded-2xl overflow-hidden mb-4 relative">
                      <img
                        src={item.imageUrl}
                        alt={item.name}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                        referrerPolicy="no-referrer"
                      />
                      <div className="absolute top-2 left-2 bg-black/40 backdrop-blur-sm text-white px-2 py-0.5 rounded-full text-[10px] font-bold uppercase">
                        {item.category}
                      </div>
                    </div>
                    <h4 className="font-bold text-primary truncate group-hover:text-secondary transition-colors mb-1">
                      {item.name}
                    </h4>
                    <p className="text-[10px] text-on-surface-variant flex items-center gap-1 uppercase tracking-wider">
                      <MapPin className="w-3 h-3 text-secondary" />{" "}
                      {item.district}
                    </p>
                  </Link>
                ))}
              </div>
            </div>
          </div>

          <div className="space-y-8">
            <div className="bg-primary/95 backdrop-blur-lg p-10 rounded-[40px] text-on-primary shadow-2xl relative overflow-hidden">
              <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/2 w-40 h-40 bg-secondary/20 rounded-full blur-3xl"></div>
              <h3 className="text-xl font-bold mb-8">
                Información de Visita
              </h3>

              <div className="space-y-6">
                <SidebarInfoItem
                  icon={<Clock className="text-secondary/80 w-5 h-5 shrink-0" />}
                  label="Horario"
                  value={place.hours || "Acceso Libre"}
                />
                <SidebarInfoItem
                  icon={
                    <Navigation className="text-secondary/80 w-5 h-5 shrink-0" />
                  }
                  label="Dirección"
                  value={place.address || "Andahuaylas"}
                />
                {place.priceRange && (
                  <SidebarInfoItem
                    icon={<Star className="text-secondary/80 w-5 h-5 shrink-0" />}
                    label="Tarifa"
                    value={place.priceRange}
                  />
                )}
                {place.phone && (
                  <SidebarInfoItem
                    icon={<Phone className="text-secondary/80 w-5 h-5 shrink-0" />}
                    label="Contacto"
                    value={place.phone}
                  />
                )}
              </div>

              <div className="mt-12 pt-8 border-t border-white/10 space-y-4">
                <button className="w-full bg-secondary text-on-secondary py-4 rounded-2xl font-bold shadow-lg hover:opacity-90 transition-all flex items-center justify-center gap-2">
                  <Navigation className="w-5 h-5" /> Iniciar Ruta
                </button>
                <button className="w-full bg-white/10 text-white border border-white/20 py-4 rounded-2xl font-bold hover:bg-white/20 transition-all">
                  Ver en Google Maps
                </button>
              </div>
            </div>

            <div className="bg-surface-container-low p-8 rounded-[40px] border border-outline-variant/30">
              <div className="flex justify-between items-center mb-6">
                <h4 className="font-bold text-primary">Reseñas Recientes</h4>
                <div className="text-xs font-bold text-secondary">
                  {place.reviewsCount} total
                </div>
              </div>
              <div className="space-y-6">
                <div className="bg-white/50 p-4 rounded-2xl border border-outline-variant/20">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-6 h-6 rounded-full bg-secondary text-on-secondary flex items-center justify-center text-[10px] font-bold">
                      JD
                    </div>
                    <span className="text-xs font-bold text-primary">
                      Juan Delgado
                    </span>
                  </div>
                  <p className="text-xs text-on-surface-variant italic">
                    &ldquo;Una experiencia increíble, el complejo de Sóndor es mágico al
                    atardecer. Recomendado 100%.&rdquo;
                  </p>
                </div>
                <button className="w-full text-center text-xs font-bold text-secondary uppercase tracking-widest hover:underline">
                  Ver todas las reseñas
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function DetailItem({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="flex flex-col gap-1 items-center md:items-start">
      <div className="bg-surface-container-high p-2 rounded-lg mb-2">
        {icon}
      </div>
      <span className="text-[10px] font-bold text-outline uppercase tracking-wider">
        {label}
      </span>
      <span className="text-sm font-bold text-primary">{value}</span>
    </div>
  );
}

function SidebarInfoItem({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-start gap-4">
      {icon}
      <div>
        <h5 className="text-[10px] font-bold text-surface-bright/50 uppercase tracking-widest mb-1">
          {label}
        </h5>
        <p className="text-sm font-medium">{value}</p>
      </div>
    </div>
  );
}
