## Plan de Proyecto – App de Detección de Somnolencia con Cámara (React Native + NestJS)

### 1. Resumen ejecutivo

App móvil que usa la cámara frontal del teléfono y modelos de visión por computadora (Google ML Kit u otro) para detectar signos de somnolencia (ojos cerrados, parpadeo excesivo, cabeza inclinada) durante actividades críticas como conducir, y emitir alertas inmediatas.  
Consta de:

- **Frontend**: React Native (TypeScript).
- **Backend**: NestJS (Node + TypeScript) + PostgreSQL.
- **ML on-device**: Google ML Kit (detección de rostro) o alternativa equivalente.

---

### 2. Objetivos del producto

- **Objetivo principal**: Reducir el riesgo de accidentes por somnolencia detectando signos tempranos y alertando al usuario en tiempo real.
- **Objetivos secundarios**:
  - Ofrecer estadísticas sobre los momentos del día con mayor somnolencia.
  - Permitir configuración de sensibilidad y tipo de alertas.
  - Mantener la privacidad procesando video localmente en el dispositivo.

---

### 3. Alcance del MVP

- **Usuarios y cuentas**
  - Registro e inicio de sesión (email + contraseña).
  - Perfil básico (nombre, país, tipo de conductor: profesional/particular).

- **Monitoreo en tiempo real**
  - Inicio y fin manual de una “sesión de monitoreo”.
  - Uso de cámara frontal continua mientras dura la sesión.
  - Procesamiento on-device para:
    - Detección de rostro y ojos.
    - Estimación de apertura de ojos.
    - Inclinación de cabeza.
  - Disparo de alertas:
    - Sonido intenso.
    - Vibración del dispositivo.
    - Cambios visuales (pantalla brillante, colores de alerta).

- **Historial**
  - Lista de sesiones con fecha y duración.
  - Conteo de eventos de somnolencia por sesión.
  - Resumen simple (ej. “3 alertas en 45 minutos”).

- **Configuración**
  - Niveles de sensibilidad (baja, media, alta).
  - Tipos de alerta (activados/desactivados).
  - Configuración de envío de datos anónimos al backend (opt-in).

- **Legal y privacidad**
  - Pantalla de onboarding con explicación de funcionamiento y límites.
  - Pantalla de términos y condiciones + política de privacidad.

---

### 4. Fuera de alcance (para futuras versiones)

- Integración con sistemas del coche (OBD-II, CarPlay/Android Auto).
- Modelos de ML propios entrenados con dataset propio.
- Panel web para flotas de vehículos.
- Gamificación o recompensas por conducir sin somnolencia.

---

### 5. Arquitectura de alto nivel

- **Cliente móvil (React Native + Expo Dev Client)**
  - UI, navegación y experiencia de usuario.
  - Captura de video de la cámara frontal usando `react-native-vision-camera`.
  - Procesamiento on-device en tiempo real usando ML Kit Face Detection (vía módulo nativo compatible con Expo).
  - Cálculo de heurísticas de somnolencia (PERCLOS-like, duración de parpadeo, head nod) y disparo de alertas.
  - Comunicación con backend vía HTTP (REST) sobre HTTPS.
  - Cache y persistencia local (AsyncStorage / MMKV) para datos no críticos.

- **Backend (NestJS)**
  - API REST con endpoints para:
    - Autenticación (login, refresh tokens).
    - Gestión de usuarios.
    - Registros de sesiones de monitoreo.
    - Eventos agregados de somnolencia (sin imágenes).
  - Capa de acceso a datos con PostgreSQL (ORM: Prisma o TypeORM).
  - Validación de entrada/salida (DTOs, class-validator o zod).
  - Logging y manejo centralizado de errores.

- **Infraestructura**
  - Despliegue del backend en PaaS (Railway, Render, Fly.io o similar).
  - Base de datos PostgreSQL gestionada (Supabase, Neon, RDS).
  - CI/CD básico para testear y desplegar.

---

### 6. Stack técnico detallado

- **Frontend (Expo + Dev Client)**
  - Expo (prebuild + Dev Client, no Expo Go).
  - React Native + TypeScript (modo estricto).
  - Gestión de estado y datos:
    - TanStack Query para comunicación con backend y cache de datos remotos.
    - Estado local sencillo con React context/hooks.
  - Navegación:
    - React Navigation (stack + tabs).
  - Estilos:
    - Tailwind RN o alternativa similar.
  - Integraciones nativas:
    - `react-native-vision-camera` para cámara frontal en tiempo real.
    - Módulo ML Kit Face Detection (por ejemplo, `react-native-mlkit` / Expo Modules) para:
      - Probabilidad de ojos abiertos (left/right eye open probability) cuando esté disponible.
      - Euler angles de la cabeza (pitch/yaw/roll).
      - Bounding box y trackingId.

- **Backend**
  - NestJS + TypeScript.
  - ORM:
    - Prisma o TypeORM (preferencia por Prisma por DX).
  - Autenticación:
    - JWT (access + refresh tokens).
  - Validación:
    - class-validator / class-transformer o zod.
  - Tests:
    - Jest para unitarios e integración.

- **ML / Visión por computadora on-device**
  - Opción principal:
    - Google ML Kit Face Detection (Android/iOS) integrado como módulo nativo.
  - Señales principales:
    - Probabilidad de ojos abiertos/cerrados (min(leftEyeOpen, rightEyeOpen)).
    - Euler angles de la cabeza (pitch, yaw) para detectar cabeceo.
    - Presencia/perdida de rostro (face bounds, trackingId).
  - Futuro / mayor precisión:
    - MediaPipe Face Landmarker como evolución si se necesitan landmarks finos.

---

### 7. Diseño funcional (flujos clave)

#### 7.1 Registro e inicio de sesión

1. Usuario abre app por primera vez → onboarding + aceptación de términos.
2. Pantalla de registro: email, contraseña, confirmación.
3. Backend crea usuario y devuelve tokens JWT.
4. Tokens almacenados de forma segura en el dispositivo.
5. Sesiones posteriores: login o auto-login si el token sigue siendo válido.

#### 7.2 Inicio de sesión de monitoreo

1. Usuario abre app y ve la pantalla principal.
2. Pulsa “Iniciar monitoreo”.
3. App solicita permisos de cámara (si no existen).
4. Comienza la captura con cámara frontal.
5. Se inicializa el detector de rostro/ojos.
6. Se crea registro de sesión en backend (opcionalmente al finalizar para modo offline).

#### 7.3 Detección de somnolencia y alertas

1. Por cada frame (o cada N frames), el pipeline de cámara hace:
   - `react-native-vision-camera` captura el frame de la cámara frontal.
   - El frame se procesa con ML Kit Face Detection (frame processor / analyzer).
2. ML Kit devuelve por frame:
   - `leftEyeOpenProbability`, `rightEyeOpenProbability` (si están disponibles en la plataforma).
   - `headEulerAngleX` (pitch) y `headEulerAngleY` (yaw).
   - `faceBounds` y `trackingId` para saber si hay rostro estable.
3. Un motor de somnolencia (`Drowsiness Engine`, implementado como state machine) mantiene:
   - Estados: `CALIBRATING`, `AWAKE`, `DROWSY_WARNING`, `ALARM`, `FACE_LOST`.
   - Timers/contadores:
     - `closedMs` (tiempo con ojos cerrados sostenidos).
     - `longBlinkCount60s` (parpadeos largos en los últimos 60s).
     - `headNodCount60s` (eventos de cabeceo en los últimos 60s).
     - `lastFaceSeenAt`.
4. Reglas base (umbrales iniciales):
   - Umbral de ojo cerrado:
     - `eyeOpenThreshold = 0.20` (ojo “cerrado” si `min(left, right) < 0.20`).
   - Microsueño:
     - `closedMs >= 1500 ms` → estado `ALARM` directo.
   - Advertencia de drowsiness:
     - `closedMs >= 900 ms` → estado `DROWSY_WARNING`.
   - Parpadeo largo:
     - Cierre entre `400–900 ms` → cuenta como `long blink`.
     - `>= 3` parpadeos largos en `60 s` → `DROWSY_WARNING`.
   - Cabeceo:
     - `pitchDownThreshold ≈ baselinePitch + 12–15°` sostenido `>= 700 ms` → `HeadNod event`.
     - `>= 2` head nods en `60 s` → al menos `DROWSY_WARNING` (o `ALARM` si se combina con ojos).
   - Reglas de combinación:
     - Si `microsleep (>=1500ms)` → `ALARM`.
     - Si `warningEyes (>=900ms)` + `head nod` → `ALARM`.
     - Si parpadeos largos frecuentes + varios head nods → escalar de `DROWSY_WARNING` a `ALARM`.
5. Manejo de condiciones especiales:
   - **Low light / noche**:
     - Detectar brillo bajo y mostrar mensaje tipo “Need more light”.
     - Reducir confianza y no disparar `ALARM` solo por ojos si la detección es inestable.
   - **Gafas / lentes de sol**:
     - Si `eyeOpenProbability` se vuelve poco confiable, priorizar:
       - Cabeceo (`head nod`), `faceLost` y orientación de cara.
       - Mostrar copy del estilo “Sunglasses may reduce accuracy”.
   - **Cara fuera de cuadro**:
     - Si se pierde rostro `> 2 s`:
       - Estado `FACE_LOST` + warning “Reposition phone”.
6. Alertas:
   - `WARNING`:
     - Beep corto + vibración corta, mensaje suave.
   - `ALARM`:
     - Sonido fuerte y repetitivo + vibración intensa.
     - Cooldown (ej. `10–15 s`) entre alarmas fuertes para evitar spam.
7. Al finalizar sesión:
   - Enviar resumen de sesión al backend:
     - Inicio/fin.
     - Número y tipo de alertas (warning/alarm).
     - Nivel de sensibilidad/calibración.

#### 7.4 Historial y estadísticas

1. App consulta backend para obtener lista de sesiones del usuario.
2. Muestra lista con:
   - Fecha, duración, número de alertas.
3. Pantalla de detalle:
   - Cronología simple de eventos.
4. Estadísticas agregadas básicas:
   - Promedio de alertas por sesión.
   - Franja horaria con más alertas (mañana/tarde/noche).

---

### 8. Diseño de datos (MVP)

- **Usuario**
  - id
  - email
  - password hash
  - nombre
  - tipo_conductor (profesional/particular)
  - creado_en / actualizado_en

- **Sesión de monitoreo**
  - id
  - usuario_id
  - inicio
  - fin
  - sensibilidad (baja/media/alta)
  - total_alertas
  - creado_en / actualizado_en

- **Evento de somnolencia** (opcional o agregado)
  - id
  - sesion_id
  - timestamp_relativo
  - severidad (leve/moderada/severa)
  - creado_en

---

### 9. Roadmap por fases

#### Fase 1 – Setup y base técnica

- Crear repos (o monorepo) para frontend y backend.
- Configurar TypeScript estricto, ESLint, Prettier en ambos.
- Crear app React Native básica con pantalla inicial.
- Crear backend NestJS con endpoint de `health`.

#### Fase 2 – Autenticación y modelo de datos

- Implementar registro y login en backend con JWT.
- Crear esquema de BD para usuarios y sesiones.
- Implementar endpoints CRUD mínimos para usuarios y sesiones.
- Conectar app móvil con estos endpoints (registro/login, listar sesiones vacías).

#### Fase 3 – Cámara y ML en cliente

- Integrar cámara frontal en React Native.
- Investigar y elegir librería/SDK para ML Kit o equivalente.
- Crear módulo/hook `useDrowsinessDetection` que:
  - Reciba frames o datos de rostro.
  - Calcule heurísticas.
  - Exponga estado (`isDrowsy`, `alertsCount`, etc.).

#### Fase 4 – Lógica de somnolencia y UX de alertas

- Implementar heurísticas iniciales y parámetros de sensibilidad.
- Diseñar UI de monitoreo:
  - Vista cámara.
  - Indicadores de estado (OK / alerta).
  - Botón grande de “Parar”.
- Implementar alertas (sonido, vibración, visual).
- Guardar estadísticas simples durante la sesión.

#### Fase 5 – Historial y configuración

- Implementar pantalla de historial de sesiones.
- Implementar pantalla de detalle de sesión.
- Implementar pantalla de configuración:
  - Sensibilidad.
  - Tipos de alerta.
  - Opt-in de envío de datos anónimos.

#### Fase 6 – Endurecimiento, pruebas y beta

- Escribir tests unitarios clave:
  - Heurísticas de somnolencia.
  - Flujos de auth.
- Tests de integración en backend para endpoints críticos.
- Ajustar rendimiento (uso de CPU y batería).
- Despliegue de backend en entorno de prueba.
- Lanzar beta cerrada (TestFlight/Google Play Internal).

---

### 10. Riesgos y mitigaciones

- **Riesgo: detecciones falsas (falsos positivos/negativos)**
  - Mitigación: ajustar heurísticas y sensibilidad, recoger feedback de usuarios, ofrecer opción de calibración.

- **Riesgo: consumo de batería y calor**
  - Mitigación: limitar FPS, optimizar procesamiento, pausar procesamiento cuando no haya rostro detectado.

- **Riesgo: temas legales y de responsabilidad**
  - Mitigación: avisos claros, términos de uso, explicar que es una ayuda, no un sustituto de la atención humana.

- **Riesgo: privacidad**
  - Mitigación: no subir video/fotos por defecto, solo datos agregados, informar claramente al usuario.

---

### 11. Métricas de éxito (MVP)

- Número de sesiones de monitoreo por usuario.
- Porcentaje de usuarios que activan el monitoreo más de una vez.
- Frecuencia de alertas por sesión (esperando que disminuya con el tiempo por mejor gestión del sueño).
- Retención de usuarios a 7 y 30 días.
- Número de crashes y errores reportados.

---

### 12. Próximos pasos

- Definir de forma definitiva:
  - Expo vs bare React Native (por las integraciones nativas de cámara/ML).
  - Google ML Kit concreto a usar y cómo integrarlo.
- Crear la estructura inicial de proyectos siguiendo este plan.
- A partir de aquí, detallar tareas técnicas concretas (issues) por fase.

