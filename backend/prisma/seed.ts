import { PrismaClient, EstadoNoticia, EstadoComentario, TipoReaccion } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Iniciando seed de la base de datos...');

  // --- 1. LIMPIEZA EN ORDEN CORRECTO ---
  console.log('🧹 Limpiando datos existentes...');
  // Borramos en orden inverso para evitar conflictos de foreign key
  await prisma.reaccionContenido.deleteMany({});
  await prisma.comentarioArticulo.deleteMany({});
  await prisma.comentarioNoticia.deleteMany({});
  await prisma.comentarioVideo.deleteMany({});
  await prisma.solicitudEntrevista.deleteMany({});

  await prisma.articulo.deleteMany({});
  await prisma.noticia.deleteMany({});

  await prisma.tvVideo.deleteMany({});
  await prisma.programacionItem.deleteMany({});
  await prisma.programa.deleteMany({});

  await prisma.categoria.deleteMany({});
  await prisma.usuario.deleteMany({});

  // --- 2. CREACIÓN DE DATOS BASE ---

  console.log('📁 Creando categorías...');
  const categoriaNoticias = await prisma.categoria.create({ data: { nombre: 'Noticias Nacionales' } });
  const categoriaDeportes = await prisma.categoria.create({ data: { nombre: 'Deportes' } });
  console.log(`✅ ${await prisma.categoria.count()} categorías creadas`);

  console.log('👥 Creando usuarios...');
  const autor1 = await prisma.usuario.create({ data: { nombre_completo: 'Juan Pérez', email: 'juan.perez@example.com', contrasena_hash: 'hash_secreto_1', rol: 'reportero' } });
  const autor2 = await prisma.usuario.create({ data: { nombre_completo: 'Ana Gómez', email: 'ana.gomez@example.com', contrasena_hash: 'hash_secreto_2', rol: 'editor' } });
  console.log(`✅ ${await prisma.usuario.count()} usuarios creados`);

  console.log('📰 Creando noticias...');
  const noticia1 = await prisma.noticia.create({
    data: {
      titulo: "Inflación en Ecuador baja al 2.1%",
      extracto: "La economía ecuatoriana muestra señales de estabilización.",
      contenido_noticia: "Contenido completo de la noticia sobre la inflación...",
      url_imagen: "url/imagen.jpg",
      url_preview_imagen: "url/preview.jpg",
      estado: EstadoNoticia.PUBLICADO,
      // Usamos la sintaxis de 'connect' para las relaciones
      autor: { connect: { usuarioId: autor1.usuarioId } },
      categoria: { connect: { categoriaId: categoriaNoticias.categoriaId } }
    }
  });
  console.log(`✅ ${await prisma.noticia.count()} noticias creadas`);

  // --- 3. (Opcional) Crear Reacciones de Prueba ---
  console.log('👍 Creando reacciones de prueba...');
  await prisma.reaccionContenido.create({
    data: {
      usuarioId: autor2.usuarioId,
      noticiaId: noticia1.noticiaId,
      tipoReaccion: TipoReaccion.LIKE // Usamos el enum directamente
    }
  });
  console.log(`✅ ${await prisma.reaccionContenido.count()} reacciones creadas`);

}

main()
  .catch((e) => {
    console.error('❌ Error durante el seed:', e);
    process.exit(1);
  })
  .finally(async () => {
    console.log('🌱 Seed finalizado.');
    await prisma.$disconnect();
  });