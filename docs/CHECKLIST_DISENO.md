# Checklist: Diseño de la app (UI/UX)

Lista para llevar la app de un estado “funcional/debug” a un diseño coherente, usable y accesible. Pensado para Sleepy Hollow (detección de somnolencia).

---

## 1. Sistema de diseño base

- [ ] **Paleta de colores** definida: primario, secundario, fondos, texto, estados (éxito, advertencia, alarma, error).
- [ ] **Tipografía**: familias y tamaños (título, subtítulo, cuerpo, pie, labels); escalado para accesibilidad si el usuario aumenta el tamaño de fuente.
- [ ] **Espaciado** consistente: grid (ej. 4/8px), márgenes y paddings por tipo de pantalla/sección.
- [ ] **Iconografía**: set único (SF Symbols, Material Icons o custom); mismo peso/estilo en toda la app.
- [ ] **Bordes y radios**: estándar para cards, botones, inputs (ej. 8px, 12px, 16px).
- [ ] **Sombras / elevación** (Android): niveles definidos para overlays, cards, FAB.
- [ ] **Archivo de tokens**: colores, espaciados y tipografía en un solo lugar (theme/constants o design tokens) para no repetir valores mágicos.

---

## 2. Pantallas y flujos principales

- [ ] **Onboarding** (primera vez): 2–4 pantallas que expliquen qué hace la app, uso de cámara, y pedido de permiso de cámara en el momento adecuado.
- [ ] **Home / dashboard**: entrada clara a “Iniciar monitoreo” o “Modo conducción”; opcionalmente resumen de última sesión o estadísticas simples.
- [ ] **Pantalla de Drive Mode (producción)**:
  - Sin textos de debug en producción (o modo debug oculto).
  - Estados visuales claros: **AWAKE** (verde o neutro), **DROWSY_WARNING** (amarillo/naranja), **ALARM** (rojo + sonido/vibración).
  - Indicador grande y legible del estado (icono + texto corto).
  - Botón visible para “Salir” o “Finalizar sesión”.
  - Hint sutil para “Apuntá la cámara al rostro” sin saturar.
- [ ] **Post-sesión**: resumen breve (duración, número de alertas); opción “Ver historial” o “Volver al inicio”.
- [ ] **Historial de sesiones**: lista de sesiones con fecha, duración, eventos de somnolencia; filtros o orden.
- [ ] **Configuración**: sensibilidad, activar/desactivar sonido y vibración, opción de datos anónimos, enlaces a privacidad y términos.
- [ ] **Estados vacíos**: “Sin sesiones aún”, “Sin conexión” (si aplica), “Permiso de cámara denegado” con CTA claro.
- [ ] **Permisos**: pantalla dedicada o modal que explique por qué se pide la cámara y botón que lleve a Ajustes si fue denegado.

---

## 3. Componentes reutilizables

- [ ] **Botones**: primario, secundario, outline, peligro; estados disabled y loading.
- [ ] **Cards**: para sesiones, resúmenes, opciones de configuración.
- [ ] **Inputs**: si hay login/registro o formularios; estado de error y helper text.
- [ ] **Headers / nav**: título, back, acciones; consistente entre pantallas.
- [ ] **Indicadores de estado**: chips o badges (AWAKE / DROWSY / ALARM) reutilizables.
- [ ] **Modales / bottom sheets**: para confirmaciones (ej. “¿Salir del modo conducción?”) y opciones.
- [ ] **Toasts o snackbars**: feedback breve (“Sesión guardada”, “Configuración actualizada”) sin bloquear la pantalla.

---

## 4. Feedback y estados

- [ ] **Loading**: skeleton o spinner en pantallas que cargan datos; en Drive Mode, “Preparando cámara…” ya está, unificar estilo.
- [ ] **Éxito / error**: mensajes claros tras acciones (guardar, enviar); no solo logs en consola.
- [ ] **Transiciones**: animaciones ligeras al cambiar de pantalla o al pasar AWAKE → DROWSY → ALARM (ej. cambio de color o icono suave).
- [ ] **Alarma activa**: además de sonido y vibración, refuerzo visual fuerte (color, parpadeo suave o borde) para que se note de reojo al conducir.
- [ ] **Haptics**: ya tenés vibración; opcionalmente feedback táctil sutil en botones (Light Impact) para sensación de calidad.

---

## 5. Accesibilidad (a11y)

- [ ] **Etiquetas de accesibilidad**: `accessibilityLabel` y `accessibilityHint` en botones e iconos importantes.
- [ ] **Orden de foco**: que el lector de pantalla recorra la pantalla en un orden lógico.
- [ ] **Contraste**: textos y botones que cumplan ratio mínimo (WCAG 4.5:1 para texto normal, 3:1 para grande).
- [ ] **Tamaño de toque**: áreas táctiles de al menos 44×44 pt (iOS) / 48×48 dp (Android).
- [ ] **Reducir movimiento**: respetar “Reducir movimiento” del sistema si se usan animaciones fuertes.
- [ ] **Modo oscuro**: soporte opcional (colores y fondos que funcionen en dark mode) o al menos no romper si el sistema fuerza oscuro.
- [ ] **Escala de fuente**: que los textos escalen con la configuración de tamaño de fuente del dispositivo.

---

## 6. Responsive y dispositivos

- [ ] **Orientación**: Drive Mode en landscape ya está; el resto de pantallas en portrait (o adaptar si hay tablet).
- [ ] **Safe areas**: notch, isla dinámica, barra de gestos; usar `SafeAreaView` o insets de `react-native-safe-area-context` en todas las pantallas.
- [ ] **Tablets**: si la app es “soporta tablet”, layout que no se estire mal (máximo ancho de contenido o columnas).
- [ ] **Distintas resoluciones**: probar en pantallas pequeñas y grandes; textos que no se corten ni overflow.

---

## 7. Consistencia y pulido

- [ ] **Navegación**: stack o tabs definidos; sin pantallas huérfanas sin forma de volver.
- [ ] **Idioma**: todos los textos en strings (i18n) aunque sea solo español; evitar textos hardcodeados en componentes.
- [ ] **Números y fechas**: formato local (ej. hora 24h/12h, fecha corta según región).
- [ ] **Sin “debug” en producción**: quitar o ocultar “Drive Mode (debug)”, “State: …”, “Eyes L/R”, “Sonido: listo”, etc. en build de release.
- [ ] **Splash e icono**: coherentes con la paleta y el nombre de la app; sin placeholders de Expo por defecto si ya tenés marca.

---

## 8. Experiencia en uso real (conducción)

- [ ] **Legibilidad con un vistazo**: estado (AWAKE/DROWSY/ALARM) reconocible en menos de un segundo.
- [ ] **Alarma imposible de ignorar**: combinación de sonido + vibración + cambio visual fuerte.
- [ ] **Mínimas distracciones**: en Drive Mode, pocos elementos; evitar notificaciones o modales inesperados que obliguen a tocar la pantalla.
- [ ] **Salir con un toque**: botón “Salir” o “Finalizar” siempre accesible y claro.
- [ ] **Recordatorio de colocar el teléfono**: en onboarding o antes de iniciar, texto o ilustración de “colocá el dispositivo en posición horizontal, con la cámara hacia vos”.

---

## Resumen mínimo para un primer diseño “listo”

1. Definir **paleta, tipografía y espaciado** (tokens/theme).  
2. **Drive Mode** sin debug, con estados visuales claros (AWAKE / DROWSY / ALARM) y botón de salir.  
3. **Onboarding** + **Home** + **Configuración** (y opcional historial) con los mismos componentes y estilo.  
4. **Safe areas** y **accesibilidad** básica (labels, contraste, tamaño de toque).  
5. **Textos** sacados a strings y **modo producción** sin mensajes de desarrollo.

Con esto tenés una base sólida de diseño; después se puede iterar en animaciones, modo oscuro y detalles de marca.
