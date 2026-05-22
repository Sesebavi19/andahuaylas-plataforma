"use client";

import { useState, useEffect } from "react";
import {
  BarChart3,
  MapPin,
  TreePine,
  Utensils,
  Store,
  Building2,
  TrendingUp,
  Users,
  Activity,
} from "lucide-react";
import { PlaceCategory, PlaceStatus } from "@/types";
import { Place } from "@/types";
import { getPlaces } from "@/lib/supabase/queries";

export default function AnalyticsPage() {
  const [places, setPlaces] = useState<Place[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getPlaces().then((data) => {
      setPlaces(data);
      setLoading(false);
    });
  }, []);

  if (loading) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-secondary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const total = places.length;
  const active = places.filter((p) => p.status === PlaceStatus.ACTIVE).length;
  const inactive = total - active;

  const categories = Object.values(PlaceCategory).map((cat) => ({
    name: cat,
    count: places.filter((p) => p.category === cat).length,
  }));

  const districts = places.reduce<Record<string, number>>((acc, p) => {
    acc[p.district] = (acc[p.district] || 0) + 1;
    return acc;
  }, {});

  const topDistricts = Object.entries(districts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5);

  const catIcons: Record<string, React.ReactNode> = {
    [PlaceCategory.TURISMO]: <TreePine className="w-5 h-5 text-green-600" />,
    [PlaceCategory.GASTRONOMIA]: (
      <Utensils className="w-5 h-5 text-orange-600" />
    ),
    [PlaceCategory.COMERCIO]: <Store className="w-5 h-5 text-blue-600" />,
    [PlaceCategory.HOSPEDAJE]: (
      <Building2 className="w-5 h-5 text-purple-600" />
    ),
  };

  const catColors: Record<string, string> = {
    [PlaceCategory.TURISMO]: "bg-green-500",
    [PlaceCategory.GASTRONOMIA]: "bg-orange-500",
    [PlaceCategory.COMERCIO]: "bg-blue-500",
    [PlaceCategory.HOSPEDAJE]: "bg-purple-500",
  };

  return (
    <div className="p-8 space-y-8 max-w-7xl mx-auto">
      <header>
        <h1 className="text-3xl font-bold text-primary tracking-tight">
          Analíticas
        </h1>
        <p className="text-on-surface-variant mt-1">
          Estadísticas generales de los lugares registrados.
        </p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-surface-container-lowest rounded-2xl p-6 border border-outline-variant/20">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-3 bg-primary/10 rounded-xl">
              <MapPin className="w-5 h-5 text-primary" />
            </div>
          </div>
          <p className="text-3xl font-bold text-primary">{total}</p>
          <p className="text-xs text-on-surface-variant mt-1 uppercase tracking-wider font-bold">
            Total Lugares
          </p>
        </div>

        <div className="bg-surface-container-lowest rounded-2xl p-6 border border-outline-variant/20">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-3 bg-green-100 rounded-xl">
              <Activity className="w-5 h-5 text-green-600" />
            </div>
          </div>
          <p className="text-3xl font-bold text-primary">{active}</p>
          <p className="text-xs text-on-surface-variant mt-1 uppercase tracking-wider font-bold">
            Activos
          </p>
        </div>

        <div className="bg-surface-container-lowest rounded-2xl p-6 border border-outline-variant/20">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-3 bg-red-100 rounded-xl">
              <BarChart3 className="w-5 h-5 text-red-500" />
            </div>
          </div>
          <p className="text-3xl font-bold text-primary">{inactive}</p>
          <p className="text-xs text-on-surface-variant mt-1 uppercase tracking-wider font-bold">
            Inactivos
          </p>
        </div>

        <div className="bg-surface-container-lowest rounded-2xl p-6 border border-outline-variant/20">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-3 bg-blue-100 rounded-xl">
              <TrendingUp className="w-5 h-5 text-blue-600" />
            </div>
          </div>
          <p className="text-3xl font-bold text-primary">
            {Object.keys(districts).length}
          </p>
          <p className="text-xs text-on-surface-variant mt-1 uppercase tracking-wider font-bold">
            Distritos
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-surface-container-lowest rounded-2xl p-6 border border-outline-variant/20">
          <h3 className="font-bold text-primary mb-6 flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-secondary" /> Distribución por
            Categoría
          </h3>
          <div className="space-y-4">
            {categories.map((cat) => {
              const pct = total > 0 ? Math.round((cat.count / total) * 100) : 0;
              return (
                <div key={cat.name}>
                  <div className="flex items-center justify-between mb-1.5">
                    <div className="flex items-center gap-2 text-sm font-medium text-on-surface">
                      {catIcons[cat.name] || (
                        <MapPin className="w-5 h-5" />
                      )}
                      <span className="capitalize">{cat.name}</span>
                    </div>
                    <span className="text-sm font-bold text-on-surface-variant">
                      {cat.count} ({pct}%)
                    </span>
                  </div>
                  <div className="w-full bg-surface-variant rounded-full h-2.5 overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all ${
                        catColors[cat.name] || "bg-primary"
                      }`}
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="bg-surface-container-lowest rounded-2xl p-6 border border-outline-variant/20">
          <h3 className="font-bold text-primary mb-6 flex items-center gap-2">
            <MapPin className="w-5 h-5 text-secondary" /> Top Distritos
          </h3>
          <div className="space-y-4">
            {topDistricts.length === 0 && (
              <p className="text-on-surface-variant text-sm">
                No hay distritos registrados.
              </p>
            )}
            {topDistricts.map(([district, count], idx) => {
              const maxCount = topDistricts[0]?.[1] || 1;
              const barWidth = (count / maxCount) * 100;
              return (
                <div key={district}>
                  <div className="flex items-center justify-between mb-1.5">
                    <div className="flex items-center gap-2 text-sm font-medium text-on-surface">
                      <span className="w-5 h-5 rounded-full bg-secondary-container text-on-secondary-container text-xs font-bold flex items-center justify-center">
                        {idx + 1}
                      </span>
                      {district}
                    </div>
                    <span className="text-sm font-bold text-on-surface-variant">
                      {count}
                    </span>
                  </div>
                  <div className="w-full bg-surface-variant rounded-full h-2.5 overflow-hidden">
                    <div
                      className="h-full rounded-full bg-secondary transition-all"
                      style={{ width: `${barWidth}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
