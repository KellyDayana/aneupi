/*import React from 'react'
import Link from 'next/link'

type Props = {
  params: { slug: string }
}

async function fetchArticle(slug: string) {
  // Ajusta esta función a tu fuente de datos (CMS, API interna, filesystem, etc.).
  // Ejemplo: llamada a una API REST interna configurada en `NEXT_PUBLIC_API_URL`.
  try {
    const base = process.env.NEXT_PUBLIC_API_URL ?? ''
    if (!base) return null
    const res = await fetch(`${base}/articles/${encodeURIComponent(slug)}`, { cache: 'no-store' })
    if (!res.ok) return null
    return res.json()
  } catch (e) {
    return null
  }
}

export async function generateMetadata({ params }: Props) {
  const article = await fetchArticle(params.slug)
  return {
    title: article?.title ?? 'Artículo',
    description: article?.description ?? undefined,
  }
}

export default async function ArticlePage({ params }: Props) {
  const { slug } = params
  const article = await fetchArticle(slug)

  if (!article) {
    return (
      <main className="container mx-auto py-12">
        <p className="text-center">Artículo no encontrado.</p>
        <div className="mt-6 text-center">
          <Link href="/articulos" className="text-primary">← Volver a artículos</Link>
        </div>
      </main>
    )
  }

  return (
    <main className="container mx-auto py-8">
      <article className="prose max-w-none">
        <h1>{article.title}</h1>
        {article.subtitle && <p className="text-muted">{article.subtitle}</p>}
        {article.image && (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={article.image} alt={article.title} className="w-full rounded-md my-4" />
        )}
        <div dangerouslySetInnerHTML={{ __html: article.content }} />
      </article>

      <div className="mt-8">
        <Link href="/articulos" className="text-primary">← Volver a artículos</Link>
      </div>
    </main>
  )
}
*/