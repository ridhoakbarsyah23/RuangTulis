import Image from "next/image";
import Link from "next/link";
import {
  formatViews,
  getFeaturedPost,
  getPublishedPosts,
  getTotalViews,
} from "@/lib/post-store";

export const dynamic = "force-dynamic";

export default async function Home() {
  const posts = await getPublishedPosts();
  const featuredPost = await getFeaturedPost();
  const otherPosts = posts.filter((post) => post.slug !== featuredPost?.slug);
  const categories = Array.from(new Set(posts.map((post) => post.category)));
  const totalViews = getTotalViews(posts);

  if (!featuredPost) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-stone-50 px-5 text-stone-950">
        <div className="max-w-lg text-center">
          <p className="text-sm font-semibold text-emerald-700">RuangTulis</p>
          <h1 className="mt-3 text-4xl font-semibold">
            Belum ada artikel yang dipublish.
          </h1>
          <p className="mt-4 leading-7 text-stone-600">
            Masuk ke dashboard untuk menulis dan menerbitkan artikel pertama.
          </p>
          <Link
            href="/dashboard"
            className="mt-6 inline-flex rounded-[8px] bg-stone-950 px-5 py-3 text-sm font-semibold text-white hover:bg-stone-800"
          >
            Buka Dashboard
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-stone-50 text-stone-950">
      <header className="sticky top-0 z-30 border-b border-stone-200 bg-white/90 backdrop-blur">
        <nav className="mx-auto flex max-w-6xl items-center justify-between px-5 py-4">
          <Link href="/" className="text-xl font-semibold">
            RuangTulis
          </Link>
          <div className="flex items-center gap-2 text-sm font-medium text-stone-600">
            <Link className="rounded-[8px] px-3 py-2 hover:bg-stone-100" href="/">
              Explore
            </Link>
            <Link
              className="rounded-[8px] bg-stone-950 px-4 py-2 text-white hover:bg-stone-800"
              href="/dashboard"
            >
              Dashboard
            </Link>
          </div>
        </nav>
      </header>

      <section className="mx-auto max-w-6xl px-5 py-10 lg:py-14">
        <div className="mb-8 max-w-3xl">
          <p className="text-sm font-semibold text-emerald-700">
            Independent publishing space
          </p>
          <h1 className="mt-3 text-4xl font-semibold leading-tight sm:text-5xl">
            Artikel pilihan, catatan praktis, dan ide yang siap dibaca.
          </h1>
          <p className="mt-4 max-w-2xl text-lg leading-8 text-stone-600">
            RuangTulis menyajikan tulisan terbaru dengan pengalaman baca yang
            bersih, cepat, dan nyaman di semua ukuran layar.
          </p>
        </div>

        <div className="grid gap-6 lg:grid-cols-[1.25fr_0.75fr]">
          <article className="overflow-hidden rounded-[8px] bg-white shadow-sm ring-1 ring-stone-200">
            <div className="relative aspect-[16/8.5] min-h-[260px]">
              <Image
                src={featuredPost.cover}
                alt=""
                fill
                priority
                className="object-cover"
                sizes="(min-width: 1024px) 720px, 100vw"
              />
            </div>
            <div className="p-6 sm:p-8">
              <div className="mb-4 flex flex-wrap items-center gap-3 text-sm text-stone-500">
                <span className="rounded-[8px] bg-emerald-50 px-3 py-1 font-medium text-emerald-800">
                  Featured
                </span>
                <span>{featuredPost.category}</span>
                <span>{featuredPost.readTime}</span>
              </div>
              <h2 className="max-w-2xl text-3xl font-semibold leading-tight sm:text-4xl">
                {featuredPost.title}
              </h2>
              <p className="mt-4 max-w-2xl text-base leading-8 text-stone-600">
                {featuredPost.excerpt}
              </p>
              <Link
                href={`/posts/${featuredPost.slug}`}
                prefetch={false}
                className="mt-6 inline-flex rounded-[8px] bg-emerald-700 px-5 py-3 text-sm font-semibold text-white hover:bg-emerald-800"
              >
                Baca Artikel
              </Link>
            </div>
          </article>

          <aside className="flex flex-col justify-between gap-8 rounded-[8px] bg-stone-950 p-6 text-white sm:p-8">
            <div>
              <p className="text-sm font-semibold text-amber-300">Editorial</p>
              <h2 className="mt-4 text-3xl font-semibold leading-tight">
                Temukan tulisan terbaru dari berbagai kategori.
              </h2>
              <p className="mt-4 leading-7 text-stone-300">
                Pilih topik, baca ringkasan, lalu lanjutkan ke artikel penuh
                tanpa distraksi.
              </p>
            </div>
            <div>
              <div className="flex flex-wrap gap-2">
                {categories.map((category) => (
                  <span
                    key={category}
                    className="rounded-[8px] border border-white/10 bg-white/5 px-3 py-2 text-sm text-stone-200"
                  >
                    {category}
                  </span>
                ))}
              </div>
              <div className="mt-8 grid grid-cols-3 gap-3 border-t border-white/10 pt-6">
                <Stat label="Posts" value={String(posts.length).padStart(2, "0")} />
                <Stat label="Topics" value={String(categories.length).padStart(2, "0")} />
                <Stat label="Views" value={formatViews(totalViews)} />
              </div>
            </div>
          </aside>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-5 pb-16">
        <div className="mb-6 flex flex-col justify-between gap-3 sm:flex-row sm:items-end">
          <div>
            <h2 className="text-2xl font-semibold">Artikel Terbaru</h2>
            <p className="mt-2 text-stone-600">
              Pilihan tulisan terbaru dari ruang editorial.
            </p>
          </div>
          <span className="text-sm font-medium text-stone-500">
            {otherPosts.length} artikel
          </span>
        </div>

        <div className="grid gap-5 md:grid-cols-2">
          {otherPosts.map((post) => (
            <Link
              key={post.slug}
              href={`/posts/${post.slug}`}
              prefetch={false}
              className="group grid overflow-hidden rounded-[8px] bg-white shadow-sm ring-1 ring-stone-200 transition hover:-translate-y-0.5 hover:shadow-md sm:grid-cols-[180px_1fr]"
            >
              <div className="relative aspect-[16/10] sm:aspect-auto">
                <Image
                  src={post.cover}
                  alt=""
                  fill
                  className="object-cover"
                  sizes="(min-width: 768px) 180px, 100vw"
                />
              </div>
              <div className="p-5">
                <div className="flex flex-wrap items-center gap-2 text-sm text-stone-500">
                  <span className="font-medium text-emerald-700">
                    {post.category}
                  </span>
                  <span>{post.readTime}</span>
                </div>
                <h3 className="mt-2 text-xl font-semibold leading-snug group-hover:text-emerald-800">
                  {post.title}
                </h3>
                <p className="mt-3 line-clamp-2 text-sm leading-6 text-stone-600">
                  {post.excerpt}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </main>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <div className="text-2xl font-semibold">{value}</div>
      <div className="mt-1 text-xs font-medium text-stone-400">{label}</div>
    </div>
  );
}
