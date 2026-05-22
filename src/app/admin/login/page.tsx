"use client";

import { useState } from "react";
import { MapPin, Eye, EyeOff, Loader2 } from "lucide-react";

export default function AdminLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!email || !password) {
      setError("Ingresa correo y contraseÃ±a");
      return;
    }

    setLoading(true);

    try {
      console.log("[Login] Intentando autenticar:", email);

      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();
      console.log("[Login] Respuesta API:", data);

      if (!res.ok) {
        if (res.status === 401) {
          setError("Correo o contraseÃ±a incorrectos");
        } else {
          setError(data.error || "Error al iniciar sesiÃ³n");
        }
        return;
      }

      console.log("[Login] Redirigiendo a /admin/dashboard");
      window.location.href = "/admin/dashboard";
    } catch (err) {
      console.error("[Login] ExcepciÃ³n:", err);
      setError("Error de conexiÃ³n con el servidor de autenticaciÃ³n");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-primary/5 to-surface p-8">
      <div className="w-full max-w-md">
        <div className="bg-surface-container-lowest rounded-[40px] shadow-2xl border border-outline-variant/20 p-12">
          <div className="text-center mb-10">
            <div className="w-16 h-16 bg-secondary/10 rounded-full flex items-center justify-center mx-auto mb-6">
              <MapPin className="w-8 h-8 text-secondary" />
            </div>
            <h1 className="text-2xl font-bold text-primary tracking-tight">
              Andahuaylas Go
            </h1>
            <p className="text-sm text-on-surface-variant mt-2">
              Acceso al Panel de AdministraciÃ³n
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-6">
            <div className="space-y-2">
              <label className="text-xs font-bold text-outline uppercase tracking-wider">
                Correo ElectrÃ³nico
              </label>
              <input
                type="email"
                placeholder="admin@andahuaylas.pe"
                className="w-full px-6 py-4 bg-surface-container rounded-2xl border border-outline-variant/30 focus:ring-2 focus:ring-secondary/20 outline-none transition-all"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-outline uppercase tracking-wider">
                ContraseÃ±a
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="â€¢â€¢â€¢â€¢â€¢â€¢â€¢â€¢"
                  className="w-full px-6 py-4 bg-surface-container rounded-2xl border border-outline-variant/30 focus:ring-2 focus:ring-secondary/20 outline-none transition-all pr-12"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-outline hover:text-primary transition-all"
                >
                  {showPassword ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </button>
              </div>
            </div>

            {error && (
              <p className="text-sm text-red-500 bg-red-50 px-4 py-3 rounded-xl font-medium">
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-primary text-on-primary py-4 rounded-2xl font-bold shadow-lg hover:opacity-90 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : null}
              {loading ? "Ingresando..." : "Iniciar SesiÃ³n"}
            </button>
          </form>

          <p className="text-center text-[10px] text-outline uppercase tracking-widest mt-10">
            Plataforma de InformaciÃ³n TurÃ­stica Centralizada
          </p>
        </div>
      </div>
    </div>
  );
}
