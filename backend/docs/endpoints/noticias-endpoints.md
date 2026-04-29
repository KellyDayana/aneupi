# 📰 Documentación de Endpoints - Módulo Noticias

## 📋 Estados de Noticia

```typescript
enum EstadoNoticia {
  PENDIENTE_APROBACION  // Estado inicial al crear una noticia
  APROBADO              // Noticia aprobada pero aún no publicada
  PUBLICADO             // Noticia visible públicamente
  OCULTO                // Noticia oculta temporalmente
  PROGRAMADO            // Noticia programada para publicación futura
  RECHAZADO             // Noticia rechazada
}
```

## 🔄 Reglas de Transición de Estados

- **RECHAZADO** → Solo puede volver a **PENDIENTE_APROBACION**
- **PUBLICADO** → No puede volver a **PENDIENTE_APROBACION** o **APROBADO**
- **PUBLICADO** → Puede ir a **OCULTO**

---

## 📌 Endpoints Disponibles

### 1. **Crear Noticia**
```http
POST /api/noticias
```

**Body:**
```json
{
  "titulo": "Nueva noticia sobre tecnología",
  "extracto": "Un resumen breve de la noticia",
  "contenido_noticia": "Contenido completo de la noticia...",
  "url_imagen": "https://example.com/imagen.jpg",
  "url_preview_imagen": "https://example.com/imagen_preview.jpg",
  "autor_id": 1,
  "categoria_id": 2,
  "estado": "PENDIENTE_APROBACION"  // Opcional, por defecto es PENDIENTE_APROBACION
}
```

**Respuesta exitosa (201):**
```json
{
  "success": true,
  "data": {
    "noticia_id": 7,
    "titulo": "Nueva noticia sobre tecnología",
    "extracto": "Un resumen breve de la noticia",
    "contenido_noticia": "Contenido completo de la noticia...",
    "url_imagen": "https://example.com/imagen.jpg",
    "url_preview_imagen": "https://example.com/imagen_preview.jpg",
    "vistas": 0,
    "estado": "PENDIENTE_APROBACION",
    "fecha_publicacion": "2025-11-10T19:30:00.000Z",
    "autor_id": 1,
    "categoria_id": 2,
    "autor": {
      "usuario_id": 1,
      "nombre_completo": "Juan Pérez",
      "email": "juan@example.com"
    },
    "categoria": {
      "categoria_id": 2,
      "nombre": "Tecnología"
    }
  },
  "message": "Noticia creada exitosamente"
}
```

---

### 2. **Obtener Todas las Noticias** (con filtros)
```http
GET /api/noticias
```

**Query Parameters:**
- `categoria_id` (opcional): Filtrar por ID de categoría
- `autor_id` (opcional): Filtrar por ID de autor
- `estado` (opcional): Filtrar por estado (`PENDIENTE_APROBACION`, `APROBADO`, `PUBLICADO`, `OCULTO`, `PROGRAMADO`, `RECHAZADO`)
- `search` (opcional): Buscar en título, extracto o contenido
- `skip` (opcional): Número de registros a saltar (paginación), default: 0
- `take` (opcional): Número de registros a obtener, default: 10
- `orderBy` (opcional): Orden de fecha (`asc` o `desc`), default: `desc`

**Ejemplos de uso:**

```http
# Obtener solo noticias publicadas
GET /api/noticias?estado=PUBLICADO

# Obtener noticias pendientes de aprobación
GET /api/noticias?estado=PENDIENTE_APROBACION

# Obtener noticias de una categoría específica
GET /api/noticias?categoria_id=2

# Buscar noticias con paginación
GET /api/noticias?search=tecnología&skip=0&take=10

# Obtener noticias publicadas de un autor específico
GET /api/noticias?autor_id=1&estado=PUBLICADO

# Combinar múltiples filtros
GET /api/noticias?categoria_id=2&estado=PUBLICADO&skip=0&take=5&orderBy=desc
```

**Respuesta exitosa (200):**
```json
{
  "success": true,
  "data": [
    {
      "noticia_id": 1,
      "titulo": "IA en la educación",
      "extracto": "Resumen...",
      "contenido_noticia": "Contenido...",
      "url_imagen": "...",
      "url_preview_imagen": "...",
      "vistas": 156,
      "estado": "PUBLICADO",
      "fecha_publicacion": "2025-11-10T00:00:00.000Z",
      "autor_id": 1,
      "categoria_id": 2,
      "autor": {
        "usuario_id": 1,
        "nombre_completo": "Juan Pérez",
        "email": "juan@example.com"
      },
      "categoria": {
        "categoria_id": 2,
        "nombre": "Tecnología",
        "descripcion": "..."
      },
      "_count": {
        "comentarios": 3
      },
      "reacciones": {
        "LIKE": 5,
        "CORAZON": 3,
        "APLAUSO": 2,
        "total": 10
      }
    }
  ],
  "count": 1
}
```

---

### 3. **Obtener Noticia por ID**
```http
GET /api/noticias/:id
```

**Ejemplo:**
```http
GET /api/noticias/1
```

**Respuesta exitosa (200):**
```json
{
  "success": true,
  "data": {
    "noticia_id": 1,
    "titulo": "IA en la educación",
    "extracto": "Resumen...",
    "contenido_noticia": "Contenido completo...",
    "url_imagen": "...",
    "url_preview_imagen": "...",
    "vistas": 157,
    "estado": "PUBLICADO",
    "fecha_publicacion": "2025-11-10T00:00:00.000Z",
    "autor_id": 1,
    "categoria_id": 2,
    "autor": {
      "usuario_id": 1,
      "nombre_completo": "Juan Pérez",
      "email": "juan@example.com",
      "rol": "ADMIN"
    },
    "categoria": {
      "categoria_id": 2,
      "nombre": "Tecnología",
      "descripcion": "..."
    },
    "comentarios": [
      {
        "comentario_id": 1,
        "mensaje": "Excelente noticia!",
        "fecha_hora": "2025-11-10T10:00:00.000Z",
        "usuario": {
          "usuario_id": 2,
          "nombre_completo": "María López"
        },
        "respuestas": []
      }
    ],
    "reacciones": {
      "LIKE": 5,
      "CORAZON": 3,
      "APLAUSO": 2,
      "total": 10
    }
  }
}
```

---

### 4. **Actualizar Noticia**
```http
PUT /api/noticias/:id
```

**Body (todos los campos opcionales):**
```json
{
  "titulo": "Título actualizado",
  "extracto": "Extracto actualizado",
  "contenido_noticia": "Contenido actualizado...",
  "url_imagen": "https://example.com/nueva_imagen.jpg",
  "url_preview_imagen": "https://example.com/nueva_preview.jpg",
  "categoria_id": 3,
  "estado": "APROBADO"  // También se puede actualizar el estado aquí
}
```

**Respuesta exitosa (200):**
```json
{
  "success": true,
  "data": {
    "noticia_id": 1,
    "titulo": "Título actualizado",
    "extracto": "Extracto actualizado",
    "estado": "APROBADO",
    // ... resto de campos
  },
  "message": "Noticia actualizada exitosamente"
}
```

---

### 5. **Ocultar Noticia (Eliminación Lógica)** ⭐ RECOMENDADO
```http
DELETE /api/noticias/:id
```

**Ejemplo:**
```http
DELETE /api/noticias/1
```

**Respuesta exitosa (200):**
```json
{
  "success": true,
  "data": {
    "noticia_id": 1,
    "titulo": "...",
    "estado": "OCULTO",
    "fecha_publicacion": "2025-11-10T00:00:00.000Z",
    // ... resto de campos
  },
  "message": "Noticia ocultada exitosamente"
}
```

> **Nota:** Este es el método recomendado para "eliminar" noticias. Cambia el estado a `OCULTO` sin borrar los datos. La noticia y sus comentarios permanecen en la base de datos pero no se mostrarán en listados públicos.

---

### 6. **Eliminar Noticia Permanentemente** ⚠️
```http
DELETE /api/noticias/:id/permanente
```

**Ejemplo:**
```http
DELETE /api/noticias/1/permanente
```

**Respuesta exitosa (200):**
```json
{
  "success": true,
  "message": "Noticia eliminada permanentemente"
}
```

> **⚠️ ADVERTENCIA:** Esta operación es irreversible. La noticia, todos sus comentarios y reacciones se eliminan permanentemente de la base de datos. Solo usar en casos extremos y con permisos de administrador.

---

### 7. **Cambiar Estado de Noticia** ⭐
```http
PATCH /api/noticias/:id/estado
```

**Body:**
```json
{
  "estado": "PUBLICADO"
}
```

**Valores válidos:**
- `PENDIENTE_APROBACION`
- `APROBADO`
- `PUBLICADO`
- `OCULTO`
- `PROGRAMADO`
- `RECHAZADO`

**Respuesta exitosa (200):**
```json
{
  "success": true,
  "data": {
    "noticia_id": 1,
    "titulo": "...",
    "estado": "PUBLICADO",
    // ... resto de campos
  },
  "message": "Estado de la noticia actualizado exitosamente"
}
```

**Respuesta de error (400):**
```json
{
  "success": false,
  "error": "Una noticia publicada no puede volver a estado PENDIENTE_APROBACION o APROBADO"
}
```

**Ejemplos de uso:**

```bash
# Aprobar una noticia pendiente
PATCH /api/noticias/1/estado
Body: { "estado": "APROBADO" }

# Publicar una noticia aprobada
PATCH /api/noticias/1/estado
Body: { "estado": "PUBLICADO" }

# Ocultar una noticia publicada
PATCH /api/noticias/1/estado
Body: { "estado": "OCULTO" }

# Rechazar una noticia pendiente
PATCH /api/noticias/1/estado
Body: { "estado": "RECHAZADO" }

# Re-evaluar una noticia rechazada
PATCH /api/noticias/1/estado
Body: { "estado": "PENDIENTE_APROBACION" }
```

---

### 8. **Obtener Noticias Más Vistas**
```http
GET /api/noticias/mas-vistas
```

**Query Parameters:**
- `limit` (opcional): Número de noticias a obtener, default: 10

**Ejemplo:**
```http
GET /api/noticias/mas-vistas?limit=5
```

**Respuesta exitosa (200):**
```json
{
  "success": true,
  "data": [
    {
      "noticia_id": 5,
      "titulo": "Selección ecuatoriana...",
      "vistas": 567,
      "estado": "PUBLICADO",
      "reacciones": {
        "LIKE": 15,
        "CORAZON": 8,
        "total": 23
      },
      // ... resto de campos
    }
  ]
}
```

---

## 🎯 Casos de Uso Comunes

### Workflow de Publicación de Noticia

```bash
# 1. Crear noticia (estado inicial: PENDIENTE_APROBACION)
POST /api/noticias
Body: { título, contenido, autor_id, categoria_id }

# 2. Editor revisa y aprueba
PATCH /api/noticias/7/estado
Body: { "estado": "APROBADO" }

# 3. Publicar la noticia
PATCH /api/noticias/7/estado
Body: { "estado": "PUBLICADO" }

# 4. (Opcional) Ocultar temporalmente con DELETE (eliminación lógica)
DELETE /api/noticias/7
# La noticia cambia a estado OCULTO pero permanece en la BD

# 5. (Opcional) Re-publicar desde oculto
PATCH /api/noticias/7/estado
Body: { "estado": "PUBLICADO" }
```

### Gestión de Noticias Inapropiadas o con Errores

```bash
# Opción 1: Ocultar la noticia (RECOMENDADO)
DELETE /api/noticias/5
# Cambia el estado a OCULTO, datos se mantienen

# Opción 2: Corregir y volver a publicar
PUT /api/noticias/5
Body: { "titulo": "Título corregido", "contenido_noticia": "..." }
PATCH /api/noticias/5/estado
Body: { "estado": "PUBLICADO" }

# Opción 3: Eliminación permanente (SOLO CASOS EXTREMOS)
DELETE /api/noticias/5/permanente
# ⚠️ IRREVERSIBLE: Elimina la noticia, comentarios y reacciones para siempre
```

### Obtener Noticias para el Público

```bash
# Solo mostrar noticias publicadas en el frontend
GET /api/noticias?estado=PUBLICADO&take=10&orderBy=desc
```

### Panel de Administración

```bash
# Ver todas las noticias pendientes
GET /api/noticias?estado=PENDIENTE_APROBACION

# Ver noticias rechazadas
GET /api/noticias?estado=RECHAZADO

# Ver todas las noticias (sin filtro de estado)
GET /api/noticias
```

---

## ⚠️ Notas Importantes

### Diferencias entre Métodos de Eliminación

| Método | Endpoint | Acción | Reversible | Datos Conservados | Uso Recomendado |
|--------|----------|--------|------------|-------------------|-----------------|
| **Eliminación Lógica** | `DELETE /api/noticias/:id` | Cambia estado a OCULTO | ✅ Sí | ✅ Sí (todo) | Uso normal, ocultar contenido |
| **Cambio de Estado** | `PATCH /api/noticias/:id/estado` | Cambia cualquier estado | ✅ Sí | ✅ Sí (todo) | Workflow de aprobación |
| **Eliminación Física** | `DELETE /api/noticias/:id/permanente` | Borra de la BD | ❌ No | ❌ No (se pierde todo) | Solo casos extremos |

### Comportamiento de Eliminación Física

Cuando se usa `DELETE /api/noticias/:id/permanente`:
- ✅ **Se eliminan PERMANENTEMENTE:**
  - La noticia
  - Todos los comentarios de la noticia
  - Todas las respuestas a los comentarios
  - Todas las reacciones (noticias y comentarios)

- ⚠️ **Esta operación:**
  - Es irreversible
  - No puede deshacerse
  - Debe usarse solo con permisos de administrador
  - Se recomienda crear backups antes

### Recomendaciones de Uso

1. **Para usuarios normales:** Siempre usar `DELETE /api/noticias/:id` (eliminación lógica)
2. **Para moderadores:** Usar `PATCH /api/noticias/:id/estado` para cambiar entre estados
3. **Para administradores:** Usar eliminación física solo cuando:
   - La noticia contiene información sensible que debe borrarse
   - Es contenido spam o malicioso
   - Se requiere por razones legales (GDPR, etc.)

1. **Estado por defecto:** Al crear una noticia sin especificar estado, se asigna `PENDIENTE_APROBACION`
2. **Incremento de vistas:** Las vistas se incrementan automáticamente cada vez que se obtiene una noticia por ID
3. **Reacciones:** Todas las respuestas incluyen el conteo de reacciones de forma automática
4. **Validación de transiciones:** No todas las transiciones de estado están permitidas (ver reglas arriba)
5. **Cascada de eliminación:** Al eliminar una noticia, se eliminan sus comentarios y reacciones automáticamente

---

## 🔗 Endpoints Relacionados

- **Reacciones:** `/api/reacciones` - Para gestionar likes, dislikes, etc.
- **Comentarios:** `/api/comentarios` - Para gestionar comentarios de noticias
- **Categorías:** `/api/categorias` - Para gestionar categorías de noticias
