"use client";

import { useEffect, useState } from "react";
import { Eye, Landmark, Star, Users, ArrowUpRight, ArrowDownRight } from "lucide-react";
import { Place, PlaceStatus } from "@/types";
import { getPlaces } from "@/lib/supabase/queries";

export default function DashboardStats() {
  const [places, setPlaces] = useState<Place[]>([]);

  useEffect(() => {
    getPlaces().then(setPlaces).catch(() => setPlaces([]));
  }, []);

  const total = places.length;
  const active = places.filter((p) => p.status === PlaceStatus.ACTIVE).length;
  const avgRating =
    total > 0
      ? (places.reduce((s, p) => s + p.rating, 0) / total).toFixed(1)
      : "0.0";
  const pending = places.filter((p) => p.status === PlaceStatus.INACTIVE).length;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <StatWidget
        label="Visitas Totales"
        value="—"
        trend="—"
        isPositive={true}
        icon={<Eye className="w-5 h-5 text-secondary" />}
      />
      <StatWidget
        label="Lugares Activos"
        value={String(active)}
        trend={total > 0 ? `${Math.round((active / total) * 100)}%` : "0%"}
        isPositive={true}
        icon={<Landmark className="w-5 h-5 text-tertiary" />}
      />
      <StatWidget
        label="Promedio Región"
        value={avgRating}
        trend={avgRating !== "0.0" ? `★ ${avgRating}` : "—"}
        isPositive={true}
        icon={<Star className="w-5 h-5 text-secondary" />}
      />
      <StatWidget
        label="Pendientes"
        value={String(pending)}
        trend={pending > 0 ? "Requieren revisión" : "Sin pendientes"}
        isPositive={pending === 0}
        icon={<Users className="w-5 h-5 text-primary" />}
      />
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
    <div className="bg-surface-container-lowest p-6 rounded-3xl shadow-sm border border-outline-variant/10 flex flex-col group">
      <div className="flex justify-between items-start mb-4">
        <div className="bg-surface-container-high p-3 rounded-2xl">{icon}</div>
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
    </div>
  );
}
