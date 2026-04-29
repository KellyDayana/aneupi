/*
  Warnings:

  - You are about to drop the column `dislikes` on the `noticia` table. All the data in the column will be lost.
  - You are about to drop the column `likes` on the `noticia` table. All the data in the column will be lost.

*/
-- CreateEnum
CREATE TYPE "TipoReaccion" AS ENUM ('LIKE', 'DISLIKE', 'CORAZON', 'RISA', 'APLAUSO');

-- CreateEnum
CREATE TYPE "EstadoNoticia" AS ENUM ('PENDIENTE_APROBACION', 'APROBADO', 'PUBLICADO', 'OCULTO', 'PROGRAMADO', 'RECHAZADO');

-- CreateEnum
CREATE TYPE "EstadoComentario" AS ENUM ('VISIBLE', 'OCULTO');

-- DropForeignKey
ALTER TABLE "comentario_noticia" DROP CONSTRAINT "comentario_noticia_noticia_id_fkey";

-- AlterTable
ALTER TABLE "comentario_noticia" ADD COLUMN     "estado" "EstadoComentario" NOT NULL DEFAULT 'VISIBLE';

-- AlterTable
ALTER TABLE "noticia" DROP COLUMN "dislikes",
DROP COLUMN "likes",
ADD COLUMN     "estado" "EstadoNoticia" NOT NULL DEFAULT 'PENDIENTE_APROBACION';

-- CreateTable
CREATE TABLE "articulo" (
    "articulo_id" SERIAL NOT NULL,
    "titulo" TEXT NOT NULL,
    "descripcion" TEXT NOT NULL,
    "contenido" TEXT NOT NULL,
    "url_imagen" TEXT NOT NULL,
    "url_preview_imagen" TEXT NOT NULL,
    "tiempo_lectura" INTEGER NOT NULL,
    "estado" "EstadoNoticia" NOT NULL DEFAULT 'PENDIENTE_APROBACION',
    "vistas" INTEGER NOT NULL DEFAULT 0,
    "fecha_publicacion" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "autor_id" INTEGER NOT NULL,
    "categoria_id" INTEGER NOT NULL,

    CONSTRAINT "articulo_pkey" PRIMARY KEY ("articulo_id")
);

-- CreateTable
CREATE TABLE "tv_video" (
    "video_id" SERIAL NOT NULL,
    "titulo" TEXT NOT NULL,
    "descripcion" TEXT NOT NULL,
    "url_video" TEXT NOT NULL,
    "url_thumbnail" TEXT NOT NULL,
    "duracion_segundos" INTEGER NOT NULL,
    "vistas" INTEGER NOT NULL DEFAULT 0,
    "likes" INTEGER NOT NULL DEFAULT 0,
    "dislikes" INTEGER NOT NULL DEFAULT 0,
    "en_vivo" BOOLEAN NOT NULL DEFAULT false,
    "fecha_publicacion" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "programa_id" INTEGER NOT NULL,
    "categoria_id" INTEGER NOT NULL,

    CONSTRAINT "tv_video_pkey" PRIMARY KEY ("video_id")
);

-- CreateTable
CREATE TABLE "programa" (
    "programa_id" SERIAL NOT NULL,
    "nombre" TEXT NOT NULL,
    "descripcion" TEXT NOT NULL,
    "frecuencia" TEXT NOT NULL,
    "presentador_id" INTEGER NOT NULL,

    CONSTRAINT "programa_pkey" PRIMARY KEY ("programa_id")
);

-- CreateTable
CREATE TABLE "programacion_item" (
    "id" SERIAL NOT NULL,
    "titulo" TEXT NOT NULL,
    "descripcion" TEXT NOT NULL,
    "fecha_hora_inicio" TIMESTAMP(3) NOT NULL,
    "programa_id" INTEGER NOT NULL,

    CONSTRAINT "programacion_item_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "comentario_articulo" (
    "comentario_id" SERIAL NOT NULL,
    "mensaje" TEXT NOT NULL,
    "estado" "EstadoComentario" NOT NULL DEFAULT 'VISIBLE',
    "fecha_hora" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "usuario_id" INTEGER NOT NULL,
    "articulo_id" INTEGER NOT NULL,
    "respuesta_a_id" INTEGER,

    CONSTRAINT "comentario_articulo_pkey" PRIMARY KEY ("comentario_id")
);

-- CreateTable
CREATE TABLE "comentario_video" (
    "comentario_id" SERIAL NOT NULL,
    "mensaje" TEXT NOT NULL,
    "fecha_hora" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "usuario_id" INTEGER NOT NULL,
    "video_id" INTEGER NOT NULL,
    "respuesta_a_id" INTEGER,

    CONSTRAINT "comentario_video_pkey" PRIMARY KEY ("comentario_id")
);

-- CreateTable
CREATE TABLE "solicitud_entrevista" (
    "solicitud_id" SERIAL NOT NULL,
    "nombre_completo" TEXT NOT NULL,
    "profesion" TEXT,
    "cedula_identificacion" TEXT,
    "email" TEXT NOT NULL,
    "telefono_contacto" TEXT NOT NULL,
    "tema_titulo" TEXT NOT NULL,
    "descripcion_proposito" TEXT NOT NULL,
    "tipo_entrevista" TEXT NOT NULL,
    "estado" TEXT NOT NULL,
    "fecha_solicitud" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "usuario_id" INTEGER,

    CONSTRAINT "solicitud_entrevista_pkey" PRIMARY KEY ("solicitud_id")
);

-- CreateTable
CREATE TABLE "reaccion_contenido" (
    "reaccion_id" SERIAL NOT NULL,
    "tipo_reaccion" "TipoReaccion" NOT NULL,
    "usuario_id" INTEGER NOT NULL,
    "fecha_creacion" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "noticia_id" INTEGER,
    "articulo_id" INTEGER,
    "comentario_noticia_id" INTEGER,
    "comentario_articulo_id" INTEGER,

    CONSTRAINT "reaccion_contenido_pkey" PRIMARY KEY ("reaccion_id")
);

-- CreateIndex
CREATE UNIQUE INDEX "reaccion_contenido_usuario_id_noticia_id_key" ON "reaccion_contenido"("usuario_id", "noticia_id");

-- CreateIndex
CREATE UNIQUE INDEX "reaccion_contenido_usuario_id_articulo_id_key" ON "reaccion_contenido"("usuario_id", "articulo_id");

-- CreateIndex
CREATE UNIQUE INDEX "reaccion_contenido_usuario_id_comentario_noticia_id_key" ON "reaccion_contenido"("usuario_id", "comentario_noticia_id");

-- CreateIndex
CREATE UNIQUE INDEX "reaccion_contenido_usuario_id_comentario_articulo_id_key" ON "reaccion_contenido"("usuario_id", "comentario_articulo_id");

-- AddForeignKey
ALTER TABLE "articulo" ADD CONSTRAINT "articulo_autor_id_fkey" FOREIGN KEY ("autor_id") REFERENCES "usuario"("usuario_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "articulo" ADD CONSTRAINT "articulo_categoria_id_fkey" FOREIGN KEY ("categoria_id") REFERENCES "categoria"("categoria_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tv_video" ADD CONSTRAINT "tv_video_programa_id_fkey" FOREIGN KEY ("programa_id") REFERENCES "programa"("programa_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tv_video" ADD CONSTRAINT "tv_video_categoria_id_fkey" FOREIGN KEY ("categoria_id") REFERENCES "categoria"("categoria_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "programa" ADD CONSTRAINT "programa_presentador_id_fkey" FOREIGN KEY ("presentador_id") REFERENCES "usuario"("usuario_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "programacion_item" ADD CONSTRAINT "programacion_item_programa_id_fkey" FOREIGN KEY ("programa_id") REFERENCES "programa"("programa_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "comentario_noticia" ADD CONSTRAINT "comentario_noticia_noticia_id_fkey" FOREIGN KEY ("noticia_id") REFERENCES "noticia"("noticia_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "comentario_articulo" ADD CONSTRAINT "comentario_articulo_usuario_id_fkey" FOREIGN KEY ("usuario_id") REFERENCES "usuario"("usuario_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "comentario_articulo" ADD CONSTRAINT "comentario_articulo_articulo_id_fkey" FOREIGN KEY ("articulo_id") REFERENCES "articulo"("articulo_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "comentario_articulo" ADD CONSTRAINT "comentario_articulo_respuesta_a_id_fkey" FOREIGN KEY ("respuesta_a_id") REFERENCES "comentario_articulo"("comentario_id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "comentario_video" ADD CONSTRAINT "comentario_video_usuario_id_fkey" FOREIGN KEY ("usuario_id") REFERENCES "usuario"("usuario_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "comentario_video" ADD CONSTRAINT "comentario_video_video_id_fkey" FOREIGN KEY ("video_id") REFERENCES "tv_video"("video_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "comentario_video" ADD CONSTRAINT "comentario_video_respuesta_a_id_fkey" FOREIGN KEY ("respuesta_a_id") REFERENCES "comentario_video"("comentario_id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "solicitud_entrevista" ADD CONSTRAINT "solicitud_entrevista_usuario_id_fkey" FOREIGN KEY ("usuario_id") REFERENCES "usuario"("usuario_id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "reaccion_contenido" ADD CONSTRAINT "reaccion_contenido_usuario_id_fkey" FOREIGN KEY ("usuario_id") REFERENCES "usuario"("usuario_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "reaccion_contenido" ADD CONSTRAINT "reaccion_contenido_noticia_id_fkey" FOREIGN KEY ("noticia_id") REFERENCES "noticia"("noticia_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "reaccion_contenido" ADD CONSTRAINT "reaccion_contenido_articulo_id_fkey" FOREIGN KEY ("articulo_id") REFERENCES "articulo"("articulo_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "reaccion_contenido" ADD CONSTRAINT "reaccion_contenido_comentario_noticia_id_fkey" FOREIGN KEY ("comentario_noticia_id") REFERENCES "comentario_noticia"("comentario_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "reaccion_contenido" ADD CONSTRAINT "reaccion_contenido_comentario_articulo_id_fkey" FOREIGN KEY ("comentario_articulo_id") REFERENCES "comentario_articulo"("comentario_id") ON DELETE CASCADE ON UPDATE CASCADE;
