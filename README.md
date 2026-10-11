# Gestor de Gastos
Aplicación web para gestionar los gastos personales, con gráficos y personalización de categorías.

## Funcionalidades de la aplicación
- Registrarte e iniciar sesión
- Crear, editar y borrar categorías
- Registrar gastos: 
    - Cantidad, concepto, fecha, categoría, gasto recurrente
- Listado con filtros de gastos por fecha, concepto y categoría
- Definir presupuesto mensual con aviso al superarlo
- Resumen mensual con gráficas
    - Cuadros con gasto mensual, presupuesto/ingresos, ahorro.
    - Dashboard con distribución y evolución de gastos

## Tech Stack

**Client:** React, TailwindCSS

**Server:** Node, Express

## Commands

### Docker
docker compose up -d        # encender la BD
docker compose down         # apagarla (los datos se guardan)
docker compose logs db      # ver qué pasa si algo falla
docker compose down -v      # apagar y BORRAR todos los datos