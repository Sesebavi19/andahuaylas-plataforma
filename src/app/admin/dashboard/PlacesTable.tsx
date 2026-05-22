"use client";

import { useEffect, useState } from "react";
import {
  MapPin,
  MoreVertical,
  Search as SearchIcon,
  Filter,
} from "lucide-react";
import { Place, PlaceStatus } from "@/types";
import { getPlaces } from "@/lib/supabase/queries";

export default function PlacesTable() {
  const [places, setPlaces] = useState<Place[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    getPlaces()
      .then(setPlaces)
      .catch((err) => {
        console.error("[Dashboard] Error fetching places:", err);
        setError("Error al cargar los lugares");
      })
      .finally(() => setLoading(false));
  }, []);

  return (
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

      {loading ? (
        <div className="p-12 text-center text-on-surface-variant text-sm">
          Cargando lugares...
        </div>
      ) : error ? (
        <div className="p-12 text-center text-red-500 text-sm">
          {error}
        </div>
      ) : places.length === 0 ? (
        <div className="p-12 text-center text-on-surface-variant text-sm">
          No hay lugares registrados a&uacute;n. Crea uno desde{" "}
          <a
            href="/admin/lugares/nuevo"
            className="text-secondary font-bold underline"
          >
            Add New Listing
          </a>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-surface-container-low/50">
              <tr>
                <th className="px-8 py-4 text-[10px] font-bold text-outline uppercase tracking-wider">
                  Establecimiento
                </th>
                <th className="px-8 py-4 text-[10px] font-bold text-outline uppercase tracking-wider">
                  Categor&iacute;a
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
      )}
    </div>
  );
}
