"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { MapPin, Loader2, ArrowLeft } from "lucide-react";
import { Place, PlaceCategory } from "@/types";
import { getPlaceById, updatePlace } from "@/lib/supabase/queries";

const DISTRITOS = [
  "Andahuaylas",
  "San Jerónimo",
  "Talavera",
  "Andarapa",
  "Kishuara",
  "Pacucha",
  "Pampachiri",
  "Huancaray",
  "San Antonio de Cachi",
  "Santa María de Chicmo",
  "Turpo",
  "Huayana",
  "Kaquiabamba",
  "José María Arguedas",
];

export default function EditPlacePage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [notFound, setNotFound] = useState(false);

  const [name, setName] = useState("");
  const [category, setCategory] = useState<PlaceCategory>(PlaceCategory.TURISMO);
  const [subcategory, setSubcategory] = useState("");
  const [description, setDescription] = useState("");
  const [address, setAddress] = useState("");
  const [district, setDistrict] = useState("");
  const [phone, setPhone] = useState("");
  const [website, setWebsite] = useState("");
  const [hours, setHours] = useState("");
  const [priceRange, setPriceRange] = useState("");
  const [tagsText, setTagsText] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [lat, setLat] = useState(0);
  const [lng, setLng] = useState(0);

  useEffect(() => {
    getPlaceById(id).then((place) => {
      if (!place) {
        setNotFound(true);
      } else {
        setName(place.name);
        setCategory(place.category);
        setSubcategory(place.subcategory || "");
        setDescription(place.description);
        setAddress(place.address || "");
        setDistrict(place.district);
        setPhone(place.phone || "");
        setWebsite(place.website || "");
        setHours(place.hours || "");
        setPriceRange(place.priceRange || "");
        setTagsText((place.tags || []).join(", "));
        setImageUrl(place.imageUrl);
        setLat(place.coordinates.lat);
        setLng(place.coordinates.lng);
      }
      setLoading(false);
    });
  }, [id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!name || !district) {
      setError("Nombre y distrito son obligatorios");
      return;
    }

    setSaving(true);

    const ok = await updatePlace(id, {
      name,
      category,
      subcategory,
      description,
      address,
      district,
      phone,
      website,
      hours,
      priceRange,
      tags: tagsText
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean),
      imageUrl,
      lat,
      lng,
    });

    if (ok) {
      router.push("/admin/manage");
    } else {
      setError("Error al guardar los cambios");
    }

    setSaving(false);
  };

  if (loading) {
    return (
      <div className="p-8 flex justify-center">
        <Loader2 className="w-6 h-6 animate-spin text-secondary" />
      </div>
    );
  }

  if (notFound) {
    return (
      <div className="p-8 text-center text-on-surface-variant">
        <p className="text-lg font-bold mb-2">Lugar no encontrado</p>
        <button
          onClick={() => router.push("/admin/manage")}
          className="text-secondary underline text-sm"
        >
          Volver a Administrar Lugares
        </button>
      </div>
    );
  }

  return (
    <div className="p-8 space-y-8 max-w-3xl mx-auto">
      <div className="flex items-center gap-4">
        <button
          onClick={() => router.push("/admin/manage")}
          className="p-2 hover:bg-surface-container rounded-lg transition-all"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div>
          <h1 className="text-3xl font-bold text-primary tracking-tight">
            Editar Lugar
          </h1>
          <p className="text-on-surface-variant mt-1">{name}</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="bg-surface-container-lowest rounded-[32px] shadow-sm border border-outline-variant/20 p-8 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2 md:col-span-2">
            <label className="text-xs font-bold text-outline uppercase tracking-wider">
              Nombre del lugar
            </label>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-5 py-3 bg-surface-container rounded-xl border border-outline-variant/30 outline-none focus:ring-2 focus:ring-secondary/20 transition-all"
            />
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold text-outline uppercase tracking-wider">
              Categor&iacute;a
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value as PlaceCategory)}
              className="w-full px-5 py-3 bg-surface-container rounded-xl border border-outline-variant/30 outline-none focus:ring-2 focus:ring-secondary/20 transition-all"
            >
              <option value={PlaceCategory.TURISMO}>Turismo</option>
              <option value={PlaceCategory.GASTRONOMIA}>Gastronom&iacute;a</option>
              <option value={PlaceCategory.COMERCIO}>Comercio</option>
              <option value={PlaceCategory.HOSPEDAJE}>Hospedaje</option>
            </select>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold text-outline uppercase tracking-wider">
              Distrito
            </label>
            <select
              value={district}
              onChange={(e) => setDistrict(e.target.value)}
              className="w-full px-5 py-3 bg-surface-container rounded-xl border border-outline-variant/30 outline-none focus:ring-2 focus:ring-secondary/20 transition-all"
            >
              <option value="">Seleccionar...</option>
              {DISTRITOS.map((d) => (
                <option key={d} value={d}>
                  {d}
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold text-outline uppercase tracking-wider">
              Subcategor&iacute;a
            </label>
            <input
              value={subcategory}
              onChange={(e) => setSubcategory(e.target.value)}
              className="w-full px-5 py-3 bg-surface-container rounded-xl border border-outline-variant/30 outline-none focus:ring-2 focus:ring-secondary/20 transition-all"
            />
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold text-outline uppercase tracking-wider">
              URL de imagen
            </label>
            <input
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
              className="w-full px-5 py-3 bg-surface-container rounded-xl border border-outline-variant/30 outline-none focus:ring-2 focus:ring-secondary/20 transition-all"
            />
          </div>

          <div className="space-y-2 md:col-span-2">
            <label className="text-xs font-bold text-outline uppercase tracking-wider">
              Descripci&oacute;n
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              className="w-full px-5 py-3 bg-surface-container rounded-xl border border-outline-variant/30 outline-none focus:ring-2 focus:ring-secondary/20 transition-all resize-none"
            />
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold text-outline uppercase tracking-wider">
              Direcci&oacute;n
            </label>
            <input
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              className="w-full px-5 py-3 bg-surface-container rounded-xl border border-outline-variant/30 outline-none focus:ring-2 focus:ring-secondary/20 transition-all"
            />
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold text-outline uppercase tracking-wider">
              Tel&eacute;fono
            </label>
            <input
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full px-5 py-3 bg-surface-container rounded-xl border border-outline-variant/30 outline-none focus:ring-2 focus:ring-secondary/20 transition-all"
            />
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold text-outline uppercase tracking-wider">
              Sitio web
            </label>
            <input
              value={website}
              onChange={(e) => setWebsite(e.target.value)}
              className="w-full px-5 py-3 bg-surface-container rounded-xl border border-outline-variant/30 outline-none focus:ring-2 focus:ring-secondary/20 transition-all"
            />
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold text-outline uppercase tracking-wider">
              Horario
            </label>
            <input
              value={hours}
              onChange={(e) => setHours(e.target.value)}
              placeholder="Lun-Vie 9:00-18:00"
              className="w-full px-5 py-3 bg-surface-container rounded-xl border border-outline-variant/30 outline-none focus:ring-2 focus:ring-secondary/20 transition-all"
            />
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold text-outline uppercase tracking-wider">
              Rango de precio
            </label>
            <input
              value={priceRange}
              onChange={(e) => setPriceRange(e.target.value)}
              placeholder="S/ 10 - S/ 50"
              className="w-full px-5 py-3 bg-surface-container rounded-xl border border-outline-variant/30 outline-none focus:ring-2 focus:ring-secondary/20 transition-all"
            />
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold text-outline uppercase tracking-wider">
              Latitud
            </label>
            <input
              type="number"
              step="any"
              value={lat}
              onChange={(e) => setLat(Number(e.target.value))}
              className="w-full px-5 py-3 bg-surface-container rounded-xl border border-outline-variant/30 outline-none focus:ring-2 focus:ring-secondary/20 transition-all"
            />
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold text-outline uppercase tracking-wider">
              Longitud
            </label>
            <input
              type="number"
              step="any"
              value={lng}
              onChange={(e) => setLng(Number(e.target.value))}
              className="w-full px-5 py-3 bg-surface-container rounded-xl border border-outline-variant/30 outline-none focus:ring-2 focus:ring-secondary/20 transition-all"
            />
          </div>

          <div className="space-y-2 md:col-span-2">
            <label className="text-xs font-bold text-outline uppercase tracking-wider">
              Etiquetas (separadas por coma)
            </label>
            <input
              value={tagsText}
              onChange={(e) => setTagsText(e.target.value)}
              placeholder="tradicional, familiar, artesanal"
              className="w-full px-5 py-3 bg-surface-container rounded-xl border border-outline-variant/30 outline-none focus:ring-2 focus:ring-secondary/20 transition-all"
            />
          </div>
        </div>

        {error && (
          <p className="text-sm text-red-500 bg-red-50 px-4 py-3 rounded-xl font-medium">
            {error}
          </p>
        )}

        <div className="flex justify-end gap-4 pt-4">
          <button
            type="button"
            onClick={() => router.push("/admin/manage")}
            className="px-6 py-3 rounded-xl text-sm font-bold text-on-surface-variant hover:bg-surface-container transition-all"
          >
            Cancelar
          </button>
          <button
            type="submit"
            disabled={saving}
            className="flex items-center gap-2 bg-primary text-on-primary px-6 py-3 rounded-xl text-sm font-bold hover:opacity-90 transition-all shadow-sm disabled:opacity-50"
          >
            {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
            {saving ? "Guardando..." : "Guardar Cambios"}
          </button>
        </div>
      </form>
    </div>
  );
}
