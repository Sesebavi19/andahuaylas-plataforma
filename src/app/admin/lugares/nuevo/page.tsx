"use client";

import { useState } from "react";
import {
  Building2,
  MapPin,
  Camera,
  Save,
  X,
  Phone,
  Globe,
  Clock,
  Tag,
  Plus,
  ArrowLeft,
  Image as ImageIcon,
  Loader2,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "motion/react";
import { PlaceCategory } from "@/types";
import { insertPlace } from "@/lib/supabase/queries";

export default function AddLocation() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: "",
    category: PlaceCategory.TURISMO,
    district: "Andahuaylas",
    description: "",
    address: "",
    phone: "",
    website: "",
    hours: "",
  });

  const [tags, setTags] = useState(["Aventura", "Cultura"]);
  const [newTag, setNewTag] = useState("");
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState("");

  const addTag = () => {
    if (newTag && !tags.includes(newTag)) {
      setTags([...tags, newTag]);
      setNewTag("");
    }
  };

  const removeTag = (tagToRemove: string) => {
    setTags(tags.filter((t) => t !== tagToRemove));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name) return;
    setSaving(true);
    setSaveError("");
    try {
      const id = await insertPlace({
        name: formData.name,
        category: formData.category,
        description: formData.description,
        address: formData.address,
        district: formData.district,
        phone: formData.phone,
        website: formData.website,
        hours: formData.hours,
        priceRange: "",
        tags,
        imageUrl: "https://picsum.photos/seed/" + formData.name.replace(/\s+/g, "_") + "/800/600",
        lat: -13.63,
        lng: -73.36,
      });
      if (id) {
        router.push("/admin/dashboard");
      } else {
        setSaveError("Error al guardar. Intenta de nuevo.");
      }
    } catch {
      setSaveError("Error de conexión.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="p-8 max-w-5xl mx-auto space-y-8">
      <header className="flex items-center gap-6">
        <Link
          href="/admin/dashboard"
          className="p-3 bg-surface-container-high rounded-2xl text-on-surface-variant hover:bg-surface-container-highest hover:text-primary transition-all"
        >
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div>
          <h1 className="text-3xl font-bold text-primary tracking-tight">
            Agregar Nuevo Lugar
          </h1>
          <p className="text-on-surface-variant mt-1">
            Completa los detalles para listar un nuevo punto de interés o negocio.
          </p>
        </div>
      </header>

      {saveError && (
        <div className="bg-red-50 text-red-600 px-6 py-3 rounded-2xl font-medium text-sm">
          {saveError}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        <div className="lg:col-span-2 space-y-8">
          <section className="bg-surface-container-lowest p-10 rounded-[40px] shadow-sm border border-outline-variant/10 space-y-8">
            <h3 className="font-bold text-lg text-primary flex items-center gap-3">
              <Building2 className="w-5 h-5 text-secondary" /> Información General
            </h3>

            <div className="grid grid-cols-1 gap-6">
              <div className="space-y-2">
                <label className="text-xs font-bold text-outline uppercase tracking-wider">
                  Nombre del Establecimiento
                </label>
                <input
                  type="text"
                  placeholder="Ej. Restaurante Sol de los Chankas"
                  className="w-full px-6 py-4 bg-surface-container rounded-2xl border border-outline-variant/30 focus:ring-2 focus:ring-secondary/20 outline-none transition-all"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                />
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-outline uppercase tracking-wider">
                    Categoría
                  </label>
                  <select
                    className="w-full px-6 py-4 bg-surface-container rounded-2xl border border-outline-variant/30 focus:ring-2 focus:ring-secondary/20 outline-none transition-all appearance-none"
                    value={formData.category}
                    onChange={(e) =>
                      setFormData({ ...formData, category: e.target.value as PlaceCategory })
                    }
                  >
                    <option value={PlaceCategory.TURISMO}>Turismo</option>
                    <option value={PlaceCategory.GASTRONOMIA}>Gastronomía</option>
                    <option value={PlaceCategory.COMERCIO}>Comercio</option>
                    <option value={PlaceCategory.HOSPEDAJE}>Hospedaje</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-outline uppercase tracking-wider">
                    Distrito
                  </label>
                  <select
                    className="w-full px-6 py-4 bg-surface-container rounded-2xl border border-outline-variant/30 focus:ring-2 focus:ring-secondary/20 outline-none transition-all appearance-none"
                    value={formData.district}
                    onChange={(e) => setFormData({ ...formData, district: e.target.value })}
                  >
                    <option value="Andahuaylas">Andahuaylas</option>
                    <option value="Talavera">Talavera</option>
                    <option value="San Jerónimo">San Jerónimo</option>
                    <option value="Pacucha">Pacucha</option>
                  </select>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold text-outline uppercase tracking-wider">
                  Descripción Detallada
                </label>
                <textarea
                  rows={5}
                  placeholder="Cuéntanos más sobre este lugar, su historia o qué ofrece..."
                  className="w-full px-6 py-4 bg-surface-container rounded-2xl border border-outline-variant/30 focus:ring-2 focus:ring-secondary/20 outline-none transition-all resize-none"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                />
              </div>
            </div>
          </section>

          <section className="bg-surface-container-lowest p-10 rounded-[40px] shadow-sm border border-outline-variant/10 space-y-8">
            <h3 className="font-bold text-lg text-primary flex items-center gap-3">
              <MapPin className="w-5 h-5 text-secondary" /> Ubicación y Contacto
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-xs font-bold text-outline uppercase tracking-wider">
                  Dirección Exacta
                </label>
                <input
                  type="text"
                  placeholder="Jr. Juan Francisco Ramos 123"
                  className="w-full px-6 py-4 bg-surface-container rounded-2xl border border-outline-variant/30 focus:ring-2 focus:ring-secondary/20 outline-none transition-all"
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold text-outline uppercase tracking-wider">
                  Número de Teléfono
                </label>
                <input
                  type="text"
                  placeholder="+51 987 654 321"
                  className="w-full px-6 py-4 bg-surface-container rounded-2xl border border-outline-variant/30 focus:ring-2 focus:ring-secondary/20 outline-none transition-all"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold text-outline uppercase tracking-wider">
                  Sitio Web / Redes
                </label>
                <input
                  type="text"
                  placeholder="www.tusitio.com"
                  className="w-full px-6 py-4 bg-surface-container rounded-2xl border border-outline-variant/30 focus:ring-2 focus:ring-secondary/20 outline-none transition-all"
                  value={formData.website}
                  onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold text-outline uppercase tracking-wider">
                  Horarios
                </label>
                <input
                  type="text"
                  placeholder="Lun-Vie 8am - 6pm"
                  className="w-full px-6 py-4 bg-surface-container rounded-2xl border border-outline-variant/30 focus:ring-2 focus:ring-secondary/20 outline-none transition-all"
                  value={formData.hours}
                  onChange={(e) => setFormData({ ...formData, hours: e.target.value })}
                />
              </div>
            </div>
          </section>

          <div className="flex justify-end gap-4 p-4">
            <button
              type="button"
              onClick={() => router.push("/admin/dashboard")}
              className="px-8 py-4 rounded-2xl text-on-surface-variant font-bold hover:bg-surface-container transition-all"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={saving}
              className="bg-primary text-on-primary px-12 py-4 rounded-2xl font-bold shadow-xl hover:opacity-90 transition-all flex items-center gap-2 disabled:opacity-50"
            >
              {saving ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
              {saving ? "Guardando..." : "Guardar Publicación"}
            </button>
          </div>
        </div>

        <div className="space-y-8">
          <section className="bg-surface-container-lowest p-8 rounded-[32px] shadow-sm border border-outline-variant/10 space-y-6 text-center">
            <h3 className="font-bold text-primary text-left">Imágenes de Portada</h3>
            <div className="aspect-video bg-surface-container rounded-3xl border-2 border-dashed border-outline-variant/40 flex flex-col items-center justify-center gap-4 group cursor-pointer hover:border-secondary transition-all">
              <div className="p-4 bg-surface-container-highest rounded-2xl text-on-surface-variant group-hover:bg-secondary-container group-hover:text-on-secondary-container transition-all">
                <Camera className="w-8 h-8" />
              </div>
              <div>
                <p className="text-sm font-bold text-primary">Subir Fotografía</p>
                <p className="text-[10px] text-on-surface-variant">PNG o JPG hasta 5MB</p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="aspect-square bg-surface-container rounded-2xl border border-outline-variant/10 flex items-center justify-center">
                <ImageIcon className="w-6 h-6 text-outline" />
              </div>
              <div className="aspect-square bg-surface-container rounded-2xl border border-outline-variant/10 flex items-center justify-center">
                <ImageIcon className="w-6 h-6 text-outline" />
              </div>
            </div>
          </section>

          <section className="bg-surface-container-lowest p-8 rounded-[32px] shadow-sm border border-outline-variant/10 space-y-6">
            <h3 className="font-bold text-primary">Etiquetas de Búsqueda</h3>
            <div className="flex flex-wrap gap-2">
              {tags.map((tag) => (
                <span
                  key={tag}
                  className="bg-secondary-container text-on-secondary-container px-3 py-1.5 rounded-full text-xs font-bold flex items-center gap-2 group"
                >
                  {tag}
                  <button onClick={() => removeTag(tag)} className="p-0.5 hover:bg-black/10 rounded-full">
                    <X className="w-3 h-3" />
                  </button>
                </span>
              ))}
            </div>
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Nueva etiqueta..."
                className="flex-1 px-4 py-2 bg-surface-container border border-outline-variant/20 rounded-xl text-xs outline-none focus:ring-1 focus:ring-secondary"
                value={newTag}
                onChange={(e) => setNewTag(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && addTag()}
              />
              <button onClick={addTag} className="p-2 bg-primary text-on-primary rounded-xl hover:opacity-90 transition-all">
                <Plus className="w-4 h-4" />
              </button>
            </div>
          </section>

          <div className="bg-tertiary-container/10 p-8 rounded-[32px] border border-tertiary-container/20">
            <h4 className="text-sm font-bold text-tertiary mb-2 flex items-center gap-2">
              <Tag className="w-4 h-4" /> Recomendación
            </h4>
            <p className="text-xs text-on-tertiary-container leading-relaxed">
              Utiliza imágenes de alta resolución y descripciones detalladas para aumentar la visibilidad en el mapa interactivo.
            </p>
          </div>
        </div>
      </div>
    </form>
  );
}
