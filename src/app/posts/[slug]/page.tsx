import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  formatViews,
  getPostBySlug,
  incrementPostViews,
} from "@/lib/post-store";

export const dynamic = "force-dynamic";

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
  const post = await incrementPostViews(slug);

  if (!post) {
    notFound();
  }

  return (
    <main className="bg-stone-50 text-stone-950">
      <header className="sticky top-0 z-30 border-b border-stone-200 bg-white/90 backdrop-blur">
        <nav className="mx-auto flex max-w-5xl flex-wrap items-center justify-between gap-3 px-4 py-3 sm:px-5 sm:py-4">
          <Link href="/" className="text-base font-semibold sm:text-lg">
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

      <article className="mx-auto max-w-5xl px-4 py-8 sm:px-5 sm:py-10">
        <Link href="/" className="text-sm font-semibold text-emerald-700">
          Kembali ke beranda
        </Link>

        <header className="mt-6 max-w-3xl sm:mt-8">
          <div className="flex flex-wrap items-center gap-2 text-sm text-stone-500 sm:gap-3">
            <span className="rounded-[8px] bg-emerald-50 px-3 py-1 font-medium text-emerald-800">
              {post.category}
            </span>
            <span>{post.publishedAt}</span>
            <span>{post.readTime}</span>
            <span>{formatViews(post.views ?? 0)} views</span>
          </div>
          <h1 className="mt-5 text-3xl font-semibold leading-tight sm:text-5xl lg:text-6xl">
            {post.title}
          </h1>
          <p className="mt-4 text-base leading-7 text-stone-600 sm:mt-5 sm:text-lg sm:leading-8">
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

        <div className="relative mt-8 aspect-[4/3] overflow-hidden rounded-[8px] bg-stone-200 sm:mt-10 sm:aspect-[16/9] lg:aspect-[16/8]">
          <Image
            src={post.cover}
            alt=""
            fill
            priority
            className="object-cover"
            sizes="(min-width: 1024px) 1024px, 100vw"
          />
        </div>

        <div className="mt-8 grid min-w-0 gap-8 sm:mt-10 lg:grid-cols-[minmax(0,680px)_1fr]">
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
              <div className="flex flex-wrap justify-between gap-2">
                <dt className="text-stone-500">Kategori</dt>
                <dd className="font-medium break-words text-right">{post.category}</dd>
              </div>
              <div className="flex flex-wrap justify-between gap-2">
                <dt className="text-stone-500">Waktu baca</dt>
                <dd className="font-medium break-words text-right">{post.readTime}</dd>
              </div>
              <div className="flex flex-wrap justify-between gap-2">
                <dt className="text-stone-500">Tanggal</dt>
                <dd className="font-medium break-words text-right">{post.publishedAt}</dd>
              </div>
              <div className="flex flex-wrap justify-between gap-2">
                <dt className="text-stone-500">Views</dt>
                <dd className="font-medium break-words text-right">
                  {formatViews(post.views ?? 0)}
                </dd>
              </div>
            </dl>
          </aside>
        </div>
      </article>
    </main>
  );
}
