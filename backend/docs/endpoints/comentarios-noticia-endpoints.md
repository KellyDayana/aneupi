#  Documentación de Endpoints - Comentarios de Noticias

##  Estados de Comentario

```typescript
enum EstadoComentario {
  VISIBLE  // Comentario visible para todos
  OCULTO   // Comentario oculto (eliminación lógica)
}
```

---

##  Endpoints Disponibles

### 1. **Crear Comentario en una Noticia**
```http
POST /api/noticias/:noticia_id/comentarios
```

**Body:**
```json
{
  "mensaje": "Este es mi comentario sobre la noticia",
  "usuario_id": 1,
  "respuesta_a_id": null  // Opcional: ID del comentario al que responde
}
```

**Validaciones:**
- Mensaje requerido (mínimo 3 caracteres, máximo 2000)
- La noticia debe existir
- Si es una respuesta, el comentario padre debe existir y pertenecer a la misma noticia

**Respuesta exitosa (201):**
```json
{
  "success": true,
  "data": {
    "comentario_id": 1,
    "mensaje": "Este es mi comentario sobre la noticia",
    "estado": "VISIBLE",
    "fecha_hora": "2025-11-10T20:00:00.000Z",
    "usuario_id": 1,
    "noticia_id": 1,
    "respuesta_a_id": null,
    "usuario": {
      "usuario_id": 1,
      "nombre_completo": "Juan Pérez",
      "email": "juan@example.com"
    },
    "respuesta_a": null
  },
  "message": "Comentario creado exitosamente"
}
```

**Ejemplo de respuesta a un comentario:**
```json
{
  "mensaje": "Estoy de acuerdo con tu punto de vista",
  "usuario_id": 2,
  "respuesta_a_id": 1  // ID del comentario al que responde
}
```

---

### 2. **Obtener Comentarios de una Noticia**
```http
GET /api/noticias/:noticia_id/comentarios
```

**Query Parameters:**
- `incluir_ocultos` (opcional): `true` para incluir comentarios ocultos (solo para admins)

**Ejemplos:**
```http
# Obtener solo comentarios visibles
GET /api/noticias/1/comentarios

# Obtener todos los comentarios incluyendo ocultos (panel admin)
GET /api/noticias/1/comentarios?incluir_ocultos=true
```

**Respuesta exitosa (200):**
```json
{
  "success": true,
  "data": [
    {
      "comentario_id": 1,
      "mensaje": "Excelente artículo!",
      "estado": "VISIBLE",
      "fecha_hora": "2025-11-10T20:00:00.000Z",
      "usuario_id": 1,
      "noticia_id": 1,
      "respuesta_a_id": null,
      "usuario": {
        "usuario_id": 1,
        "nombre_completo": "Juan Pérez"
      },
      "respuestas": [
        {
          "comentario_id": 2,
          "mensaje": "Totalmente de acuerdo",
          "estado": "VISIBLE",
          "fecha_hora": "2025-11-10T20:05:00.000Z",
          "usuario_id": 2,
          "noticia_id": 1,
          "respuesta_a_id": 1,
          "usuario": {
            "usuario_id": 2,
            "nombre_completo": "María López"
          }
        }
      ]
    },
    {
      "comentario_id": 3,
      "mensaje": "Otro comentario de nivel superior",
      "estado": "VISIBLE",
      "fecha_hora": "2025-11-10T20:10:00.000Z",
      "usuario_id": 3,
      "noticia_id": 1,
      "respuesta_a_id": null,
      "usuario": {
        "usuario_id": 3,
        "nombre_completo": "Carlos García"
      },
      "respuestas": []
    }
  ],
  "count": 2
}
```

> **Nota:** Solo se muestran comentarios de nivel superior (sin `respuesta_a_id`). Las respuestas vienen anidadas en el campo `respuestas`.

---

### 3. **Obtener un Comentario Específico**
```http
GET /api/noticias/:noticia_id/comentarios/:comentario_id
```

**Ejemplo:**
```http
GET /api/noticias/1/comentarios/1
```

**Respuesta exitosa (200):**
```json
{
  "success": true,
  "data": {
    "comentario_id": 1,
    "mensaje": "Excelente artículo!",
    "estado": "VISIBLE",
    "fecha_hora": "2025-11-10T20:00:00.000Z",
    "usuario_id": 1,
    "noticia_id": 1,
    "respuesta_a_id": null,
    "usuario": {
      "usuario_id": 1,
      "nombre_completo": "Juan Pérez",
      "email": "juan@example.com"
    },
    "respuesta_a": null,
    "respuestas": [
      {
        "comentario_id": 2,
        "mensaje": "Totalmente de acuerdo",
        "estado": "VISIBLE",
        "fecha_hora": "2025-11-10T20:05:00.000Z",
        "usuario": {
          "usuario_id": 2,
          "nombre_completo": "María López"
        }
      }
    ]
  }
}
```

---

### 4. **Actualizar Comentario**
```http
PUT /api/noticias/:noticia_id/comentarios/:comentario_id
```

**Body (todos los campos opcionales):**
```json
{
  "mensaje": "Mensaje actualizado",
  "estado": "VISIBLE"  // También se puede cambiar el estado aquí
}
```

**Respuesta exitosa (200):**
```json
{
  "success": true,
  "data": {
    "comentario_id": 1,
    "mensaje": "Mensaje actualizado",
    "estado": "VISIBLE",
    "fecha_hora": "2025-11-10T20:00:00.000Z",
    "usuario_id": 1,
    "noticia_id": 1,
    "respuesta_a_id": null,
    "usuario": {
      "usuario_id": 1,
      "nombre_completo": "Juan Pérez"
    }
  },
  "message": "Comentario actualizado exitosamente"
}
```

---

### 5. **Cambiar Estado del Comentario** ⭐
```http
PATCH /api/noticias/:noticia_id/comentarios/:comentario_id/estado
```

**Body:**
```json
{
  "estado": "OCULTO"
}
```

**Valores válidos:**
- `VISIBLE`
- `OCULTO`

**Respuesta exitosa (200):**
```json
{
  "success": true,
  "data": {
    "comentario_id": 1,
    "mensaje": "...",
    "estado": "OCULTO",
    // ... resto de campos
  },
  "message": "Estado del comentario actualizado exitosamente"
}
```

**Uso común:**
```bash
# Ocultar un comentario inapropiado
PATCH /api/noticias/1/comentarios/5/estado
Body: { "estado": "OCULTO" }

# Restaurar un comentario oculto
PATCH /api/noticias/1/comentarios/5/estado
Body: { "estado": "VISIBLE" }
```

---

### 6. **Ocultar Comentario (Eliminación Lógica)** ⭐ RECOMENDADO
```http
DELETE /api/noticias/:noticia_id/comentarios/:comentario_id
```

**Ejemplo:**
```http
DELETE /api/noticias/1/comentarios/5
```

**Respuesta exitosa (200):**
```json
{
  "success": true,
  "data": {
    "comentario_id": 5,
    "mensaje": "...",
    "estado": "OCULTO",
    // ... resto de campos
  },
  "message": "Comentario ocultado exitosamente"
}
```

> **Nota:** Este es el método recomendado para "eliminar" comentarios. Cambia el estado a `OCULTO` sin borrar los datos.

---

### 7. **Eliminar Comentario Permanentemente** ⚠️
```http
DELETE /api/noticias/:noticia_id/comentarios/:comentario_id/permanente
```

**Ejemplo:**
```http
DELETE /api/noticias/1/comentarios/5/permanente
```

**Respuesta exitosa (200):**
```json
{
  "success": true,
  "message": "Comentario eliminado permanentemente"
}
```

> **⚠️ ADVERTENCIA:** Esta operación es irreversible. El comentario y todas sus respuestas se eliminan permanentemente de la base de datos. Solo usar en casos extremos y con permisos de administrador.

---

### 8. **Contar Comentarios Visibles de una Noticia**
```http
GET /api/noticias/:noticia_id/comentarios/count
```

**Ejemplo:**
```http
GET /api/noticias/1/comentarios/count
```

**Respuesta exitosa (200):**
```json
{
  "success": true,
  "data": {
    "count": 15
  }
}
```

> **Nota:** Solo cuenta comentarios con estado `VISIBLE`.

---

##  Casos de Uso Comunes

### 1. Sistema de Comentarios Anidados

```bash
# 1. Usuario comenta la noticia
POST /api/noticias/1/comentarios
Body: {
  "mensaje": "Gran artículo!",
  "usuario_id": 1
}
# Respuesta: { comentario_id: 10, ... }

# 2. Otro usuario responde al comentario
POST /api/noticias/1/comentarios
Body: {
  "mensaje": "Estoy de acuerdo",
  "usuario_id": 2,
  "respuesta_a_id": 10  // Responde al comentario 10
}

# 3. Obtener todos los comentarios con respuestas
GET /api/noticias/1/comentarios
```

### 2. Moderación de Comentarios

```bash
# 1. Usuario reporta un comentario inapropiado

# 2. Moderador revisa y oculta el comentario
DELETE /api/noticias/1/comentarios/5
# O explícitamente:
PATCH /api/noticias/1/comentarios/5/estado
Body: { "estado": "OCULTO" }

# 3. Si fue un error, restaurar el comentario
PATCH /api/noticias/1/comentarios/5/estado
Body: { "estado": "VISIBLE" }

# 4. Panel de admin: ver todos los comentarios incluyendo ocultos
GET /api/noticias/1/comentarios?incluir_ocultos=true
```

### 3. Edición de Comentarios

```bash
# Usuario edita su comentario
PUT /api/noticias/1/comentarios/10
Body: {
  "mensaje": "Gran artículo! (editado para aclarar mi punto)"
}
```

### 4. Mostrar Contador en el Frontend

```bash
# En la lista de noticias, mostrar cuántos comentarios tiene cada una
GET /api/noticias/1/comentarios/count
# Usar este número junto a un ícono de comentario
```

---

##  Estructura de Datos

### Comentario de Nivel Superior
```typescript
{
  comentario_id: number;
  mensaje: string;
  estado: "VISIBLE" | "OCULTO";
  fecha_hora: Date;
  usuario_id: number;
  noticia_id: number;
  respuesta_a_id: null;  // Es null para comentarios principales
  usuario: {
    usuario_id: number;
    nombre_completo: string;
  };
  respuestas: Comentario[];  // Array de respuestas
}
```

### Comentario de Respuesta
```typescript
{
  comentario_id: number;
  mensaje: string;
  estado: "VISIBLE" | "OCULTO";
  fecha_hora: Date;
  usuario_id: number;
  noticia_id: number;
  respuesta_a_id: number;  // ID del comentario padre
  usuario: {
    usuario_id: number;
    nombre_completo: string;
  };
  respuestas: [];  // Las respuestas no tienen sub-respuestas (un nivel)
}
```

---

##  Notas Importantes

1. **Eliminación Lógica vs Física:**
   - `DELETE /comentarios/:id` → Oculta el comentario (RECOMENDADO)
   - `DELETE /comentarios/:id/permanente` → Elimina permanentemente (PELIGROSO)

2. **Cascada en Eliminación Física:**
   - Al eliminar físicamente un comentario, todas sus respuestas también se eliminan
   - Al eliminar una noticia, todos sus comentarios se eliminan automáticamente

3. **Comentarios Anidados:**
   - El sistema soporta un nivel de anidación (comentario → respuestas)
   - No hay sub-respuestas de respuestas (para mantener simplicidad)

4. **Filtrado por Estado:**
   - Por defecto, solo se muestran comentarios con estado `VISIBLE`
   - Usar `incluir_ocultos=true` solo en paneles de administración

5. **Validaciones:**
   - Mensaje mínimo: 3 caracteres
   - Mensaje máximo: 2000 caracteres
   - No se permiten mensajes vacíos

6. **Ordenamiento:**
   - Comentarios principales: Por fecha descendente (más recientes primero)
   - Respuestas: Por fecha ascendente (más antiguas primero, para mantener hilo de conversación)

---

## 🔗 Integración con Otros Módulos

### Con Noticias
```bash
# Al obtener una noticia, los comentarios vienen incluidos
GET /api/noticias/1
# Respuesta incluye campo "comentarios" con todos los comentarios visibles
```

### Con Reacciones
```bash
# Los comentarios también pueden recibir reacciones
POST /api/reacciones
Body: {
  "usuario_id": 1,
  "tipo_entidad": "COMENTARIO",
  "entidad_id": 10,  // ID del comentario
  "tipo_reaccion": "LIKE"
}
```

---

