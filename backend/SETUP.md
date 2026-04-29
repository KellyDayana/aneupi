# GUIA DE INSTALACIÓN

### 1.  Configurar Variables de Entorno

Configurar variables de entorno se debe crear un archivo .env en la raiz del proyecto.

Puede ver un ejemplo en .example.env

| Es importante SIEMPRE ocultar y no compartir las variables de entorno, especialmente en produccion.


### 2.  Crear la Base de Datos

```sql
-- Abre pgAdmin o psql y ejecuta:
CREATE DATABASE aneupi_tv;
```

### 3. Generar Cliente de Prisma

⚠️ **IMPORTANTE**: Cierra TODOS los terminales antes de ejecutar esto

```powershell
npx prisma generate
```

### 4. Aplicar Migraciones

```powershell
npx prisma migrate dev --name init
```

Esto creará las 4 tablas en tu base de datos.

### 5. Poblar con Datos de Prueba

```powershell
npx prisma db seed
```

Esto creará:
- 6 categorías
- 4 usuarios
- 6 noticias
- 5 comentarios

### 6. Iniciar el Servidor

```powershell
npm run dev
```

###  Probar la API

```powershell
# Desde otro terminal
curl GET http://localhost:3000/health
curl GET http://localhost:3000/api/noticias
```




##  Herramientas Útiles

### Prisma Studio

Ruta que permite visualizar la información de la base de datos
```powershell
npx prisma studio
```