#  Documentación de Endpoints - Módulo Artículos

##  Estados de Artículo

```typescript
enum EstadoNoticia {
  PENDIENTE_APROBACION
  APROBADO
  PUBLICADO
  OCULTO
  PROGRAMADO
  RECHAZADO
}
```

> ⚠️ El módulo de artículos reutiliza el enum `EstadoNoticia` de Prisma.

###  Reglas de transición de estados

- **RECHAZADO** → Solo puede volver a **PENDIENTE_APROBACION**
- **PUBLICADO** → No puede volver a **PENDIENTE_APROBACION** ni **APROBADO**
- **PUBLICADO** → Puede pasar a **OCULTO**

---

##  Campos Clave

| Campo              | Descripción                                                 |
|--------------------|-------------------------------------------------------------|
| `tiempo_lectura`   | Entero > 0 que representa minutos estimados de lectura      |
| `descripcion`      | Breve resumen del artículo                                  |
| `contenido`        | Contenido completo (texto largo)                            |
| `estado`           | Ciclo editorial del artículo                                |
| `vistas`           | Se incrementa automáticamente al consultar un artículo      |

---

##  Endpoints Disponibles

### 1. Crear artículo
```http
POST /api/articulos
```

**Body requerido:**
```json
{
  "titulo": "Guía de IA generativa",
  "descripcion": "Resumen corto...",
  "contenido": "Contenido completo...",
  "url_imagen": "https://cdn.ejemplo.com/portada.jpg",
  "url_preview_imagen": "https://cdn.ejemplo.com/preview.jpg",
  "tiempo_lectura": 8,
  "autor_id": 1,
  "categoria_id": 2,
  "estado": "PENDIENTE_APROBACION" // opcional (default)
}
```

**Validaciones principales:**
- `titulo`, `descripcion`, `contenido` obligatorios y no vacíos
- `tiempo_lectura` entero > 0

**Respuesta (201):**
```json
{
  "success": true,
  "data": {
    "articulo_id": 10,
    "titulo": "Guía de IA generativa",
    "tiempo_lectura": 8,
    "estado": "PENDIENTE_APROBACION",
    "autor": { "usuario_id": 1, "nombre_completo": "Ana Pérez" },
    "categoria": { "categoria_id": 2, "nombre": "Tecnología" }
  },
  "message": "Artículo creado exitosamente"
}
```

---

### 2. Obtener artículos (listado con filtros)
```http
GET /api/articulos
```

**Query params admitidos:**
- `categoria_id` → filtra por categoría
- `autor_id` → filtra por autor
- `estado` → valores del enum `EstadoNoticia`
- `search` → busca en título, descripción y contenido
- `skip`, `take` → paginación (por defecto `skip=0`, `take=10`)
- `orderBy` → `asc` o `desc` según `fecha_publicacion` (default `desc`)

**Respuesta (200):**
```json
{
  "success": true,
  "data": [
    {
      "articulo_id": 5,
      "titulo": "Tips de productividad",
      "tiempo_lectura": 6,
      "estado": "PUBLICADO",
      "autor": { "usuario_id": 2, "nombre_completo": "Luis Torres" },
      "categoria": { "categoria_id": 1, "nombre": "Productividad" },
      "_count": { "comentarios": 0 },
      "reacciones": {
        "LIKE": 3,
        "APLAUSO": 1,
        "total": 4
      }
    }
  ],
  "count": 1
}
```

---

### 3. Obtener artículo por ID
```http
GET /api/articulos/:id
```

- Incrementa el contador de `vistas` de forma automática.
- Devuelve el conteo de reacciones si el servicio está habilitado.

**Ejemplo:** `GET /api/articulos/5`

**Respuesta (200):**
```json
{
  "success": true,
  "data": {
    "articulo_id": 5,
    "titulo": "Tips de productividad",
    "tiempo_lectura": 6,
    "vistas": 257,
    "estado": "PUBLICADO",
    "autor": { "usuario_id": 2, "nombre_completo": "Luis Torres", "rol": "EDITOR" },
    "categoria": { "categoria_id": 1, "nombre": "Productividad" },
    "reacciones": {
      "LIKE": 3,
      "APLAUSO": 1,
      "total": 4
    }
  }
}
```

---

### 4. Actualizar artículo
```http
PUT /api/articulos/:id
```

**Body (campos opcionales):**
```json
{
  "titulo": "Título actualizado",
  "descripcion": "Nuevo resumen",
  "contenido": "Contenido extendido...",
  "url_imagen": "https://cdn.ejemplo.com/nueva.jpg",
  "url_preview_imagen": "https://cdn.ejemplo.com/nueva-preview.jpg",
  "tiempo_lectura": 12,
  "categoria_id": 3,
  "estado": "APROBADO"
}
```

> ✅ Si se modifica `tiempo_lectura` debe seguir siendo un entero > 0.

---

### 5. Ocultar artículo (eliminación lógica recomendada)
```http
DELETE /api/articulos/:id
```

- Cambia el estado a `OCULTO`.
- No elimina comentarios ni reacciones.

**Respuesta (200):**
```json
{
  "success": true,
  "data": {
    "articulo_id": 5,
    "estado": "OCULTO"
  },
  "message": "Artículo ocultado exitosamente"
}
```

---

### 6. Eliminar artículo permanentemente
```http
DELETE /api/articulos/:id/permanente
```

- Elimina el artículo y sus reacciones asociadas.
- Operación irreversible; usar solo en situaciones extremas.

**Respuesta (200):**
```json
{
  "success": true,
  "message": "Artículo eliminado permanentemente"
}
```

---

### 7. Cambiar estado editorial
```http
PATCH /api/articulos/:id/estado
```

**Body requerido:**
```json
{
  "estado": "PUBLICADO"
}
```

- Aplica las mismas reglas de transición definidas al inicio.
- Responde con el artículo actualizado.

---

### 8. Actualizar tiempo de lectura (valor absoluto)
```http
PATCH /api/articulos/:id/tiempo-lectura
```

**Body:**
```json
{
  "tiempo_lectura": 9
}
```

- Reemplaza el tiempo actual con el valor proporcionado.
- Solo acepta enteros > 0.

---

### 9. Incrementar tiempo de lectura (suma acumulativa)
```http
PATCH /api/articulos/:id/tiempo-lectura/incrementar
```

**Body:**
```json
{
  "incremento": 3
}
```

- Suma el incremento al valor existente (`tiempo_lectura += incremento`).
- El incremento debe ser un entero > 0.

---

### 10. Obtener artículos más leídos
```http
GET /api/articulos/mas-leidos
```

**Query opcional:** `limit` (default 10)

**Ejemplo:** `GET /api/articulos/mas-leidos?limit=5`

**Respuesta (200):**
```json
{
  "success": true,
  "data": [
    {
      "articulo_id": 2,
      "titulo": "Buenos hábitos de estudio",
      "vistas": 940,
      "tiempo_lectura": 7,
      "estado": "PUBLICADO",
      "autor": { "usuario_id": 4, "nombre_completo": "Carla Ruiz" },
      "categoria": { "categoria_id": 4, "nombre": "Educación" },
      "reacciones": {
        "LIKE": 12,
        "CORAZON": 4,
        "total": 16
      }
    }
  ]
}
```

---

##  Resumen rápido

| Acción                                  | Método | Ruta                                               |
|-----------------------------------------|--------|----------------------------------------------------|
| Crear artículo                          | POST   | `/api/articulos`                                   |
| Listar artículos                        | GET    | `/api/articulos`                                   |
| Obtener artículo por ID                 | GET    | `/api/articulos/:id`                               |
| Actualizar artículo                     | PUT    | `/api/articulos/:id`                               |
| Cambiar estado editorial                | PATCH  | `/api/articulos/:id/estado`                        |
| Establecer tiempo de lectura            | PATCH  | `/api/articulos/:id/tiempo-lectura`                |
| Incrementar tiempo de lectura           | PATCH  | `/api/articulos/:id/tiempo-lectura/incrementar`    |
| Ocultar artículo (lógica)               | DELETE | `/api/articulos/:id`                               |
| Eliminar artículo permanentemente       | DELETE | `/api/articulos/:id/permanente`                    |
| Obtener artículos más leídos            | GET    | `/api/articulos/mas-leidos`                        |

---

