import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const categorias = [
    'Tecnología',
    'Medio Ambiente',
    'Educación',
    'Gastronomía',
    'Negocios',
    'Arte y Cultura',
    'Ciencia',
    'Salud',
    'Deportes',
    'Opinión',
  ];

  console.log('Creando categorías...');

  for (const nombre of categorias) {
    const existente = await prisma.categoria.findUnique({ where: { nombre } });
    if (!existente) {
      const nueva = await prisma.categoria.create({ data: { nombre } });
      console.log(`✅ Creada: ${nueva.nombre} (ID: ${nueva.categoriaId})`);
    } else {
      console.log(`⏭️  Ya existe: ${existente.nombre} (ID: ${existente.categoriaId})`);
    }
  }

  // Mostrar todas las categorías al final
  const todas = await prisma.categoria.findMany({ orderBy: { categoriaId: 'asc' } });
  console.log('\n📋 Categorías en la BD:');
  todas.forEach(c => console.log(`  ID ${c.categoriaId}: ${c.nombre}`));

  await prisma.$disconnect();
}

main().catch(e => { console.error(e); process.exit(1); });
