import { MapPin } from "lucide-react";

export default async function AdminLogin({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const { error } = await searchParams;

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-primary/5 to-surface p-8">
      <div className="w-full max-w-md">
        <div className="bg-surface-container-lowest rounded-[40px] shadow-2xl border border-outline-variant/20 p-12">
          <div className="text-center mb-10">
            <div className="w-16 h-16 bg-secondary/10 rounded-full flex items-center justify-center mx-auto mb-6">
              <MapPin className="w-8 h-8 text-secondary" />
            </div>
            <h1 className="text-2xl font-bold text-primary tracking-tight">
              Andahuaylas GO
            </h1>
            <p className="text-sm text-on-surface-variant mt-2">
              Acceso al Panel de Administraci&oacute;n
            </p>
          </div>

          <form
            action="/api/auth/login"
            method="POST"
            className="space-y-6"
          >
            <div className="space-y-2">
              <label
                htmlFor="email"
                className="text-xs font-bold text-outline uppercase tracking-wider"
              >
                Correo Electr&oacute;nico
              </label>
              <input
                id="email"
                name="email"
                type="email"
                placeholder="admin@andahuaylas.pe"
                required
                className="w-full px-6 py-4 bg-surface-container rounded-2xl border border-outline-variant/30 focus:ring-2 focus:ring-secondary/20 outline-none transition-all"
              />
            </div>

            <div className="space-y-2">
              <label
                htmlFor="password"
                className="text-xs font-bold text-outline uppercase tracking-wider"
              >
                Contrase&ntilde;a
              </label>
              <input
                id="password"
                name="password"
                type="password"
                placeholder="&bull;&bull;&bull;&bull;&bull;&bull;&bull;&bull;"
                required
                className="w-full px-6 py-4 bg-surface-container rounded-2xl border border-outline-variant/30 focus:ring-2 focus:ring-secondary/20 outline-none transition-all"
              />
            </div>

            {error && (
              <p className="text-sm text-red-500 bg-red-50 px-4 py-3 rounded-xl font-medium">
                {error}
              </p>
            )}

            <button
              type="submit"
              className="w-full bg-primary text-on-primary py-4 rounded-2xl font-bold shadow-lg hover:opacity-90 transition-all cursor-pointer"
            >
              Iniciar Sesi&oacute;n
            </button>
          </form>

          <p className="text-center text-[10px] text-outline uppercase tracking-widest mt-10">
            Plataforma de Informaci&oacute;n Tur&iacute;stica Centralizada
          </p>
        </div>
      </div>
    </div>
  );
}
