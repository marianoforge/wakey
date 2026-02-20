# Brief para Lovable: diseño de Wakey

Copia y pega este texto (o la versión en inglés más abajo) en Lovable para que genere el diseño de la app.

---

## Versión en español

```
App móvil llamada "Wakey" para detectar somnolencia al conducir y alertar en tiempo real.

Qué hace la app:
- El usuario inicia una "sesión de monitoreo" (modo conducción). La cámara frontal del teléfono analiza su rostro en tiempo real (on-device, sin subir video). Si detecta ojos cerrados o signos de somnolencia durante unos segundos, dispara alertas: primero una advertencia (sonido suave + vibración), luego si sigue igual una alarma fuerte (sonido intenso + vibración repetida). Todo es local en el dispositivo; la privacidad es clave.

Pantallas que necesito diseñadas:

1. Onboarding (2–4 pantallas)
   - Explicar en pocas palabras: "Detectamos somnolencia con la cámara frontal y te avisamos con sonido y vibración. Los datos se procesan solo en tu teléfono."
   - Ilustración o icono de cámara + conductor / camino.
   - Al final, botón "Activar cámara" que lleva al pedido de permiso.

2. Home / Inicio
   - Título tipo "Wakey" o "Modo conducción".
   - Botón principal grande: "Iniciar monitoreo" o "Iniciar modo conducción".
   - Opcional: card con resumen de la última sesión (ej. "Última sesión: 45 min, 2 alertas") o "Aún no tenés sesiones".
   - Accesos a: Historial, Configuración (iconos o filas).

3. Modo conducción (Drive Mode) — pantalla en horizontal (landscape)
   - Ocupa toda la pantalla. Vista de cámara frontal de fondo (o placeholder oscuro).
   - Tres estados visuales muy claros, con color e icono grande:
     - Despierto (AWAKE): verde o neutro, icono de ojos abiertos o check. Texto: "Despierto" o "Todo bien".
     - Advertencia (DROWSY): amarillo/naranja, icono de advertencia. Texto: "Cuidado, detectamos somnolencia".
     - Alarma (ALARM): rojo intenso, icono de alarma. Texto: "¡Despertá!" o "Alerta". Debe ser imposible de ignorar (borde parpadeante o fondo rojo suave).
   - Un solo botón visible y grande: "Finalizar sesión" o "Salir", siempre accesible.
   - Hint sutil: "Mantené el rostro frente a la cámara" (solo cuando hace falta, no invasivo).
   - Estilo: minimalista, pocos elementos para no distraer al conducir. Tipografía grande y legible de un vistazo.

4. Post-sesión (después de "Finalizar sesión")
   - Resumen: "Sesión finalizada. Duración: X min. Alertas: N."
   - Botones: "Ver historial", "Volver al inicio".

5. Historial
   - Lista de sesiones: fecha, duración, cantidad de alertas por sesión.
   - Cada ítem en una card o fila. Opcional: ordenar por fecha.

6. Configuración
   - Sensibilidad: Baja / Media / Alta (selector o toggle).
   - Alertas: activar/desactivar sonido, activar/desactivar vibración.
   - Opcional: "Enviar datos anónimos para mejorar la app" (switch opt-in).
   - Enlaces: Política de privacidad, Términos y condiciones.
   - Versión de la app al pie.

7. Permiso de cámara denegado
   - Mensaje claro: "Wakey necesita la cámara para detectar somnolencia."
   - Botón: "Abrir configuración" para ir a Ajustes del sistema.

Estilo general:
- Serio y confiable (seguridad vial), no infantil ni gamificado.
- Paleta: primario que transmita seguridad (ej. azul oscuro o verde tranquilo); rojo/amarillo solo para advertencia y alarma.
- Tipografía clara, buena legibilidad. Soporte para modo oscuro sería un plus.
- Mobile-first: pensado para teléfono en mano o en soporte en el auto; el modo conducción siempre en landscape.
```

---

## Versión en inglés (por si Lovable responde mejor)

```
Mobile app named "Wakey" that detects drowsiness while driving and alerts the user in real time.

What the app does:
- The user starts a "monitoring session" (drive mode). The phone's front camera analyzes their face in real time (on-device, no video upload). If it detects closed eyes or signs of drowsiness for a few seconds, it triggers alerts: first a warning (soft sound + vibration), then if it continues, a strong alarm (loud sound + repeated vibration). Everything runs locally on the device; privacy is a key message.

Screens to design:

1. Onboarding (2–4 screens)
   - Short copy: "We detect drowsiness using the front camera and notify you with sound and vibration. Data is processed only on your phone."
   - Illustration or icon: camera + driver / road.
   - Final CTA: "Enable camera" leading to permission request.

2. Home
   - Title: "Wakey" or "Drive mode".
   - One large primary button: "Start monitoring" or "Start drive mode".
   - Optional: card with last session summary ("Last session: 45 min, 2 alerts") or empty state "No sessions yet".
   - Entry points: History, Settings (icons or rows).

3. Drive mode screen — landscape only
   - Full screen. Front camera view as background (or dark placeholder).
   - Three very clear visual states with color and large icon:
     - Awake (AWAKE): green or neutral, open eyes or check icon. Label: "Awake" or "All good".
     - Warning (DROWSY): yellow/orange, warning icon. Label: "Caution, drowsiness detected".
     - Alarm (ALARM): strong red, alarm icon. Label: "Wake up!" or "Alert". Must be impossible to ignore (subtle pulsing border or red background).
   - One prominent button: "End session" or "Exit", always visible.
   - Subtle hint: "Keep your face in front of the camera" (only when needed).
   - Style: minimal, few elements to avoid distraction while driving. Large, at-a-glance typography.

4. Post-session (after "End session")
   - Summary: "Session ended. Duration: X min. Alerts: N."
   - Buttons: "View history", "Back to home".

5. History
   - List of sessions: date, duration, number of alerts per session.
   - Each item in a card or row. Optional: sort by date.

6. Settings
   - Sensitivity: Low / Medium / High (selector or toggle).
   - Alerts: enable/disable sound, enable/disable vibration.
   - Optional: "Send anonymous data to improve the app" (opt-in switch).
   - Links: Privacy policy, Terms and conditions.
   - App version at the bottom.

7. Camera permission denied
   - Clear message: "Wakey needs the camera to detect drowsiness."
   - Button: "Open settings" to system settings.

Overall style:
- Serious and trustworthy (road safety), not playful or gamified.
- Palette: primary that conveys safety (e.g. dark blue or calm green); red/yellow only for warning and alarm.
- Clear typography, good readability. Dark mode support is a plus.
- Mobile-first: for phone in hand or on a car mount; drive mode is always landscape.
```

---

Copia el bloque en español o en inglés según prefieras y pégalo en Lovable para generar las pantallas y el sistema de diseño.
