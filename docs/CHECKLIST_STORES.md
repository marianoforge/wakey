# Checklist: App lista para Play Store y App Store

Lista de ítems (además de interfaz y seguridad) para tener una app robusta y publicable. Orden aproximado por prioridad.

---

## 1. Identidad y metadata de la app

- [ ] **Nombre público** definido y coherente en ambas tiendas (ej. "Sleepy Hollow – Alerta somnolencia").
- [ ] **Versión y build**: `version` en `app.json` (ej. `1.0.0`) y `versionCode` (Android) / `CFBundleShortVersionString` + `CFBundleVersion` (iOS); incrementar en cada release.
- [ ] **Descripción corta y larga** para cada store (Play Store: short + full; App Store: subtitle + description).
- [ ] **Keywords** (App Store) y **short description** (Play Store) orientados a búsqueda (somnolencia, conducción, seguridad, alerta, etc.).
- [ ] **Categoría** correcta en cada store (ej. Salud y bienestar, Utilidades o Seguridad).
- [ ] **Edad / clasificación de contenido**: declarar uso de cámara y, si aplica, que no hay contenido para menores; configurar en Google Play (formulario de contenido) y App Store (edad).
- [ ] **Idiomas**: al menos español; si hay más, listar en las fichas de cada store.

---

## 2. Assets para las tiendas

- [ ] **Icono** 1024×1024 (App Store) y variantes para Android (adaptive icon ya lo tenés; revisar que se vea bien en todos los tamaños).
- [ ] **Splash screen** coherente con la marca y sin texto que se corte en distintos dispositivos.
- [ ] **Capturas de pantalla** (obligatorias):
  - iOS: varios tamaños de iPhone (6.7", 6.5", 5.5") y opcional iPad.
  - Android: phone y, si soportás tablet, 7" y 10".
- [ ] **Video promocional** (opcional pero recomendado): 15–30 s mostrando Drive Mode, alertas y valor de la app.
- [ ] **Feature graphic** (Android): 1024×500 para la ficha en Play Store.
- [ ] **App Store preview / video** (opcional): para la página de la app en iOS.

---

## 3. Permisos y privacidad

- [ ] **Permisos mínimos**: en `app.json` / AndroidManifest solo los que usás (cámara; vibración si se declara). Revisar que no queden permisos de plantilla que no usás.
- [ ] **Textos de permisos**: `NSCameraUsageDescription` (iOS) ya está; en Android asegurar que el uso de cámara quede claro en la ficha o en la app.
- [ ] **Política de privacidad** (URL pública):
  - Explicar que el video/cámara se procesa **solo en el dispositivo** (ML Kit on-device).
  - Si enviás datos al backend (sesiones, eventos), qué se envía, dónde se guarda, con quién se comparte.
  - Cumplir con GDPR/CCPA si tenés usuarios en UE/California.
- [ ] **Términos y condiciones** (o términos de uso) en URL accesible desde la app y desde la ficha de la store.
- [ ] **App Privacy** (App Store): completar el cuestionario (datos que recopilás, uso de cámara, identificadores, etc.).
- [ ] **Data safety** (Play Store): declarar recopilación de datos, uso de cámara, si hay datos sensibles; enlace a política de privacidad.

---

## 4. Configuración técnica del build

- [ ] **Orientación**: en `app.json`, si la app usa solo landscape en Drive Mode, considerar `orientation: "default"` o declarar en las stores que parte de la app es landscape; probar en distintos dispositivos.
- [ ] **iOS**: `bundleIdentifier` único y definitivo; revisar capabilities (cámara, background modes si en el futuro usás algo en segundo plano).
- [ ] **Android**: `package` único; `versionCode` entero que sube en cada subida a Play Store.
- [ ] **EAS Build** (recomendado): configurar `eas.json` con profiles `preview` y `production`; builds firmados para iOS (certificados/provisioning) y Android (keystore).
- [ ] **Firma**: keystore de release en Android guardado de forma segura; certificados y provisioning profiles de iOS en Apple Developer.
- [ ] **ProGuard/R8** (Android): reglas para no ofuscar clases de ML Kit / Vision Camera si lo requieren; probar build release.
- [ ] **Hermes** (ya suele estar en Expo): verificar que el build de producción use Hermes en ambos.

---

## 5. Estabilidad y calidad

- [ ] **Manejo de errores**: pantallas o mensajes claros cuando no hay cámara, permiso denegado, ML Kit falla; sin crashes en flujos normales.
- [ ] **Permiso de cámara denegado**: flujo claro (mensaje + enlace a Ajustes) y no bloquear el resto de la app si es posible.
- [ ] **Sin dispositivo frontal**: mensaje o deshabilitar Drive Mode en dispositivos sin cámara frontal.
- [ ] **Tests**: al menos smoke tests (abrir app, entrar a Drive Mode, aceptar permisos); idealmente tests E2E con Detox o Maestro para el flujo crítico.
- [ ] **Performance**: revisar que el loop de fotos + ML Kit no consuma batería excesiva; considerar reducir FPS o resolución en modo “ahorro”.
- [ ] **Memoria**: no fugas al entrar/salir de Drive Mode; liberar recursos de cámara y sonido al desmontar.

---

## 6. Legal y compliance

- [ ] **Disclaimer / aviso importante**: en la app (y si las políticas lo piden, en la ficha) dejar claro que la app **asiste** y no sustituye la responsabilidad del conductor (no es un sistema de seguridad certificado).
- [ ] **Términos de uso** que cubran uso en vehículo, limitación de responsabilidad, edad mínima si aplica.
- [ ] **Licencias de terceros**: pantalla “Acerca de” o “Licencias” con listado de librerías (React Native, Expo, ML Kit, Vision Camera, etc.); algunas stores o jurisdicciones lo piden.
- [ ] **Exportación / uso restringido**: si en el futuro la app tuviera cifrado fuerte, revisar normativas de exportación (EE.UU., etc.); para el MVP típicamente no aplica.

---

## 7. Cuentas de desarrollador y publicación

- [ ] **Google Play**: cuenta de desarrollador (pago único); app en estado “Producción” o “Prueba interna/cerrada” según estrategia.
- [ ] **Apple App Store**: cuenta Apple Developer (anual); App Store Connect con la app creada.
- [ ] **Precio y disponibilidad**: gratis o de pago; países/regiones donde se publica.
- [ ] **Formularios de la store**: cuestionarios de contenido (contenido sensible, anuncios, compras in-app, etc.) completados en ambas tiendas.

---

## 8. Post-lanzamiento (opcional pero recomendado)

- [ ] **Crash reporting**: Sentry, Firebase Crashlytics o similar integrado en el build de producción.
- [ ] **Analytics** (respetando privacidad y política): eventos básicos (sesiones iniciadas, alertas disparadas) para entender uso; sin PII sin consentimiento.
- [ ] **Actualizaciones**: flujo para notificar al usuario de nuevas versiones (in-app o solo por la store).
- [ ] **Soporte**: email o web de contacto en la ficha de la app y dentro de la app (Ayuda / Contacto).

---

## Resumen mínimo para la primera publicación

1. Nombre, descripción, icono y capturas en ambas tiendas.  
2. Política de privacidad y términos en URL; permisos y datos declarados en App Privacy y Data safety.  
3. Build de release firmado (EAS o manual) y probado en dispositivo real.  
4. Disclaimer de “asistencia al conductor” y no sustitución de responsabilidad.  
5. Cuentas de desarrollador activas y formularios de contenido completados.

Con esto tenés la base para una app robusta y publicable; después se puede iterar en interfaz, seguridad avanzada y funcionalidades extra.
