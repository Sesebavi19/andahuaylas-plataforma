-- Seed data: insertar lugares de ejemplo
-- Ejecutar DESPUÉS de supabase-migrate.sql

INSERT INTO lugares (id, nombre, tipo, categoria, subcategoria, descripcion, direccion, distrito, latitud, longitud, horario, telefono, sitio_web, activo, rating, reviews_count, imagen_url, galeria, rango_precio, etiquetas, creado_en)
VALUES
(
  gen_random_uuid(),
  '"'"'Complejo Arqueológico de Sóndor'"'"',
  '"'"'turismo'"'"',
  '"'"'Arqueología'"'"',
  '"'"'Arqueología'"'"',
  '"'"'Sóndor es un complejo arqueológico monumental ubicado en el distrito de Pacucha, provincia de Andahuaylas. Considerado un centro ceremonial y militar estratégico.'"'"',
  '"'"'Distrito de Pacucha, Provincia de Andahuaylas'"'"',
  '"'"'Pacucha'"'"',
  -13.6012, -73.3155,
  '"'"'{"lunes_domingo": "8:00 AM - 5:00 PM"}'"''"',
  '"'"'+51 987 654 321'"'"',
  NULL,
  true,
  4.8, 124,
  '"'"'https://picsum.photos/seed/sondor/800/600'"'"',
  '"'"'["https://picsum.photos/seed/sondor1/800/600","https://picsum.photos/seed/sondor2/800/600","https://picsum.photos/seed/sondor3/800/600"]'"'"',
  '"'"'General: S/. 5.00, Estudiantes: S/. 2.00'"'"',
  '"'"'["Aventura","Cultura","Historia"]'"'"',
  NOW()
);
