"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  MapPin,
  Plus,
  Edit,
  Trash2,
  Search as SearchIcon,
  Loader2,
} from "lucide-react";
import { Place, PlaceStatus } from "@/types";
import { getPlaces, deletePlace } from "@/lib/supabase/queries";

export default function ManagePage() {
  const router = useRouter();
  const [places, setPlaces] = useState<Place[]>([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const loadPlaces = () => {
    setLoading(true);
    getPlaces()
      .then(setPlaces)
      .catch(() => setPlaces([]))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadPlaces();
  }, []);

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`¿Eliminar "${name}"? Esta acción no se puede deshacer.`)) return;
    setDeletingId(id);
    const ok = await deletePlace(id);
    if (ok) {
      setPlaces((prev) => prev.filter((p) => p.id !== id));
    } else {
      alert("Error al eliminar el lugar");
    }
    setDeletingId(null);
  };

  return (
    <div className="p-8 space-y-8 max-w-7xl mx-auto">
      <header className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-bold text-primary tracking-tight">
            Administrar Lugares
          </h1>
          <p className="text-on-surface-variant mt-1">
            Gestiona todos los lugares tur&iacute;sticos, gastron&oacute;micos y comerciales.
          </p>
        </div>
        <button
          onClick={() => router.push("/admin/lugares/nuevo")}
          className="flex items-center gap-2 bg-primary text-on-primary px-5 py-3 rounded-xl text-sm font-bold hover:opacity-90 transition-all shadow-sm"
        >
          <Plus className="w-4 h-4" />
          A&ntilde;adir Lugar
        </button>
      </header>

      <div className="bg-surface-container-lowest rounded-[32px] shadow-sm border border-outline-variant/20 overflow-hidden">
        <div className="p-8 border-b border-outline-variant/20 flex justify-between items-center">
          <h3 className="font-bold text-primary">
            {places.length} lugar{places.length !== 1 ? "es" : ""}
          </h3>
          <div className="relative">
            <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-outline w-3.5 h-3.5" />
            <input
              type="text"
              placeholder="Buscar..."
              className="pl-9 pr-4 py-1.5 bg-surface-container text-xs rounded-lg border border-outline-variant/30 outline-none w-48"
            />
          </div>
        </div>

        {loading ? (
          <div className="p-12 flex justify-center">
            <Loader2 className="w-6 h-6 animate-spin text-secondary" />
          </div>
        ) : places.length === 0 ? (
          <div className="p-12 text-center text-on-surface-variant text-sm">
            No hay lugares registrados a&uacute;n.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-surface-container-low/50">
                <tr>
                  <th className="px-8 py-4 text-[10px] font-bold text-outline uppercase tracking-wider">Nombre</th>
                  <th className="px-8 py-4 text-[10px] font-bold text-outline uppercase tracking-wider">Categor&iacute;a</th>
                  <th className="px-8 py-4 text-[10px] font-bold text-outline uppercase tracking-wider">Distrito</th>
                  <th className="px-8 py-4 text-[10px] font-bold text-outline uppercase tracking-wider">Estado</th>
                  <th className="px-8 py-4 text-[10px] font-bold text-outline uppercase tracking-wider">Rating</th>
                  <th className="px-8 py-4"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-outline-variant/10">
                {places.map((place) => (
                  <tr key={place.id} className="hover:bg-surface-container/30 transition-colors">
                    <td className="px-8 py-5">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-lg overflow-hidden bg-surface-variant shrink-0">
                          {place.imageUrl ? (
                            <img src={place.imageUrl} alt="" className="w-full h-full object-cover" />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-outline text-xs">
                              <MapPin className="w-4 h-4" />
                            </div>
                          )}
                        </div>
                        <span className="text-sm font-bold text-primary">{place.name}</span>
                      </div>
                    </td>
                    <td className="px-8 py-5">
                      <span className="text-[10px] font-bold text-on-surface-variant bg-surface-container-high px-2 py-1 rounded uppercase">
                        {place.category}
                      </span>
                    </td>
                    <td className="px-8 py-5 text-sm text-on-surface-variant">{place.district}</td>
                    <td className="px-8 py-5">
                      <div className="flex items-center gap-2">
                        <div
                          className={`w-2 h-2 rounded-full ${
                            place.status === PlaceStatus.ACTIVE ? "bg-green-500" : "bg-amber-500 animate-pulse"
                          }`}
                        />
                        <span className="text-xs font-bold text-on-surface capitalize">
                          {place.status === PlaceStatus.ACTIVE ? "Activo" : "Pendiente"}
                        </span>
                      </div>
                    </td>
                    <td className="px-8 py-5 text-sm font-bold text-primary">{place.rating}</td>
                    <td className="px-8 py-5">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => router.push(`/admin/manage/edit/${place.id}`)}
                          className="p-2 hover:bg-secondary-container rounded-lg text-secondary transition-all"
                          title="Editar"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(place.id, place.name)}
                          disabled={deletingId === place.id}
                          className="p-2 hover:bg-red-50 rounded-lg text-red-400 hover:text-red-600 transition-all disabled:opacity-50"
                          title="Eliminar"
                        >
                          {deletingId === place.id ? (
                            <Loader2 className="w-4 h-4 animate-spin" />
                          ) : (
                            <Trash2 className="w-4 h-4" />
                          )}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
