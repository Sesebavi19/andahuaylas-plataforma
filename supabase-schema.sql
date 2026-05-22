-- ============================================================
-- Schema SQL — Andahuaylas Go
-- Plataforma Turística, Gastronómica y Comercial de Andahuaylas
-- Ejecutar en Supabase SQL Editor
-- ============================================================

-- 1. Extensión UUID
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. Tabla principal: lugares
CREATE TABLE lugares (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  nombre TEXT NOT NULL,
  tipo TEXT NOT NULL CHECK (tipo IN ('turistico', 'restaurante', 'comercio', 'hospedaje')),
  categoria TEXT NOT NULL,
  descripcion TEXT,
  direccion TEXT,
  latitud DECIMAL,
  longitud DECIMAL,
  horario JSONB,
  telefono TEXT,
  whatsapp TEXT,
  sitio_web TEXT,
  activo BOOLEAN DEFAULT true,
  creado_en TIMESTAMPTZ DEFAULT NOW(),
  actualizado_en TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Tabla: fotos
CREATE TABLE fotos (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  lugar_id UUID REFERENCES lugares(id) ON DELETE CASCADE,
  url TEXT NOT NULL,
  es_portada BOOLEAN DEFAULT false,
  orden INTEGER DEFAULT 0,
  creado_en TIMESTAMPTZ DEFAULT NOW()
);

-- 4. Tabla: platos (solo para restaurantes)
CREATE TABLE platos (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  lugar_id UUID REFERENCES lugares(id) ON DELETE CASCADE,
  nombre TEXT NOT NULL,
  descripcion TEXT,
  precio_ref DECIMAL,
  es_tipico BOOLEAN DEFAULT false,
  foto_url TEXT,
  creado_en TIMESTAMPTZ DEFAULT NOW()
);

-- 5. Tabla: administradores
CREATE TABLE admin_users (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  rol TEXT NOT NULL DEFAULT 'admin' CHECK (rol IN ('super_admin', 'admin')),
  creado_en TIMESTAMPTZ DEFAULT NOW(),
  creado_por UUID REFERENCES auth.users(id)
);

-- 6. Índices
CREATE INDEX idx_lugares_tipo ON lugares(tipo);
CREATE INDEX idx_lugares_activo ON lugares(activo);
CREATE INDEX idx_fotos_lugar ON fotos(lugar_id);
CREATE INDEX idx_platos_lugar ON platos(lugar_id);

-- 7. Row Level Security
ALTER TABLE lugares ENABLE ROW LEVEL SECURITY;
ALTER TABLE fotos ENABLE ROW LEVEL SECURITY;
ALTER TABLE platos ENABLE ROW LEVEL SECURITY;
ALTER TABLE admin_users ENABLE ROW LEVEL SECURITY;

-- Políticas de lectura pública
CREATE POLICY "Lectura pública lugares activos" ON lugares
  FOR SELECT USING (activo = true);

CREATE POLICY "Lectura pública fotos" ON fotos
  FOR SELECT USING (true);

CREATE POLICY "Lectura pública platos" ON platos
  FOR SELECT USING (true);

-- Políticas de escritura solo autenticado (admin)
CREATE POLICY "Escritura admin lugares" ON lugares
  FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "Escritura admin fotos" ON fotos
  FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "Escritura admin platos" ON platos
  FOR ALL USING (auth.role() = 'authenticated');

-- admin_users: super_admin puede ver todo, admin solo su propio registro
CREATE POLICY "Lectura admin_users" ON admin_users
  FOR SELECT USING (
    auth.uid() = id OR
    EXISTS (SELECT 1 FROM admin_users WHERE id = auth.uid() AND rol = 'super_admin')
  );

CREATE POLICY "Escritura admin_users solo super_admin" ON admin_users
  FOR ALL USING (
    EXISTS (SELECT 1 FROM admin_users WHERE id = auth.uid() AND rol = 'super_admin')
  );

-- 8. Función auto-create admin_users on signup (opcional)
-- Descomentar si se desea que al registrarse un usuario se agregue automáticamente
-- CREATE OR REPLACE FUNCTION handle_new_user()
-- RETURNS TRIGGER AS $$
-- BEGIN
--   INSERT INTO public.admin_users (id, email, rol)
--   VALUES (NEW.id, NEW.email, 'admin');
--   RETURN NEW;
-- END;
-- $$ LANGUAGE plpgsql SECURITY DEFINER;

-- CREATE TRIGGER on_auth_user_created
--   AFTER INSERT ON auth.users
--   FOR EACH ROW EXECUTE FUNCTION handle_new_user();
