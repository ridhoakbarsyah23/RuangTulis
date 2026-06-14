import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getPostBySlug, getPublishedPosts } from "@/lib/post-store";

export const dynamic = "force-dynamic";

export async function generateStaticParams() {
  const posts = await getPublishedPosts();
  return posts.map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = await getPostBySlug(slug);

  if (!post) {
    return {
      title: "Artikel tidak ditemukan",
    };
  }

  return {
    title: `${post.title} - RuangTulis`,
    description: post.excerpt,
  };
}

export default async function PostDetail({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = await getPostBySlug(slug);

  if (!post) {
    notFound();
  }

  return (
    <main className="min-h-screen bg-stone-50 text-stone-950">
      <header className="sticky top-0 z-30 border-b border-stone-200 bg-white/90 backdrop-blur">
        <nav className="mx-auto flex max-w-5xl items-center justify-between px-5 py-4">
          <Link href="/" className="text-lg font-semibold">
            RuangTulis
          </Link>
          <div className="flex items-center gap-2">
            <Link
              href="/"
              className="rounded-[8px] px-3 py-2 text-sm font-semibold text-stone-600 hover:bg-stone-100"
            >
              Explore
            </Link>
            <Link
              href="/dashboard"
              className="rounded-[8px] bg-stone-950 px-4 py-2 text-sm font-semibold text-white hover:bg-stone-800"
            >
              Dashboard
            </Link>
          </div>
        </nav>
      </header>

      <article className="mx-auto max-w-5xl px-5 py-10">
        <Link href="/" className="text-sm font-semibold text-emerald-700">
          Kembali ke beranda
        </Link>

        <header className="mt-8 max-w-3xl">
          <div className="flex flex-wrap items-center gap-3 text-sm text-stone-500">
            <span className="rounded-[8px] bg-emerald-50 px-3 py-1 font-medium text-emerald-800">
              {post.category}
            </span>
            <span>{post.publishedAt}</span>
            <span>{post.readTime}</span>
          </div>
          <h1 className="mt-5 text-4xl font-semibold leading-tight sm:text-6xl">
            {post.title}
          </h1>
          <p className="mt-5 text-lg leading-8 text-stone-600">
            {post.excerpt}
          </p>
          <div className="mt-6 flex items-center gap-3 border-t border-stone-200 pt-5 text-sm text-stone-500">
            <div className="flex size-10 items-center justify-center rounded-[8px] bg-stone-950 font-semibold text-white">
              {post.author.slice(0, 1).toUpperCase()}
            </div>
            <div>
              <div className="font-semibold text-stone-950">{post.author}</div>
              <div>Author</div>
            </div>
          </div>
        </header>

        <div className="relative mt-10 aspect-[16/8] min-h-[260px] overflow-hidden rounded-[8px] bg-stone-200">
          <Image
            src={post.cover}
            alt=""
            fill
            priority
            className="object-cover"
            sizes="(min-width: 1024px) 1024px, 100vw"
          />
        </div>

        <div className="mt-10 grid gap-8 lg:grid-cols-[minmax(0,680px)_1fr]">
          <div className="prose-blog">
            {post.content.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
          </div>
          <aside className="h-fit rounded-[8px] bg-white p-5 shadow-sm ring-1 ring-stone-200">
            <h2 className="text-sm font-semibold text-stone-950">
              Ringkasan artikel
            </h2>
            <dl className="mt-4 space-y-3 text-sm">
              <div className="flex justify-between gap-4">
                <dt className="text-stone-500">Kategori</dt>
                <dd className="font-medium">{post.category}</dd>
              </div>
              <div className="flex justify-between gap-4">
                <dt className="text-stone-500">Waktu baca</dt>
                <dd className="font-medium">{post.readTime}</dd>
              </div>
              <div className="flex justify-between gap-4">
                <dt className="text-stone-500">Tanggal</dt>
                <dd className="font-medium">{post.publishedAt}</dd>
              </div>
            </dl>
          </aside>
        </div>
      </article>
    </main>
  );
}
