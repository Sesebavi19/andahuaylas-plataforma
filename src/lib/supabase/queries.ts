import { Place, PlaceCategory, PlaceStatus } from "@/types";
import { createClient } from "./client";

type DbLugar = {
  id: string;
  nombre: string;
  tipo: string;
  categoria: string;
  subcategoria: string | null;
  descripcion: string | null;
  direccion: string | null;
  distrito: string | null;
  latitud: number | null;
  longitud: number | null;
  horario: string | null;
  telefono: string | null;
  sitio_web: string | null;
  activo: boolean;
  rating: number | null;
  reviews_count: number | null;
  imagen_url: string | null;
  galeria: string[] | null;
  rango_precio: string | null;
  etiquetas: string[] | null;
  creado_en: string;
};

const TIPO_TO_CATEGORY: Record<string, PlaceCategory> = {
  turismo: PlaceCategory.TURISMO,
  gastronomia: PlaceCategory.GASTRONOMIA,
  comercio: PlaceCategory.COMERCIO,
  hospedaje: PlaceCategory.HOSPEDAJE,
};

const CATEGORY_TO_TIPO: Record<PlaceCategory, string> = {
  [PlaceCategory.TURISMO]: "turismo",
  [PlaceCategory.GASTRONOMIA]: "gastronomia",
  [PlaceCategory.COMERCIO]: "comercio",
  [PlaceCategory.HOSPEDAJE]: "hospedaje",
};

function rowToPlace(row: DbLugar): Place {
  return {
    id: row.id,
    name: row.nombre,
    description: row.descripcion || "",
    category: TIPO_TO_CATEGORY[row.tipo] || (row.tipo as PlaceCategory),
    subcategory: row.subcategoria || row.categoria || undefined,
    district: row.distrito || "",
    address: row.direccion || undefined,
    phone: row.telefono || undefined,
    website: row.sitio_web || undefined,
    coordinates: {
      lat: Number(row.latitud) || 0,
      lng: Number(row.longitud) || 0,
    },
    rating: Number(row.rating) || 0,
    reviewsCount: Number(row.reviews_count) || 0,
    imageUrl: row.imagen_url || "",
    gallery: row.galeria || undefined,
    hours: row.horario || undefined,
    priceRange: row.rango_precio || undefined,
    tags: row.etiquetas || undefined,
    status: row.activo ? PlaceStatus.ACTIVE : PlaceStatus.INACTIVE,
    createdAt: row.creado_en,
  };
}

export async function getPlaces(): Promise<Place[]> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("lugares")
    .select("*")
    .order("creado_en", { ascending: false });

  if (error) {
    console.error("[Queries] Error fetching places:", error);
    return [];
  }

  return (data || []).map(rowToPlace);
}

export async function getPlaceById(id: string): Promise<Place | null> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("lugares")
    .select("*")
    .eq("id", id)
    .single();

  if (error || !data) {
    console.error("[Queries] Error fetching place:", error);
    return null;
  }

  return rowToPlace(data);
}

export async function getPlacesByCategory(category: PlaceCategory): Promise<Place[]> {
  const tipo = CATEGORY_TO_TIPO[category];
  const supabase = createClient();
  const { data, error } = await supabase
    .from("lugares")
    .select("*")
    .eq("tipo", tipo)
    .order("creado_en", { ascending: false });

  if (error) {
    console.error("[Queries] Error fetching by category:", error);
    return [];
  }

  return (data || []).map(rowToPlace);
}

export async function searchPlaces(query: string): Promise<Place[]> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("lugares")
    .select("*")
    .or(
      `nombre.ilike.%${query}%,descripcion.ilike.%${query}%,categoria.ilike.%${query}%`
    )
    .order("creado_en", { ascending: false });

  if (error) {
    console.error("[Queries] Error searching places:", error);
    return [];
  }

  return (data || []).map(rowToPlace);
}

export async function insertPlace(place: {
  name: string;
  category: PlaceCategory;
  subcategory?: string;
  description: string;
  address: string;
  district: string;
  phone: string;
  website: string;
  hours: string;
  priceRange: string;
  tags: string[];
  imageUrl: string;
  lat: number;
  lng: number;
}): Promise<string | null> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("lugares")
    .insert({
      nombre: place.name,
      tipo: CATEGORY_TO_TIPO[place.category],
      categoria: place.subcategory || place.category,
      subcategoria: place.subcategory || null,
      descripcion: place.description,
      direccion: place.address,
      distrito: place.district,
      latitud: place.lat,
      longitud: place.lng,
      telefono: place.phone || null,
      sitio_web: place.website || null,
      rango_precio: place.priceRange || null,
      etiquetas: place.tags,
      imagen_url: place.imageUrl,
      activo: false,
      rating: 0,
      reviews_count: 0,
      galeria: [],
    })
    .select("id")
    .single();

  if (error) {
    console.error("[Queries] Error inserting place:", error);
    return null;
  }

  return data.id;
}
