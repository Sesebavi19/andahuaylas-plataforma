-- Migración: añadir columnas faltantes y alinear tipos
-- Ejecutar en Supabase SQL Editor

-- 1. Corregir CHECK constraint de tipo para aceptar valores PlaceCategory
ALTER TABLE lugares DROP CONSTRAINT IF EXISTS lugares_tipo_check;
ALTER TABLE lugares ADD CONSTRAINT lugares_tipo_check
  CHECK (tipo IN ('turismo', 'gastronomia', 'comercio', 'hospedaje'));

-- 2. Añadir columnas que necesita el frontend
ALTER TABLE lugares ADD COLUMN IF NOT EXISTS distrito TEXT DEFAULT '';
ALTER TABLE lugares ADD COLUMN IF NOT EXISTS rating DECIMAL DEFAULT 0;
ALTER TABLE lugares ADD COLUMN IF NOT EXISTS reviews_count INTEGER DEFAULT 0;
ALTER TABLE lugares ADD COLUMN IF NOT EXISTS imagen_url TEXT DEFAULT '';
ALTER TABLE lugares ADD COLUMN IF NOT EXISTS galeria JSONB DEFAULT '[]'::jsonb;
ALTER TABLE lugares ADD COLUMN IF NOT EXISTS rango_precio TEXT DEFAULT '';
ALTER TABLE lugares ADD COLUMN IF NOT EXISTS etiquetas JSONB DEFAULT '[]'::jsonb;
ALTER TABLE lugares ADD COLUMN IF NOT EXISTS subcategoria TEXT DEFAULT '';
