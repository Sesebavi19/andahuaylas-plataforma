"use client";

import { useState } from "react";
import {
  Settings,
  Globe,
  Database,
  MapPin,
  Check,
  Copy,
} from "lucide-react";

export default function SettingsPage() {
  const [copied, setCopied] = useState<string | null>(null);

  const copy = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    setCopied(label);
    setTimeout(() => setCopied(null), 2000);
  };

  const settings = [
    {
      icon: <Globe className="w-5 h-5 text-blue-500" />,
      label: "URL Plataforma",
      value: "andahuaylas-plataforma.vercel.app",
    },
    {
      icon: <Database className="w-5 h-5 text-green-500" />,
      label: "Supabase Project",
      value: "jauqidmfpclkjmvybfcj.supabase.co",
    },
    {
      icon: <MapPin className="w-5 h-5 text-red-500" />,
      label: "Google Maps API",
      value: "AIzaSyDTua_LblhKWReqbhvid2P-xVEKV5ktKwc",
    },
  ];

  return (
    <div className="p-8 space-y-8 max-w-7xl mx-auto">
      <header>
        <h1 className="text-3xl font-bold text-primary tracking-tight">
          Configuración
        </h1>
        <p className="text-on-surface-variant mt-1">
          Ajustes de la plataforma y preferencias del sistema.
        </p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {settings.map((item) => (
          <div
            key={item.label}
            className="bg-surface-container-lowest rounded-2xl p-6 border border-outline-variant/20"
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="p-3 bg-surface-container-high rounded-xl">
                {item.icon}
              </div>
            </div>
            <p className="text-sm font-bold text-on-surface mb-1">
              {item.label}
            </p>
            <div className="flex items-center gap-2">
              <code className="text-xs bg-surface-variant px-2 py-1 rounded font-mono text-on-surface-variant truncate flex-1">
                {item.value}
              </code>
              <button
                onClick={() => copy(item.value, item.label)}
                className="p-1.5 hover:bg-surface-container-high rounded-lg transition-all text-on-surface-variant hover:text-primary"
                title="Copiar"
              >
                {copied === item.label ? (
                  <Check className="w-4 h-4 text-green-500" />
                ) : (
                  <Copy className="w-4 h-4" />
                )}
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-surface-container-lowest rounded-2xl p-8 border border-outline-variant/20 text-center">
        <div className="max-w-md mx-auto">
          <Settings className="w-12 h-12 text-primary mx-auto mb-4 opacity-50" />
          <h3 className="text-xl font-bold text-primary mb-2">
            Más ajustes próximamente
          </h3>
          <p className="text-on-surface-variant leading-relaxed">
            Pronto podrás configurar temas, preferencias de notificaciones,
            personalización del portal público y más opciones avanzadas.
          </p>
        </div>
      </div>
    </div>
  );
}
