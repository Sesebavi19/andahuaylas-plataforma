"use client";

import { useState, useEffect } from "react";
import { Star, Trash2, Loader2, BarChart3, MessageSquare } from "lucide-react";
import {
  getValoraciones,
  deleteValoracion,
  Valoracion,
} from "@/lib/supabase/queries";

export default function ReviewsPage() {
  const [valoraciones, setValoraciones] = useState<Valoracion[]>([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const load = async () => {
    setLoading(true);
    const data = await getValoraciones();
    setValoraciones(data);
    setLoading(false);
  };

  useEffect(() => {
    load();
  }, []);

  const handleDelete = async (id: string) => {
    if (!confirm("¿Eliminar esta valoración?")) return;
    setDeletingId(id);
    const ok = await deleteValoracion(id);
    if (ok) {
      setValoraciones((prev) => prev.filter((v) => v.id !== id));
    }
    setDeletingId(null);
  };

  const total = valoraciones.length;
  const avg =
    total > 0
      ? (
          valoraciones.reduce((sum, v) => sum + v.puntuacion, 0) / total
        ).toFixed(1)
      : "0.0";
  const distribution = [0, 0, 0, 0, 0];
  valoraciones.forEach((v) => {
    distribution[v.puntuacion - 1]++;
  });

  return (
    <div className="p-8 space-y-8 max-w-7xl mx-auto">
      <header>
        <h1 className="text-3xl font-bold text-primary tracking-tight">
          Reseñas
        </h1>
        <p className="text-on-surface-variant mt-1">
          Revisa y modera las valoraciones de los visitantes.
        </p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-surface-container-lowest rounded-2xl p-6 border border-outline-variant/20">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-3 bg-yellow-100 rounded-xl">
              <Star className="w-5 h-5 text-yellow-600" />
            </div>
          </div>
          <p className="text-3xl font-bold text-primary">{avg}</p>
          <p className="text-xs text-on-surface-variant mt-1 uppercase tracking-wider font-bold">
            Calificación Promedio
          </p>
        </div>

        <div className="bg-surface-container-lowest rounded-2xl p-6 border border-outline-variant/20">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-3 bg-blue-100 rounded-xl">
              <MessageSquare className="w-5 h-5 text-blue-600" />
            </div>
          </div>
          <p className="text-3xl font-bold text-primary">{total}</p>
          <p className="text-xs text-on-surface-variant mt-1 uppercase tracking-wider font-bold">
            Total Valoraciones
          </p>
        </div>

        <div className="bg-surface-container-lowest rounded-2xl p-6 border border-outline-variant/20">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-3 bg-green-100 rounded-xl">
              <BarChart3 className="w-5 h-5 text-green-600" />
            </div>
          </div>
          <p className="text-3xl font-bold text-primary">
            {new Set(valoraciones.map((v) => v.lugar_id)).size}
          </p>
          <p className="text-xs text-on-surface-variant mt-1 uppercase tracking-wider font-bold">
            Lugares Calificados
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1 bg-surface-container-lowest rounded-2xl p-6 border border-outline-variant/20">
          <h3 className="font-bold text-primary mb-6 flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-secondary" /> Distribución
          </h3>
          <div className="space-y-3">
            {[5, 4, 3, 2, 1].map((star) => {
              const count = distribution[star - 1];
              const pct = total > 0 ? (count / total) * 100 : 0;
              return (
                <div key={star} className="flex items-center gap-3">
                  <span className="text-sm font-bold text-on-surface-variant w-8">
                    {star}★
                  </span>
                  <div className="flex-1 bg-surface-variant rounded-full h-2.5 overflow-hidden">
                    <div
                      className="h-full bg-yellow-400 rounded-full transition-all"
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                  <span className="text-xs text-on-surface-variant w-8 text-right">
                    {count}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        <div className="lg:col-span-2 bg-surface-container-lowest rounded-2xl border border-outline-variant/20 overflow-hidden">
          <div className="px-6 py-4 border-b border-outline-variant/20">
            <h3 className="font-bold text-primary">
              Valoraciones Recientes
            </h3>
          </div>

          {loading ? (
            <div className="p-12 flex justify-center">
              <Loader2 className="w-6 h-6 animate-spin text-secondary" />
            </div>
          ) : valoraciones.length === 0 ? (
            <div className="p-12 text-center text-on-surface-variant text-sm">
              No hay valoraciones registradas aún.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="bg-surface-container-low/50">
                    <th className="px-6 py-4 text-[10px] font-bold text-outline uppercase tracking-wider">
                      Lugar
                    </th>
                    <th className="px-6 py-4 text-[10px] font-bold text-outline uppercase tracking-wider">
                      Puntuación
                    </th>
                    <th className="px-6 py-4 text-[10px] font-bold text-outline uppercase tracking-wider">
                      Fecha
                    </th>
                    <th className="px-6 py-4"></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-outline-variant/10">
                  {valoraciones.map((v) => (
                    <tr
                      key={v.id}
                      className="hover:bg-surface-container/30 transition-colors"
                    >
                      <td className="px-6 py-4 text-sm font-bold text-primary">
                        {v.lugar_nombre}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-1">
                          {[1, 2, 3, 4, 5].map((s) => (
                            <Star
                              key={s}
                              className={`w-4 h-4 ${
                                s <= v.puntuacion
                                  ? "text-yellow-400 fill-yellow-400"
                                  : "text-outline"
                              }`}
                            />
                          ))}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-xs text-on-surface-variant">
                        {new Date(v.creado_en).toLocaleDateString("es-PE", {
                          year: "numeric",
                          month: "short",
                          day: "numeric",
                        })}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <button
                          onClick={() => handleDelete(v.id)}
                          disabled={deletingId === v.id}
                          className="p-2 hover:bg-red-50 rounded-lg text-red-400 hover:text-red-600 transition-all disabled:opacity-50"
                          title="Eliminar"
                        >
                          {deletingId === v.id ? (
                            <Loader2 className="w-4 h-4 animate-spin" />
                          ) : (
                            <Trash2 className="w-4 h-4" />
                          )}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
