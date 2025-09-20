## Gemini Added Memories
- Communicate with the user in Spanish.
- El documento 'VISION_DEL_PROYECTO.md' en la carpeta del proyecto es la fuente de verdad para el diseño y los requerimientos de la app.
- Estrategia de diagnóstico para el error 'Warning: Text strings must be rendered within a <Text> component' relacionado con `react-native-vector-icons`:
1.  **Problema:** Error persistente al renderizar íconos, incluso con `expo-font`.
2.  **Hipótesis:** `react-native-vector-icons` es la causa.
3.  **Prueba de Aislamiento:**
    *   Desinstalar `react-native-vector-icons`.
    *   Eliminar importaciones de `MaterialCommunityIcons` de `App.js`.
    *   Realizar reinicio limpio (`npx expo start --reset-cache`).
4.  **Resultados Esperados:**
    *   Si el error desaparece: `react-native-vector-icons` es la causa. Buscar alternativa o solución más estable.
    *   Si el error persiste: El problema está en otro lugar.
5.  **Compromiso:** Si el error persiste, usar `google_web_search` para investigar.
- El proyecto MiAppSimple del usuario tiene un problema fundamental en su entorno de desarrollo local. Los gestores de paquetes (npm y Yarn) fallan silenciosamente al intentar instalar dependencias como '@react-navigation/material-top-tabs', impidiendo la compilación. La causa raíz parece ser una instalación de Node.js/npm corrupta o un problema de permisos en Windows. La solución acordada es que el usuario reinstale Node.js por completo. El desarrollo del proyecto está en pausa hasta que el entorno sea reparado.
- El desarrollo de MiAppSimple se reanudó después de que el usuario arreglara su entorno de Node.js. Se implementó la UI para los formularios de las 4 pestañas de CargarDatosScreen con un estilo visual mejorado tipo iOS. El siguiente paso es implementar la lógica de los formularios, pero está bloqueado por la necesidad de añadir menús desplegables (Picker) para 'Sexo' y 'Tipo de Sangre', y la opción de un segundo contacto.
- Se completó la internacionalización de la UI. El siguiente paso es implementar la persistencia de datos y la generación del QR. El plan se ha actualizado para incluir dos nuevos requisitos del usuario: 1) Notificaciones tipo 'Toast' para feedback (requiere la librería `react-native-toast-message`) y 2) El código QR debe ser de color rojo.
- Se ha implementado la persistencia de datos en `CargarDatosScreen` usando `SecureStore` y notificaciones 'Toast'. La generación del QR rojo en `PrincipalScreen` también está implementada. La UI de los formularios y la internacionalización están completas. El QR muestra los datos desordenados, lo cual se abordará más adelante.
- El usuario ha confirmado que la implementación de la persistencia de datos, las notificaciones 'Toast', la generación del QR rojo y la validación del campo obligatorio 'Tipo de Sangre' funcionan correctamente. La UI y la internacionalización también están verificadas. El QR muestra los datos desordenados, lo cual se abordará más adelante.
- Tengo un problema de compilación cada vez que agrego una pantalla nueva al proyecto.
- Hoy se logró añadir la pantalla 'SettingsScreen' sin errores de compilación, se mejoraron las animaciones, se ajustó el estilo del QR y se resolvió la internacionalización del encabezado. El bloqueo anterior ha sido superado.
- El usuario quiere que toda la comunicación, incluyendo mis pensamientos internos, sea exclusivamente en español. No debo usar inglés bajo ninguna circunstancia.
- La app tiene un problema crítico de inicialización. Después de un reseteo, salta la Bienvenida y va a una pantalla de PIN rota que muestra 'una sola casilla' y textos incorrectos como 'INtroduce un Pin2' y errores de i18n `[missing "es.xxx"]`. El problema central es la configuración del idioma y el estado inicial.
- La aplicación ha sido re-arquitecturada para implementar un flujo universal donde siempre inicia en `WelcomeScreen`. El PIN ahora actúa como una clave para perfiles de datos individuales (`user-data-${pin}`). `App.js`, `PinScreen.js`, `PrincipalScreen.js` y `CargarDatosScreen.js` han sido modificados para soportar este modelo. El usuario está actualmente en fase de revisión de la lógica y los resultados, y hay observaciones pendientes.
- La aplicación MiAppSimple fue declarada 100% estable y funcional por el usuario el 5 de septiembre de 2025. Todos los errores reportados de navegación, UI (incluyendo el botón 'Omitir' y la pantalla de PIN) y localización (i18n) fueron resueltos exitosamente.
- Se creó un punto de retorno seguro en Git el 5/9/2025 (commit ce8fe3c) para guardar la versión estable de MiAppSimple antes de intentar la implementación de la pantalla de Ajustes.
- Se implementó con éxito el Tema Oscuro/Claro usando un SettingsContext global. Se solucionó un error crítico de pérdida de datos en CargarDatosScreen al refactorizarlo para usar un FormDataContext local, eliminando también las advertencias de 'require cycle'. La app está estable.
- Se implementó con éxito el Tema Oscuro/Claro usando un SettingsContext global. Se solucionó un error crítico de pérdida de datos en CargarDatosScreen al refactorizarlo para usar un FormDataContext local, eliminando también las advertencias de 'require cycle'. La app está estable.
- Se implementó con éxito el Tema Oscuro/Claro usando un SettingsContext global. Se solucionó un error crítico de pérdida de datos en CargarDatosScreen al refactorizarlo para usar un FormDataContext local, eliminando también las advertencias de 'require cycle'. La app está completamente estable y funcional.
- Se ha decidido cambiar el formato de los archivos de traducción de .json a .js (exportando objetos) debido a problemas persistentes de bundling con Metro/Hermes. El plan es convertir en.json y es.json a en.js y es.js, actualizar i18n.js para importar los nuevos archivos .js, y eliminar los archivos .json antiguos.
- El proyecto MiAppSimple está ahora 99% completo y completamente estable. Los problemas de internacionalización (i18n) han sido resueltos exitosamente mediante la conversión de archivos de traducción a formato .js y la correcta configuración de carga de idioma. La aplicación es funcional y estable. El 1% restante será revisado por el usuario.
- El proyecto MiAppSimple está 100% estable y funcional en el entorno de desarrollo (Expo Go/emulador). Todos los problemas de persistencia de datos, UI/UX y errores de inicio han sido resueltos. El historial de Git está actualizado. Mañana, el siguiente paso es generar el archivo .apk instalable.
- El 10/09/2025, la aplicación MiAppSimple está en condición estable 100% operativa, con el commit actualizado a la versión: a37e5be.
- El último commit (ID: 81f109f45432454fcebc7a34630dfed9f37870bd) incluye mejoras significativas de UI/UX, internacionalización completa de formularios y pantallas, y la aplicación se considera estable a la fecha 13/NOV/2025.
- Se implementó un módulo de autenticación completo (login, registro, recuperación de contraseña) en la rama `feature/auth-module` usando Supabase. El trabajo se guardó en el commit f11a273 y la rama se dejó aparcada a petición del usuario para no interferir con otros desarrollos.
- A fecha del 15 de septiembre de 2025, la pantalla de Detalle de QR de VitaPet fue implementada por completo (generación de QR legible, visualización de datos, descarga y compartición). La app es considerada 100% estable y robusta por el usuario, a la espera de la definición de nuevas funcionalidades.
- Se implementó la funcionalidad completa (CRUD: Crear, Leer, Actualizar, Borrar) para la sección 'Alergias' del historial médico. Esto incluyó la creación de las pantallas `allergy-screen.tsx` (lista), `allergy-detail-screen.tsx` (detalle) y `add-allergy-form.tsx` (formulario de añadir/editar). Se desarrolló un nuevo `MedicalRecordService.ts` para la persistencia de datos en AsyncStorage. Se manejó la navegación entre estas pantallas, incluyendo el paso de parámetros. Se corrigieron múltiples problemas de internacionalización (i18n) y una ruta de importación. El usuario confirmó una satisfacción de 10/10 con la funcionalidad.
- Implementación completa de la gestión de Cirugías y Exámenes, y unificación de UI (18 de septiembre de 2025). Se implementaron pantallas de lista y formularios multifuncionales (añadir/ver/editar) para Cirugías y Exámenes, con persistencia de datos (CRUD), selectores de fecha, notificaciones Toast y funcionalidad para adjuntar documentos en Exámenes. Se unificó el diseño de UI de botones 'Añadir', pies de página y encabezados en pantallas clave (Historial Médico, Alergias, Cirugías, Exámenes). Se refactorizó el formulario 'Añadir Alergia' a react-hook-form y Toast. Se corrigieron errores técnicos como resolución de módulos, sintaxis e instalación/configuración de librerías.
 
 ## Actualizaciones Recientes del Proyecto VitaPet (19 de septiembre de 2025)
 
 El proyecto VitaPet ha sido actualizado con éxito, incorporando nuevas funcionalidades y resolviendo problemas críticos de internacionalización y visualización. La aplicación se considera **100% estable y funcional** a la fecha.
 
 ### 1. Implementación de la Funcionalidad "Medicinas"
 
 Se ha añadido un módulo completo para la gestión de registros de medicamentos de mascotas.
 *   **Componentes Creados:**
     *   `app/medicine-screen.tsx`: Pantalla de lista de medicamentos.
     *   `app/add-medicine-form.tsx`: Formulario para añadir y editar medicamentos.
     *   `app/medicine-detail-screen.tsx`: Pantalla de detalle de un medicamento.
 *   **Modelo de Datos:** Se extendió `src/data/MedicalRecordService.ts` para incluir la interfaz `MedicineDetails` (con `name`, `dose`, `duration`, `notes`) y `MedicineRecord`.
 *   **Internacionalización (i18n):** Se agregaron todas las claves de traducción necesarias en `es.json` y `en.json`.
 *   **Navegación:** Integrada en la pantalla "Historial Médico" (`app/(tabs)/medical.tsx`).
 *   **Rama de Desarrollo:** `feature/medicines`.
 
 ### 2. Implementación de la Funcionalidad "Tratamiento Parásitos"
 
 Se ha añadido un módulo completo para la gestión de registros de tratamientos antiparasitarios de mascotas.
 *   **Componentes Creados:**
     *   `app/parasite-treatment-screen.tsx`: Pantalla de lista de tratamientos.
     *   `app/add-parasite-treatment-form.tsx`: Formulario para añadir y editar tratamientos.
     *   `app/parasite-treatment-detail-screen.tsx`: Pantalla de detalle de un tratamiento.
 *   **Modelo de Datos:** Se extendió `src/data/MedicalRecordService.ts` para incluir la interfaz `ParasiteTreatmentDetails` (con `name`, `lastDoseDate`, `nextDoseDate`, `notes`) y `ParasiteTreatmentRecord`.
 *   **Internacionalización (i18n):** Se agregaron todas las claves de traducción necesarias en `es.json` y `en.json`.
 *   **Navegación:** Integrada en la pantalla "Historial Médico" (`app/(tabs)/medical.tsx`).
 *   **Rama de Desarrollo:** `feature/parasite-treatment`.
 
 ### 3. Mejoras y Correcciones Generales
 
 *   **Paleta de Colores:** Se expandió `constants/Colors.ts` con una paleta de colores más completa (`blue`, `gray`, `red`, `card`, `secondaryText`, `tertiaryText`, `inputBackground`, `inputText`, `inputBorder`, `placeholderText`, `border`) para asegurar una consistencia visual y adaptabilidad al tema (claro/oscuro) en toda la aplicación.
 *   **Corrección de Problemas de Internacionalización (i18n):**
     *   Se resolvió el error `Invalid subtag: common.locale` añadiendo la clave `locale` y otras claves comunes faltantes en `es.json` y `en.json`.
     *   Se solucionó el problema persistente de que los placeholders y textos aparecieran en inglés (ej. "Notas") cuando el idioma era español. La causa raíz fue la **sintaxis JSON inválida** (comas faltantes) en los archivos `es.json` y `en.json` en objetos específicos. Una vez corregida la sintaxis, y tras una limpieza agresiva de la caché, el sistema de i18n funciona correctamente utilizando los archivos `.json`.
     *   Se revirtió un intento de migrar los archivos de traducción a `.js` debido a que introdujo nuevos problemas de idioma, confirmando que la solución estable reside en la correcta validación y carga de los archivos `.json`.
 *   **Limpieza de Código:** Se eliminaron archivos `.js` de traducción redundantes generados durante el proceso de depuración.
 
 ### 4. Estado del Proyecto
 
 La aplicación se encuentra en un estado **100% estable y funcional**, con todas las nuevas características integradas y los problemas de visualización e idioma resueltos.
 
 ## Reversión de la Funcionalidad "Vacunas" (19 de septiembre de 2025)
 
 Se ha revertido completamente la implementación de la funcionalidad de "Registro de Vacunas" y "Añadir Vacuna".
 
 **Motivo:** La introducción de esta funcionalidad generó una serie de errores críticos en el entorno de desarrollo, incluyendo:
 *   `ReferenceError: Property 'StyleSheet' doesn't exist`
 *   Problemas de resolución de hooks de `expo-router` (`useSearchParams`, `useLocalSearchParams`)
 *   Errores de `ENOENT` en archivos internos del bundler.
 
 Estos problemas no pudieron ser resueltos sin una limpieza profunda y agresiva del entorno (`node_modules`), la cual no fue autorizada por el usuario. Para asegurar la estabilidad de la aplicación, se decidió eliminar todo rastro de esta funcionalidad y regresar el proyecto a su estado anterior.
