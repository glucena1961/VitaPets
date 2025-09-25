# Estado del Proyecto al 24 de Septiembre de 2025: Reseteo de Desarrollo

Este documento registra una decisión estratégica clave en el proyecto VitaPet.

## Resumen del Estado Actual: Reseteo a Base Maestra

A fecha de hoy, se ha tomado la decisión de **resetear el ciclo de desarrollo** del proyecto. Todas las ramas de funcionalidades que estaban en progreso han sido eliminadas de forma deliberada, tanto local como remotamente, debido a conflictos de fusión irresolubles.

**La única línea de desarrollo activa y válida es la rama `master`.**

## Funcionalidad Eliminada (Para ser Re-desarrollada)

El siguiente trabajo fue descartado y deberá ser reconstruido desde cero:

*   **Módulo de Autenticación Completo** (previamente en `feature/auth-module`).
*   **Lógica de la Pantalla de Ajustes** (la pantalla `app/(tabs)/settings.tsx` existe con una UI básica, pero su lógica de navegación y funcionalidad para 'Tamaño de Fuente', 'Cambio de Idioma', 'Términos y Condiciones' y 'Cerrar Sesión' está pendiente de implementación).

## Funcionalidad Base en `master` (Estado Actual)

La rama `master` se mantiene como una base 100% estable y funcional que **INCLUYE**:

*   **Gestión de Mascotas** (CRUD básico).
*   **Módulo de Historial Médico Completo:**
    *   Alergias
    *   Cirugías
    *   Exámenes (con subida de adjuntos)
    *   Tratamientos Antiparasitarios
    *   Medicamentos
    *   Vacunas

Todo nuevo desarrollo partirá de este estado estable.

- Se implementó la funcionalidad de ajuste de tamaño de fuente. Esto incluyó la creación de un `FontSizeContext`, la modificación de `ThemedText` para usarlo, la integración de botones de control en `SettingsScreen`, y la adaptación de `app/_layout.tsx`, `app/(tabs)/index.tsx`, `app/(tabs)/pets.tsx`, `app/(tabs)/medical.tsx` y `components/NavigationTitle.tsx` para usar `ThemedText`. Se corrigieron errores de sobrescritura de estilos y se fijó el tamaño de fuente del menú de navegación del pie de página.
---
# Estado del Proyecto al 25 de Septiembre de 2025: Actualización de SDK

- **Actualización a Expo SDK 54:** El proyecto ha sido actualizado exitosamente de Expo SDK 53 a 54. Esto se realizó para resolver una incompatibilidad con la versión más reciente de Expo Go y para mantener el proyecto alineado con las últimas mejoras de la plataforma.
  - El proceso se ejecutó de forma manual utilizando los comandos `yarn add expo@^54.0.0` y `npx expo install --fix`, seguido de correcciones de dependencias y una verificación con `npx expo-doctor`, debido a que el comando `npx expo upgrade` no estaba soportado en el entorno.
- **Limpieza de Código:** Se eliminaron múltiples sentencias `console.log` de depuración de los componentes `FontSizeContext.tsx` y `ThemedText.tsx`. Esto ha limpiado la salida de la consola, que se inundaba de mensajes durante el renderizado.
- **Estado Actual:** Todo el trabajo se ha consolidado en la rama `feature/sdk-54-upgrade`. El proyecto es estable, compila y se ejecuta correctamente en la nueva SDK.
