-- CreateTable
CREATE TABLE "newsletter" (
    "newsletter_id" SERIAL NOT NULL,
    "titulo" TEXT NOT NULL,
    "descripcion" TEXT NOT NULL,
    "frecuencia" TEXT NOT NULL,

    CONSTRAINT "newsletter_pkey" PRIMARY KEY ("newsletter_id")
);

-- CreateTable
CREATE TABLE "suscriptor" (
    "suscriptor_id" SERIAL NOT NULL,
    "email" TEXT NOT NULL,
    "fechaSuscripcion" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "suscriptor_pkey" PRIMARY KEY ("suscriptor_id")
);

-- CreateTable
CREATE TABLE "_NewsletterToSuscriptor" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "newsletter_titulo_key" ON "newsletter"("titulo");

-- CreateIndex
CREATE UNIQUE INDEX "suscriptor_email_key" ON "suscriptor"("email");

-- CreateIndex
CREATE UNIQUE INDEX "_NewsletterToSuscriptor_AB_unique" ON "_NewsletterToSuscriptor"("A", "B");

-- CreateIndex
CREATE INDEX "_NewsletterToSuscriptor_B_index" ON "_NewsletterToSuscriptor"("B");

-- AddForeignKey
ALTER TABLE "_NewsletterToSuscriptor" ADD CONSTRAINT "_NewsletterToSuscriptor_A_fkey" FOREIGN KEY ("A") REFERENCES "newsletter"("newsletter_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_NewsletterToSuscriptor" ADD CONSTRAINT "_NewsletterToSuscriptor_B_fkey" FOREIGN KEY ("B") REFERENCES "suscriptor"("suscriptor_id") ON DELETE CASCADE ON UPDATE CASCADE;
