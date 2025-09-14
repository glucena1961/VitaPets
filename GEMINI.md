# Documentación del Proyecto VitaPet (Generado por Gemini)

**Fecha de Generación:** 14 de septiembre de 2025

---

## 1. Descripción de la Aplicación

VitaPet es una aplicación móvil desarrollada con React Native y Expo Router, diseñada para ayudar a los usuarios a gestionar la información de sus mascotas. Permite registrar datos básicos, información médica, y generar códigos QR con la información de la mascota para facilitar su identificación en caso de emergencia. La aplicación soporta múltiples idiomas (español e inglés) y está preparada para temas claro/oscuro.

---

## 2. Ajustes y Recuperación Realizados (Historial de Gemini)

Este documento resume el extenso proceso de recuperación y estabilización del proyecto, que se encontraba en un estado inestable debido a conflictos de dependencias y código inconsistente.

### 2.1. Limpieza y Consolidación

*   **Eliminación de Código Muerto:**
    *   `App.js`: Archivo de entrada obsoleto, reemplazado por Expo Router.
    *   `src/screens/WelcomeScreen.js`: Componente duplicado y no utilizado.
    *   `src/hooks/i18n.js`: Configuración de i18n redundante.
*   **Migración a TypeScript:**
    *   `src/constants/theme.js` -> `src/constants/theme.ts`: Tipado de la configuración de temas.
    *   `src/data/PetService.js` -> `src/data/PetService.ts`: Tipado del servicio de gestión de mascotas.
    *   `src/data/AppointmentService.js` -> `src/data/AppointmentService.ts`: Tipado del servicio de gestión de citas.

### 2.2. Estabilización de Dependencias

*   **Resolución de Conflictos:** Se resolvió un complejo "dependency hell" causado por versiones incompatibles de `react`, `react-native` y `metro`.
*   **Cambio de Gestor de Paquetes:** Se migró de `npm` a `yarn` para una resolución de dependencias más robusta.
*   **Instalación de Dependencias Faltantes:** Se identificaron e instalaron varias librerías críticas que no estaban presentes:
    *   `react-hook-form`
    *   `expo-image-picker`
    *   `expo-media-library`
    *   `react-native-uuid`
    *   `react-native-view-shot`
    *   `react-native-svg` (peer dependency)

### 2.3. Correcciones de Interfaz de Usuario (UI) y Arquitectura

*   **Manejo de Carga Inicial:** Implementada la lógica de `SplashScreen` en `app/_layout.tsx` para una carga de fuentes y recursos más fluida.
*   **Navegación de Onboarding:** Añadido un botón "Comenzar" en `app/onboarding.tsx` para permitir la navegación a la aplicación principal.
*   **Robustez de Datos:** Implementada lógica defensiva en `app/(tabs)/pets.tsx` para evitar cierres de la aplicación al mostrar mascotas con datos incompletos.
*   **Gestión de Encabezados:** Centralizada la gestión de encabezados en el Stack Navigator (`app/_layout.tsx`) y eliminados los encabezados manuales de las pantallas individuales para evitar superposiciones.
*   **Internacionalización (i18n) Consistente:** Reintegrado `I18nextProvider` en el componente raíz (`app/_layout.tsx`) para asegurar que el idioma se propague y actualice correctamente en toda la aplicación, incluyendo las pestañas de navegación.

---

## 3. Módulo de Autenticación (14 de septiembre de 2025)

Se ha implementado un módulo de autenticación completo y aislado en la rama `feature/auth-module`.

### 3.1. Funcionalidades Implementadas

*   **Flujo de Usuario:**
    *   **Registro (Sign Up):** Creación de nuevos usuarios con validación de campos y confirmación de contraseña. El sistema utiliza la verificación por email por defecto de Supabase.
    *   **Inicio de Sesión (Sign In):** Autenticación de usuarios con email y contraseña.
    *   **Recuperación de Contraseña:** Flujo para que los usuarios puedan solicitar un enlace de reseteo de contraseña a su email.
    *   **Cierre de Sesión (Sign Out):** Se añadió un botón en la pantalla de **Ajustes** (`app/(tabs)/settings.tsx`) para permitir al usuario cerrar su sesión persistente y volver al login.
*   **Arquitectura y Tecnología:**
    *   **Backend:** Integración con **Supabase** para toda la gestión de usuarios y autenticación.
    *   **Gestión de Estado:** Creación de un `AuthContext` global para manejar el estado de la sesión (`session`, `user`, `loading`) y exponer las funciones (`signIn`, `signUp`, etc.) a toda la aplicación.
    *   **Navegación Protegida:** Implementación de un "guardián de rutas" en `app/_layout.tsx` que redirige automáticamente al usuario al login si no hay sesión, o a la app principal si ya está autenticado.
    *   **Persistencia de Sesión:** Uso de `expo-secure-store` para guardar la sesión del usuario de forma segura, permitiendo la funcionalidad de "Recordarme".
    *   **Formularios:** Uso de `react-hook-form` para la gestión y validación de todos los formularios.
    *   **Internacionalización (i18n):** Soporte completo para español e inglés en todas las nuevas pantallas y mensajes. Se añadió un **selector de idioma** en la pantalla de Ajustes.

### 3.2. Proceso de Depuración y Estabilización

La implementación requirió un proceso de depuración intensivo para resolver un conflicto de dependencias a nivel nativo. Los pasos clave fueron:

1.  **Diagnóstico con `expo-doctor`**: Se identificaron múltiples versiones de paquetes incompatibles con el SDK de Expo del proyecto.
2.  **Corrección de Dependencias**: Se utilizó `npx expo install --fix` para alinear las versiones de las librerías, principalmente `react-native-reanimated`.
3.  **Creación de `babel.config.js`**: Se creó este archivo de configuración faltante para añadir el plugin de `react-native-reanimated`, solucionando el crash nativo (`installTurboModule`).
4.  **Resolución de Carga de Entorno**: Se diagnosticó y solucionó el problema de carga de las credenciales de Supabase, causado por un nombre de archivo incorrecto (`Conexion_Supabase.env` en lugar de `.env`).

### 3.3. Estado Actual del Módulo

El módulo de autenticación está **100% funcional y completo** en la rama `feature/auth-module`. Por solicitud del usuario, esta rama se ha dejado "aparcada" para ser integrada en el futuro, permitiendo así el desarrollo de otras funcionalidades en la rama principal sin la interferencia del flujo de login.

---

## 4. Próximos Pasos y Colaboración del Usuario

Para continuar con el desarrollo, necesito tu ayuda con lo siguiente:

### 4.1. Lista de Funcionalidades a Implementar

Necesitaremos definir las próximas funcionalidades. Por favor, enumera las características que te gustaría añadir o mejorar en la aplicación.

---

**¡Gracias por tu colaboración!**
