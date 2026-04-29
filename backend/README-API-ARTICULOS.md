# API de Artículos - ANEUPI TV

## Base URL
http://localhost:4000

## Autenticación
Las rutas protegidas requieren token JWT en el header:
Authorization: Bearer <token>

## Login para obtener token
POST /api/auth/login
Body: { "email": "admin@aneupi.com", "password": "admin123" }

---

## ARTÍCULOS

### Listar todos los artículos
GET /api/articulos

### Filtros disponibles
GET /api/articulos?estado=PUBLICADO
GET /api/articulos?search=Ecuador
GET /api/articulos?categoria_id=3
GET /api/articulos?autor_id=3

### Ver artículo por ID
GET /api/articulos/:id

### Ver más leídos
GET /api/articulos/mas-leidos

### Crear artículo (requiere token admin)
POST /api/articulos
Body:
{
  "titulo": "string",
  "descripcion": "string",
  "contenido": "string",
  "url_imagen": "string",
  "url_preview_imagen": "string",
  "tiempo_lectura": number,
  "autorId": number,
  "categoriaId": number
}

### Editar artículo (requiere token admin)
PUT /api/articulos/:id
Body: (mismos campos, todos opcionales)

### Cambiar estado (requiere token admin)
PATCH /api/articulos/:id/estado
Body: { "estado": "PUBLICADO" | "APROBADO" | "PENDIENTE_APROBACION" | "RECHAZADO" }

### Eliminar artículo (requiere token admin)
DELETE /api/articulos/:id/permanente

---

## COMENTARIOS DE ARTÍCULOS

### Listar comentarios de un artículo
GET /api/articulos/:id/comentarios

### Contar comentarios
GET /api/articulos/:id/comentarios/count

### Ver comentario específico
GET /api/articulos/:articulo_id/comentarios/:comentario_id

### Crear comentario
POST /api/articulos/:id/comentarios
Body:
{
  "mensaje": "string",
  "usuarioId": number,
  "articuloId": number,
  "respuestaAId": number (opcional, para responder a otro comentario)
}

### Editar comentario
PUT /api/articulos/:articulo_id/comentarios/:comentario_id
Body: { "mensaje": "string" }

### Cambiar estado de comentario (requiere token admin)
PATCH /api/articulos/:articulo_id/comentarios/:comentario_id/estado
Body: { "estado": "VISIBLE" | "OCULTO" }

### Eliminar comentario
DELETE /api/articulos/:articulo_id/comentarios/:comentario_id

---

## Estados de artículos
- PENDIENTE_APROBACION
- APROBADO
- PUBLICADO
- RECHAZADO