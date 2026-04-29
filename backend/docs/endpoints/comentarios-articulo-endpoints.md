#  Documentación de Endpoints - Comentarios de Artículos

##  Estados de Comentario

```typescript
enum EstadoComentario {
  VISIBLE
  OCULTO
}
```

> Los comentarios de artículos reutilizan el enum `EstadoComentario` definido en Prisma.

---

##  Endpoints Disponibles

### 1. Crear comentario en un artículo
```http
POST /api/articulos/:articulo_id/comentarios
```

**Body:**
```json
{
  "mensaje": "Excelente artículo",
  "usuario_id": 8,
  "respuesta_a_id": null
}
```

**Validaciones clave:**
- `mensaje` requerido (3 - 2000 caracteres)
- El artículo debe existir
- Si `respuesta_a_id` se indica, el comentario padre debe pertenecer al mismo artículo

---

### 2. Obtener comentarios de un artículo
```http
GET /api/articulos/:articulo_id/comentarios
```

**Query opcional:** `incluir_ocultos=true` (solo panel administrativo).

**Respuesta (200):**
```json
{
  "success": true,
  "data": [
    {
      "comentario_id": 21,
      "mensaje": "Excelente artículo",
      "estado": "VISIBLE",
      "usuario": {
        "usuario_id": 8,
        "nombre_completo": "Ana Gómez"
      },
      "respuestas": [
        {
          "comentario_id": 22,
          "mensaje": "Totalmente de acuerdo",
          "estado": "VISIBLE"
        }
      ]
    }
  ],
  "count": 1
}
```

---

### 3. Obtener comentario de artículo por ID
```http
GET /api/articulos/:articulo_id/comentarios/:comentario_id
```

Retorna el comentario (incluye datos de usuario, respuesta padre y respuestas visibles).

---

### 4. Actualizar comentario
```http
PUT /api/articulos/:articulo_id/comentarios/:comentario_id
```

**Body (opcional):**
```json
{
  "mensaje": "Mensaje editado",
  "estado": "VISIBLE"
}
```

> Si se envía `mensaje`, debe respetar las mismas validaciones que al crear.

---

### 5. Cambiar estado del comentario
```http
PATCH /api/articulos/:articulo_id/comentarios/:comentario_id/estado
```

**Body:**
```json
{
  "estado": "OCULTO"
}
```

Se usa para flujos de moderación (ocultar/mostrar).

---

### 6. Ocultar comentario (eliminación lógica)
```http
DELETE /api/articulos/:articulo_id/comentarios/:comentario_id
```

Equivalente a `PATCH .../estado` con estado `OCULTO`.

---

### 7. Eliminar comentario permanentemente
```http
DELETE /api/articulos/:articulo_id/comentarios/:comentario_id/permanente
```

Elimina el registro definitivamente. También eliminará respuestas en cascada.

---

### 8. Contar comentarios visibles del artículo
```http
GET /api/articulos/:articulo_id/comentarios/count
```

Devuelve el total de comentarios con estado `VISIBLE`.

---

##  Resumen rápido

| Acción                                      | Método | Ruta                                                             |
|---------------------------------------------|--------|------------------------------------------------------------------|
| Crear comentario                            | POST   | `/api/articulos/:articulo_id/comentarios`                        |
| Listar comentarios                          | GET    | `/api/articulos/:articulo_id/comentarios`                        |
| Obtener comentario por ID                   | GET    | `/api/articulos/:articulo_id/comentarios/:comentario_id`         |
| Actualizar comentario                       | PUT    | `/api/articulos/:articulo_id/comentarios/:comentario_id`         |
| Cambiar estado                              | PATCH  | `/api/articulos/:articulo_id/comentarios/:comentario_id/estado`  |
| Ocultar comentario (lógica)                 | DELETE | `/api/articulos/:articulo_id/comentarios/:comentario_id`         |
| Eliminar comentario de forma permanente     | DELETE | `/api/articulos/:articulo_id/comentarios/:comentario_id/permanente` |
| Contar comentarios visibles                 | GET    | `/api/articulos/:articulo_id/comentarios/count`                  |

---
