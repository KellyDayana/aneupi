/*
  Warnings:

  - You are about to drop the `Post` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `User` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Post" DROP CONSTRAINT "Post_authorId_fkey";

-- DropTable
DROP TABLE "Post";

-- DropTable
DROP TABLE "User";

-- CreateTable
CREATE TABLE "usuario" (
    "usuario_id" SERIAL NOT NULL,
    "nombre_completo" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "contrasena_hash" TEXT NOT NULL,
    "rol" TEXT NOT NULL,
    "fecha_registro" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "usuario_pkey" PRIMARY KEY ("usuario_id")
);

-- CreateTable
CREATE TABLE "categoria" (
    "categoria_id" SERIAL NOT NULL,
    "nombre" TEXT NOT NULL,

    CONSTRAINT "categoria_pkey" PRIMARY KEY ("categoria_id")
);

-- CreateTable
CREATE TABLE "noticia" (
    "noticia_id" SERIAL NOT NULL,
    "titulo" TEXT NOT NULL,
    "extracto" TEXT NOT NULL,
    "contenido_noticia" TEXT NOT NULL,
    "url_imagen" TEXT NOT NULL,
    "url_preview_imagen" TEXT NOT NULL,
    "vistas" INTEGER NOT NULL DEFAULT 0,
    "likes" INTEGER NOT NULL DEFAULT 0,
    "dislikes" INTEGER NOT NULL DEFAULT 0,
    "fecha_publicacion" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "autor_id" INTEGER NOT NULL,
    "categoria_id" INTEGER NOT NULL,

    CONSTRAINT "noticia_pkey" PRIMARY KEY ("noticia_id")
);

-- CreateTable
CREATE TABLE "comentario_noticia" (
    "comentario_id" SERIAL NOT NULL,
    "mensaje" TEXT NOT NULL,
    "fecha_hora" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "usuario_id" INTEGER NOT NULL,
    "noticia_id" INTEGER NOT NULL,
    "respuesta_a_id" INTEGER,

    CONSTRAINT "comentario_noticia_pkey" PRIMARY KEY ("comentario_id")
);

-- CreateIndex
CREATE UNIQUE INDEX "usuario_email_key" ON "usuario"("email");

-- CreateIndex
CREATE UNIQUE INDEX "categoria_nombre_key" ON "categoria"("nombre");

-- AddForeignKey
ALTER TABLE "noticia" ADD CONSTRAINT "noticia_autor_id_fkey" FOREIGN KEY ("autor_id") REFERENCES "usuario"("usuario_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "noticia" ADD CONSTRAINT "noticia_categoria_id_fkey" FOREIGN KEY ("categoria_id") REFERENCES "categoria"("categoria_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "comentario_noticia" ADD CONSTRAINT "comentario_noticia_usuario_id_fkey" FOREIGN KEY ("usuario_id") REFERENCES "usuario"("usuario_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "comentario_noticia" ADD CONSTRAINT "comentario_noticia_noticia_id_fkey" FOREIGN KEY ("noticia_id") REFERENCES "noticia"("noticia_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "comentario_noticia" ADD CONSTRAINT "comentario_noticia_respuesta_a_id_fkey" FOREIGN KEY ("respuesta_a_id") REFERENCES "comentario_noticia"("comentario_id") ON DELETE SET NULL ON UPDATE CASCADE;
