-- Tabla de valoraciones para el sistema de calificación con estrellas
-- Ejecutar en el SQL Editor de Supabase

-- 1. Crear la tabla
CREATE TABLE IF NOT EXISTS valoraciones (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  lugar_id UUID REFERENCES lugares(id) ON DELETE CASCADE NOT NULL,
  puntuacion INTEGER NOT NULL CHECK (puntuacion >= 1 AND puntuacion <= 5),
  creado_en TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Índices
CREATE INDEX IF NOT EXISTS idx_valoraciones_lugar ON valoraciones(lugar_id);

-- 3. Row Level Security
ALTER TABLE valoraciones ENABLE ROW LEVEL SECURITY;

-- 4. Políticas
-- Lectura pública (cualquiera puede ver valoraciones)
CREATE POLICY "Lectura pública valoraciones" ON valoraciones
  FOR SELECT USING (true);

-- Inserción pública (cualquiera puede calificar)
CREATE POLICY "Inserción pública valoraciones" ON valoraciones
  FOR INSERT WITH CHECK (true);

-- Eliminación solo para admins autenticados
CREATE POLICY "Eliminación admin valoraciones" ON valoraciones
  FOR DELETE USING (auth.role() = 'authenticated');
