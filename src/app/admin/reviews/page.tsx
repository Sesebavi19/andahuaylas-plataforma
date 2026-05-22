"use client";

import { useState, useEffect } from "react";
import { Star, MessageSquare, ThumbsUp, Clock } from "lucide-react";
import { Place } from "@/types";
import { getPlaces } from "@/lib/supabase/queries";

export default function ReviewsPage() {
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

  const withReviews = places.filter((p) => (p.reviewsCount || 0) > 0);
  const totalReviews = places.reduce((sum, p) => sum + (p.reviewsCount || 0), 0);
  const avgRating =
    places.length > 0
      ? (
          places.reduce((sum, p) => sum + (p.rating || 0), 0) / places.length
        ).toFixed(1)
      : "0.0";

  return (
    <div className="p-8 space-y-8 max-w-7xl mx-auto">
      <header>
        <h1 className="text-3xl font-bold text-primary tracking-tight">
          Reseñas
        </h1>
        <p className="text-on-surface-variant mt-1">
          Revisa y modera las reseñas de los visitantes.
        </p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-surface-container-lowest rounded-2xl p-6 border border-outline-variant/20">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-3 bg-yellow-100 rounded-xl">
              <Star className="w-5 h-5 text-yellow-600" />
            </div>
          </div>
          <p className="text-3xl font-bold text-primary">{avgRating}</p>
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
          <p className="text-3xl font-bold text-primary">{totalReviews}</p>
          <p className="text-xs text-on-surface-variant mt-1 uppercase tracking-wider font-bold">
            Total Reseñas
          </p>
        </div>

        <div className="bg-surface-container-lowest rounded-2xl p-6 border border-outline-variant/20">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-3 bg-green-100 rounded-xl">
              <ThumbsUp className="w-5 h-5 text-green-600" />
            </div>
          </div>
          <p className="text-3xl font-bold text-primary">{withReviews.length}</p>
          <p className="text-xs text-on-surface-variant mt-1 uppercase tracking-wider font-bold">
            Lugares con Reseñas
          </p>
        </div>
      </div>

      <div className="bg-surface-container-lowest rounded-2xl p-8 border border-outline-variant/20 text-center">
        <div className="max-w-md mx-auto">
          <Star className="w-12 h-12 text-yellow-400 mx-auto mb-4" />
          <h3 className="text-xl font-bold text-primary mb-2">
            Módulo de Reseñas
          </h3>
          <p className="text-on-surface-variant mb-6 leading-relaxed">
            Las reseñas se integrarán próximamente. Los visitantes podrán
            calificar y comentar cada lugar, y desde aquí podrás moderar,
            responder y gestionar todas las valoraciones de la plataforma.
          </p>
          <div className="flex items-center justify-center gap-2 text-sm text-on-surface-variant">
            <Clock className="w-4 h-4" />
            <span>Funcionalidad en desarrollo</span>
          </div>
        </div>
      </div>
    </div>
  );
}
