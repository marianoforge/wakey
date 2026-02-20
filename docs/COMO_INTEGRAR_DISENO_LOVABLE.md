# Cómo integrar el diseño de Lovable en la app móvil

Lovable genera **apps web** (React + HTML/CSS o Tailwind), no React Native. No se puede copiar y pegar código 1:1, pero sí usar el export como **referencia** para reimplementar el diseño en la app.

---

## 1. Dónde poner el código que bajás de Lovable

Creá una carpeta en la raíz del repo y meté ahí todo lo que descargues:

```
sleepy-hollow/
  design-reference/     ← nueva carpeta
    (todo el ZIP o código de Lovable)
  mobile/               ← app React Native (Expo)
  backend/
  docs/
```

**Sugerencia de nombre:** `design-reference` o `lovable-export`. No la pongas dentro de `mobile/` para no mezclar con el código nativo.

---

## 2. Qué vas a tener en esa carpeta (típico de Lovable)

- Archivos **HTML** o **React** (`.tsx`/`.jsx`) con `div`, `span`, `section`, etc.
- **CSS** (Tailwind clases tipo `className="flex gap-4 ..."`) o archivos `.css`.
- **Colores, fuentes y espaciados** definidos en Tailwind config o en CSS variables.

Eso es **web**, no móvil. En React Native usamos `View`, `Text`, `StyleSheet` (o NativeWind si quisieras Tailwind en RN). Por eso el flujo es: **referencia → traducción**.

---

## 3. Cómo trabajo yo con eso (qué puedo hacer por vos)

Cuando tengas el código en `design-reference/`:

1. **Leo** los componentes y estilos del export (pantallas, secciones, colores, tipografías).
2. **Extraigo** la estructura lógica (qué pantallas hay, qué botones, qué textos) y los **design tokens** (paleta, tamaños de fuente, espaciados).
3. **Reimplemento** en React Native dentro de `mobile/`:
   - `View` en lugar de `div`/`section`
   - `Text` en lugar de `span`/`p`
   - `StyleSheet.create(...)` (o tema compartido) con los mismos colores, tamaños y márgenes que en el diseño.

Es decir: no “meto” el código de Lovable dentro de la app; **traduzco** el diseño a componentes y estilos de React Native y los voy integrando en `mobile/` (por ejemplo en `DriveModeScreen`, una futura `HomeScreen`, etc.).

---

## 4. Pasos concretos que podés seguir

1. **Generá el diseño en Lovable** con el brief que está en `docs/BRIEF_LOVABLE_DISENO.md`.
2. **Descargá el código** (ZIP o clonado desde Lovable).
3. **Descomprimí / copiá** todo dentro de `design-reference/` (o el nombre que elijas).
4. **Avisame** algo tipo: “Ya está el diseño de Lovable en `design-reference/`, quiero que adaptes la pantalla X a la app”.
5. Yo **leo** esa carpeta, tomo estructura y estilos, y te propongo (o escribo) los cambios en `mobile/` (pantallas, componentes, tema).

Opcional: si querés, en `design-reference/` podés dejar también **capturas o un link** a la preview de Lovable; a veces ayuda para ver animaciones o detalles que no están claros en el código.

---

## 5. Resumen

| Lovable (web)     | App móvil (React Native)        |
|-------------------|---------------------------------|
| `div`, `section`  | `View`                          |
| `span`, `p`, `h1` | `Text`                          |
| `className="..."` (Tailwind/CSS) | `StyleSheet` / tema en `mobile/` |
| Rutas web         | Navegación (ej. React Navigation) |

**No** se copian componentes tal cual. **Sí** se usa el código de Lovable como referencia para:
- Estructura de pantallas
- Textos y jerarquía
- Colores, tipografía y espaciado
- Flujo (qué pantalla sigue a cuál)

Con la carpeta `design-reference/` armada, decime qué pantalla o flujo querés primero y voy tomando de ahí para armar o ajustar los componentes en `mobile/`.
