"use client";

import { useEffect, useState } from "react";
import {
  Users,
  Eye,
  Landmark,
  Star,
  ArrowUpRight,
  ArrowDownRight,
  MapPin,
  Clock,
  MoreVertical,
  Search as SearchIcon,
  Filter,
} from "lucide-react";
import { motion } from "motion/react";
import { Place, PlaceStatus } from "@/types";
import { getPlaces } from "@/lib/supabase/queries";

export default function AdminDashboard() {
  const [places, setPlaces] = useState<Place[]>([]);

  useEffect(() => {
    getPlaces().then(setPlaces);
  }, []);

  const activeCount = places.filter(
    (p) => p.status === PlaceStatus.ACTIVE
  ).length;

  return (
    <div className="p-8 space-y-8 max-w-7xl mx-auto">
      <header className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-bold text-primary tracking-tight">
            Panel de Control
          </h1>
          <p className="text-on-surface-variant mt-1">
            Monitorea el movimiento turístico y comercial de la región.
          </p>
        </div>
        <div className="flex gap-3">
          <div className="bg-surface-container-highest px-4 py-2 rounded-xl text-sm font-medium border border-outline-variant/30 flex items-center gap-2">
            <Clock className="w-4 h-4 text-secondary" />Últimas 24 horas
          </div>
        </div>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatWidget
          label="Visitas Totales"
          value="12,450"
          trend="+12.5%"
          isPositive={true}
          icon={<Eye className="w-5 h-5 text-secondary" />}
        />
        <StatWidget
          label="Lugares Activos"
          value={String(activeCount)}
          trend="0%"
          isPositive={true}
          icon={<Landmark className="w-5 h-5 text-tertiary" />}
        />
        <StatWidget
          label="Promedio Región"
          value="4.7"
          trend="+0.2"
          isPositive={true}
          icon={<Star className="w-5 h-5 text-secondary" />}
        />
        <StatWidget
          label="Nuevos Partner"
          value="5"
          trend="-2"
          isPositive={false}
          icon={<Users className="w-5 h-5 text-primary" />}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-surface-container-lowest rounded-[32px] shadow-sm border border-outline-variant/20 overflow-hidden">
          <div className="p-8 border-b border-outline-variant/20 flex justify-between items-center">
            <h3 className="font-bold text-primary">Estado de Listings</h3>
            <div className="flex items-center gap-2">
              <div className="relative">
                <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-outline w-3.5 h-3.5" />
                <input
                  type="text"
                  placeholder="Filtrar..."
                  className="pl-9 pr-4 py-1.5 bg-surface-container text-xs rounded-lg border border-outline-variant/30 outline-none w-40"
                />
              </div>
              <button className="p-1.5 bg-surface-container rounded-lg border border-outline-variant/30">
                <Filter className="w-4 h-4 text-on-surface-variant" />
              </button>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-surface-container-low/50">
                <tr>
                  <th className="px-8 py-4 text-[10px] font-bold text-outline uppercase tracking-wider">
                    Establecimiento
                  </th>
                  <th className="px-8 py-4 text-[10px] font-bold text-outline uppercase tracking-wider">
                    Categoría
                  </th>
                  <th className="px-8 py-4 text-[10px] font-bold text-outline uppercase tracking-wider">
                    Estado
                  </th>
                  <th className="px-8 py-4 text-[10px] font-bold text-outline uppercase tracking-wider">
                    Rendimiento
                  </th>
                  <th className="px-8 py-4"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-outline-variant/10">
                {places.map((place) => (
                  <tr
                    key={place.id}
                    className="hover:bg-surface-container/30 transition-colors group"
                  >
                    <td className="px-8 py-5">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-lg overflow-hidden bg-surface-variant shrink-0">
                          <img
                            src={place.imageUrl}
                            alt=""
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div>
                          <p className="text-sm font-bold text-primary">
                            {place.name}
                          </p>
                          <p className="text-xs text-on-surface-variant font-medium flex items-center gap-1">
                            <MapPin className="w-3 h-3 text-secondary" />{" "}
                            {place.district}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-5">
                      <span className="text-[10px] font-bold text-on-surface-variant bg-surface-container-high px-2 py-1 rounded uppercase">
                        {place.category}
                      </span>
                    </td>
                    <td className="px-8 py-5">
                      <div className="flex items-center gap-2">
                        <div
                          className={`w-2 h-2 rounded-full ${
                            place.status === PlaceStatus.ACTIVE
                              ? "bg-green-500"
                              : "bg-amber-500 animate-pulse"
                          }`}
                        ></div>
                        <span className="text-xs font-bold text-on-surface capitalize">
                          {place.status === PlaceStatus.ACTIVE
                            ? "Activo"
                            : "Pendiente"}
                        </span>
                      </div>
                    </td>
                    <td className="px-8 py-5">
                      <div className="flex items-center gap-3">
                        <div className="flex-1 h-1.5 bg-surface-container rounded-full overflow-hidden">
                          <div
                            className="h-full bg-secondary rounded-full"
                            style={{ width: `${place.rating * 20}%` }}
                          ></div>
                        </div>
                        <span className="text-xs font-bold text-primary">
                          {place.rating}
                        </span>
                      </div>
                    </td>
                    <td className="px-8 py-5 text-right">
                      <button className="p-2 hover:bg-surface-container rounded-full text-on-surface-variant transition-all">
                        <MoreVertical className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-primary p-8 rounded-[32px] text-on-primary shadow-lg relative overflow-hidden h-fit">
            <div className="absolute top-0 right-0 p-4 opacity-10">
              <BarChartWidget />
            </div>
            <h4 className="text-lg font-bold mb-4">Meta Semanal</h4>
            <p className="text-sm opacity-80 mb-6">
              Has alcanzado el 85% de las visitas proyectadas para la Ruta
              Chanka.
            </p>
            <div className="bg-white/10 rounded-2xl p-4 flex justify-between items-end border border-white/5">
              <div>
                <p className="text-[10px] uppercase font-bold tracking-widest opacity-60">
                  Visitas
                </p>
                <p className="text-2xl font-black">2,840</p>
              </div>
              <div className="text-xs font-bold text-secondary-fixed bg-secondary-container/30 px-2 py-1 rounded flex items-center gap-1">
                <ArrowUpRight className="w-3 h-3" /> +15%
              </div>
            </div>
          </div>

          <div className="bg-surface-container-lowest p-8 rounded-[32px] border border-outline-variant/20 shadow-sm h-fit">
            <h4 className="font-bold text-primary mb-6">
              Comentarios Recientes
            </h4>
            <div className="space-y-6">
              {[1, 2].map((i) => (
                <div key={i} className="flex gap-4 group cursor-pointer">
                  <div className="w-10 h-10 rounded-full bg-surface-container flex items-center justify-center font-bold text-xs shrink-0 group-hover:bg-secondary-container group-hover:text-on-secondary-container transition-all">
                    {i === 1 ? "MA" : "RS"}
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-sm font-bold text-on-surface">
                        {i === 1 ? "Maria Alva" : "Raúl Soto"}
                      </span>
                      <span className="text-[10px] text-on-surface-variant">
                        2h ago
                      </span>
                    </div>
                    <p className="text-xs text-on-surface-variant line-clamp-2 leading-relaxed">
                      {i === 1
                        ? 'El restaurante "La Pradera" mejoró su servicio, excelente atención.'
                        : "Falta actualizar los horarios de Sóndor por temporada de lluvias."}
                    </p>
                  </div>
                </div>
              ))}
              <button className="w-full py-2 text-xs font-bold text-secondary uppercase hover:underline">
                Ver todas las reseñas
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function StatWidget({
  label,
  value,
  trend,
  isPositive,
  icon,
}: {
  label: string;
  value: string;
  trend: string;
  isPositive: boolean;
  icon: React.ReactNode;
}) {
  return (
    <motion.div
      whileHover={{ y: -4 }}
      className="bg-surface-container-lowest p-6 rounded-3xl shadow-sm border border-outline-variant/10 flex flex-col group"
    >
      <div className="flex justify-between items-start mb-4">
        <div className="bg-surface-container-high p-3 rounded-2xl group-hover:scale-110 transition-transform">
          {icon}
        </div>
        <div
          className={`flex items-center gap-1 px-2 py-1 rounded-md text-[10px] font-bold ${
            isPositive
              ? "bg-secondary-container text-on-secondary-container"
              : "bg-tertiary-container text-on-tertiary-container"
          }`}
        >
          {isPositive ? (
            <ArrowUpRight className="w-3 h-3" />
          ) : (
            <ArrowDownRight className="w-3 h-3" />
          )}
          {trend}
        </div>
      </div>
      <span className="text-[10px] font-bold text-outline uppercase tracking-widest">
        {label}
      </span>
      <span className="text-2xl font-black text-primary mt-1 tracking-tight">
        {value}
      </span>
    </motion.div>
  );
}

function BarChartWidget() {
  return (
    <svg
      width="60"
      height="60"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <line x1="18" y1="20" x2="18" y2="10" />
      <line x1="12" y1="20" x2="12" y2="4" />
      <line x1="6" y1="20" x2="6" y2="14" />
    </svg>
  );
}
