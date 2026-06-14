import Link from "next/link";
import { createPostAction } from "@/app/dashboard/actions";
import { ArticleActions } from "@/app/dashboard/article-actions";
import { LogoutButton } from "@/app/dashboard/logout-button";
import { formatViews, getPosts, getTotalViews } from "@/lib/post-store";

const tasks = [
  "Review draft sebelum publish",
  "Periksa cover artikel terbaru",
  "Siapkan topik publikasi berikutnya",
];

export const dynamic = "force-dynamic";

export default async function Dashboard({
  searchParams,
}: {
  searchParams: Promise<{ error?: string; success?: string }>;
}) {
  const params = await searchParams;
  const posts = await getPosts();
  const publishedPosts = posts.filter((post) => post.status === "PUBLISHED");
  const draftPosts = posts.filter((post) => post.status === "DRAFT");
  const totalViews = getTotalViews(publishedPosts);

  return (
    <main className="min-h-screen bg-stone-100 text-stone-950">
      <header className="sticky top-0 z-30 border-b border-stone-200 bg-white/90 backdrop-blur">
        <nav className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4">
          <Link href="/" className="text-lg font-semibold">
            RuangTulis
          </Link>
          <div className="flex items-center gap-2">
            <Link
              href="/"
              className="rounded-[8px] border border-stone-300 px-4 py-2 text-sm font-semibold hover:border-stone-950"
            >
              Lihat Blog
            </Link>
            <LogoutButton />
          </div>
        </nav>
      </header>

      <section className="mx-auto max-w-7xl px-5 py-8">
        <div className="mb-6 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
          <div>
            <p className="text-sm font-semibold text-emerald-700">
              Author Workspace
            </p>
            <h1 className="mt-2 text-3xl font-semibold">Dashboard Konten</h1>
            <p className="mt-2 max-w-2xl text-stone-600">
              Kelola artikel, pantau status publish, dan tulis konten baru dari
              satu tempat.
            </p>
          </div>
          <a
            href="#buat-artikel"
            className="rounded-[8px] bg-emerald-700 px-5 py-3 text-sm font-semibold text-white hover:bg-emerald-800"
          >
            Buat Artikel
          </a>
        </div>

        <div className="grid gap-4 md:grid-cols-4">
          <Metric label="Published" value={String(publishedPosts.length)} />
          <Metric label="Drafts" value={String(draftPosts.length)} />
          <Metric label="Total Posts" value={String(posts.length)} />
          <Metric label="Views" value={formatViews(totalViews)} />
        </div>

        <DashboardAlert error={params.error} success={params.success} />

        <div className="mt-6 grid gap-6 lg:grid-cols-[minmax(0,1fr)_340px]">
          <section className="rounded-[8px] bg-white p-5 shadow-sm ring-1 ring-stone-200">
            <div className="mb-4 flex items-center justify-between gap-4">
              <div>
                <h2 className="text-lg font-semibold">Artikel</h2>
                <p className="mt-1 text-sm text-stone-500">
                  Semua artikel yang tersimpan di workspace.
                </p>
              </div>
              <span className="rounded-[8px] bg-stone-100 px-3 py-2 text-sm font-medium text-stone-600">
                {posts.length} item
              </span>
            </div>

            {posts.length > 0 ? (
              <div className="overflow-hidden rounded-[8px] border border-stone-200">
                {posts.map((post) => (
                  <div
                    key={post.slug}
                    className="grid gap-4 border-b border-stone-200 p-4 last:border-b-0 xl:grid-cols-[minmax(0,1fr)_110px_90px_110px_260px]"
                  >
                    <div className="min-w-0">
                      <div className="truncate font-semibold">{post.title}</div>
                      <div className="mt-1 text-sm text-stone-500">
                        {post.category} - {post.author}
                      </div>
                    </div>
                    <div className="text-sm text-stone-500">{post.readTime}</div>
                    <div className="text-sm text-stone-500">
                      {formatViews(post.views ?? 0)} views
                    </div>
                    <div>
                      <span
                        className={
                          post.status === "PUBLISHED"
                            ? "rounded-[8px] bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-800"
                            : "rounded-[8px] bg-amber-50 px-3 py-1 text-xs font-semibold text-amber-800"
                        }
                      >
                        {post.status === "PUBLISHED" ? "Published" : "Draft"}
                      </span>
                    </div>
                    <ArticleActions
                      slug={post.slug}
                      title={post.title}
                      status={post.status}
                    />
                  </div>
                ))}
              </div>
            ) : (
              <div className="rounded-[8px] border border-dashed border-stone-300 bg-stone-50 p-8 text-center">
                <h3 className="text-lg font-semibold">
                  Belum ada artikel tersimpan.
                </h3>
                <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-stone-500">
                  Buat artikel pertama dari form di bawah. Artikel yang
                  dipublish akan langsung muncul di halaman blog.
                </p>
                <a
                  href="#buat-artikel"
                  className="mt-5 inline-flex rounded-[8px] bg-emerald-700 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-800"
                >
                  Buat Artikel
                </a>
              </div>
            )}
          </section>

          <aside className="rounded-[8px] bg-stone-950 p-5 text-white">
            <h2 className="text-lg font-semibold">Prioritas</h2>
            <div className="mt-4 space-y-3">
              {tasks.map((task) => (
                <label
                  key={task}
                  className="flex items-start gap-3 rounded-[8px] bg-white/5 p-3 text-sm text-stone-200"
                >
                  <input
                    type="checkbox"
                    className="mt-1 size-4 rounded border-white/30 accent-emerald-500"
                  />
                  <span>{task}</span>
                </label>
              ))}
            </div>
          </aside>
        </div>

        <section
          id="buat-artikel"
          className="mt-6 rounded-[8px] bg-white p-5 shadow-sm ring-1 ring-stone-200"
        >
          <div className="mb-5 border-b border-stone-200 pb-4">
            <h2 className="text-lg font-semibold">Buat Artikel Baru</h2>
            <p className="mt-1 text-sm text-stone-500">
              Publish akan membuat artikel langsung tampil di halaman blog.
            </p>
          </div>

          <form action={createPostAction} className="grid gap-4">
            <div className="grid gap-4 md:grid-cols-2">
              <Field label="Judul" name="title" placeholder="Judul artikel" />
              <Field
                label="Kategori"
                name="category"
                placeholder="Writing, Design, Engineering"
              />
            </div>
            <Field
              label="Ringkasan"
              name="excerpt"
              placeholder="Ringkasan pendek untuk kartu artikel"
            />
            <Field
              label="Cover image URL"
              name="cover"
              placeholder="Opsional, pakai URL gambar HTTPS"
              optional
            />
            <div>
              <label
                htmlFor="content"
                className="text-sm font-semibold text-stone-700"
              >
                Isi artikel
              </label>
              <textarea
                id="content"
                name="content"
                required
                rows={10}
                className="mt-2 w-full resize-y rounded-[8px] border border-stone-300 bg-white px-4 py-3 text-sm leading-7 text-stone-950 outline-none focus:border-emerald-700 focus:ring-4 focus:ring-emerald-100"
                placeholder="Tulis artikel di sini. Pisahkan paragraf dengan baris baru."
              />
            </div>
            <div className="flex flex-col gap-3 sm:flex-row">
              <button
                name="intent"
                value="publish"
                className="rounded-[8px] bg-emerald-700 px-5 py-3 text-sm font-semibold text-white hover:bg-emerald-800"
              >
                Publish Artikel
              </button>
              <button
                name="intent"
                value="draft"
                className="rounded-[8px] border border-stone-300 px-5 py-3 text-sm font-semibold text-stone-700 hover:border-stone-950"
              >
                Simpan Draft
              </button>
            </div>
          </form>
        </section>
      </section>
    </main>
  );
}

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-[8px] bg-white p-5 shadow-sm ring-1 ring-stone-200">
      <div className="text-sm font-medium text-stone-500">{label}</div>
      <div className="mt-2 text-3xl font-semibold">{value}</div>
    </div>
  );
}

function DashboardAlert({
  error,
  success,
}: {
  error?: string;
  success?: string;
}) {
  if (error === "missing-fields") {
    return (
      <div className="mt-4 rounded-[8px] border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
        Lengkapi judul, ringkasan, dan isi artikel sebelum menyimpan.
      </div>
    );
  }

  if (error === "invalid-action") {
    return (
      <div className="mt-4 rounded-[8px] border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
        Aksi tidak valid. Coba ulangi dari dashboard.
      </div>
    );
  }

  if (success === "status-updated") {
    return (
      <div className="mt-4 rounded-[8px] border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-800">
        Status artikel berhasil diperbarui.
      </div>
    );
  }

  if (success === "post-deleted") {
    return (
      <div className="mt-4 rounded-[8px] border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-800">
        Artikel berhasil dihapus.
      </div>
    );
  }

  if (success === "post-updated") {
    return (
      <div className="mt-4 rounded-[8px] border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-800">
        Artikel berhasil diperbarui.
      </div>
    );
  }

  return null;
}

function Field({
  label,
  name,
  placeholder,
  optional = false,
}: {
  label: string;
  name: string;
  placeholder: string;
  optional?: boolean;
}) {
  return (
    <div>
      <label htmlFor={name} className="text-sm font-semibold text-stone-700">
        {label}
      </label>
      <input
        id={name}
        name={name}
        type="text"
        required={!optional}
        className="mt-2 h-12 w-full rounded-[8px] border border-stone-300 bg-white px-4 text-sm text-stone-950 outline-none focus:border-emerald-700 focus:ring-4 focus:ring-emerald-100"
        placeholder={placeholder}
      />
    </div>
  );
}
