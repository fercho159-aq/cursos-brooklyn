-- Script para migrar abonos de usuarios a la tabla de pagos
-- Ejecutar con: psql $DATABASE_URL -f scripts/migrar-abonos.sql

BEGIN;

-- 1. Ver usuarios con abonos antes de migrar
SELECT 'Usuarios con abonos a migrar:' as info;
SELECT id, nombre, abono, total FROM usuarios WHERE abono IS NOT NULL AND abono > 0;

-- 2. Crear inscripciones para usuarios que tienen abono pero no tienen inscripción
INSERT INTO inscripciones (usuario_id, curso_id, costo_total, saldo_pendiente, estado, created_at)
SELECT
    u.id as usuario_id,
    (SELECT id FROM cursos WHERE activo = true LIMIT 1) as curso_id,
    COALESCE(u.total, 1900) as costo_total,
    COALESCE(u.total, 1900) - COALESCE(u.abono, 0) as saldo_pendiente,
    'activo' as estado,
    NOW() as created_at
FROM usuarios u
WHERE u.abono IS NOT NULL
  AND u.abono > 0
  AND NOT EXISTS (SELECT 1 FROM inscripciones i WHERE i.usuario_id = u.id);

SELECT 'Inscripciones creadas para usuarios sin inscripción' as info;

-- 3. Insertar los abonos como pagos
INSERT INTO pagos (inscripcion_id, usuario_id, monto, metodo_pago, notas, fecha_pago, created_at)
SELECT
    (SELECT id FROM inscripciones WHERE usuario_id = u.id ORDER BY created_at DESC LIMIT 1) as inscripcion_id,
    u.id as usuario_id,
    u.abono as monto,
    'efectivo' as metodo_pago,
    'Migrado desde campo abono de usuarios' as notas,
    NOW() as fecha_pago,
    NOW() as created_at
FROM usuarios u
WHERE u.abono IS NOT NULL AND u.abono > 0;

SELECT 'Pagos creados desde abonos' as info;

-- 4. Actualizar saldo_pendiente en inscripciones
UPDATE inscripciones i
SET saldo_pendiente = GREATEST(0, i.costo_total - COALESCE((
    SELECT SUM(p.monto) FROM pagos p WHERE p.inscripcion_id = i.id
), 0))
WHERE i.usuario_id IN (SELECT id FROM usuarios WHERE abono IS NOT NULL AND abono > 0);

SELECT 'Saldos pendientes actualizados' as info;

-- 5. Limpiar abonos de la tabla usuarios
UPDATE usuarios SET abono = NULL WHERE abono IS NOT NULL;

SELECT 'Abonos limpiados de tabla usuarios' as info;

-- 6. Verificar resultado
SELECT 'Pagos migrados:' as info;
SELECT p.id, u.nombre, p.monto, p.notas, p.fecha_pago
FROM pagos p
JOIN usuarios u ON p.usuario_id = u.id
WHERE p.notas LIKE '%Migrado%'
ORDER BY p.id DESC;

COMMIT;

SELECT 'Migración completada exitosamente!' as resultado;
