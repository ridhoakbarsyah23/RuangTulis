import Link from "next/link";
import { notFound } from "next/navigation";
import { updatePostAction } from "@/app/dashboard/actions";
import { getAnyPostBySlug } from "@/lib/post-store";

export const dynamic = "force-dynamic";

export default async function EditPostPage({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ error?: string }>;
}) {
  const { slug } = await params;
  const { error } = await searchParams;
  const post = await getAnyPostBySlug(slug);

  if (!post) {
    notFound();
  }

  return (
    <main className="min-h-screen bg-stone-100 text-stone-950">
      <header className="sticky top-0 z-30 border-b border-stone-200 bg-white/90 backdrop-blur">
        <nav className="mx-auto flex max-w-5xl items-center justify-between px-5 py-4">
          <Link href="/dashboard" className="text-lg font-semibold">
            RuangTulis
          </Link>
          <div className="flex items-center gap-2">
            {post.status === "PUBLISHED" ? (
              <Link
                href={`/posts/${post.slug}`}
                prefetch={false}
                className="rounded-[8px] border border-stone-300 px-4 py-2 text-sm font-semibold hover:border-stone-950"
              >
                View
              </Link>
            ) : null}
            <Link
              href="/dashboard"
              className="rounded-[8px] bg-stone-950 px-4 py-2 text-sm font-semibold text-white hover:bg-stone-800"
            >
              Dashboard
            </Link>
          </div>
        </nav>
      </header>

      <section className="mx-auto max-w-5xl px-5 py-8">
        <div className="mb-6">
          <p className="text-sm font-semibold text-emerald-700">
            Edit Artikel
          </p>
          <h1 className="mt-2 text-3xl font-semibold">{post.title}</h1>
          <p className="mt-2 text-stone-600">
            Perbarui isi artikel, lalu publish atau simpan sebagai draft.
          </p>
        </div>

        {error === "missing-fields" ? (
          <div className="mb-4 rounded-[8px] border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
            Lengkapi judul, ringkasan, dan isi artikel sebelum menyimpan.
          </div>
        ) : null}

        <section className="rounded-[8px] bg-white p-5 shadow-sm ring-1 ring-stone-200">
          <form action={updatePostAction} className="grid gap-4">
            <input type="hidden" name="slug" value={post.slug} />
            <div className="grid gap-4 md:grid-cols-2">
              <Field
                label="Judul"
                name="title"
                defaultValue={post.title}
                placeholder="Judul artikel"
              />
              <Field
                label="Kategori"
                name="category"
                defaultValue={post.category}
                placeholder="Writing, Design, Engineering"
              />
            </div>
            <Field
              label="Ringkasan"
              name="excerpt"
              defaultValue={post.excerpt}
              placeholder="Ringkasan pendek untuk kartu artikel"
            />
            <Field
              label="Cover image URL"
              name="cover"
              defaultValue={post.cover}
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
                rows={12}
                defaultValue={post.content.join("\n\n")}
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
                Update & Publish
              </button>
              <button
                name="intent"
                value="draft"
                className="rounded-[8px] border border-stone-300 px-5 py-3 text-sm font-semibold text-stone-700 hover:border-stone-950"
              >
                Simpan Sebagai Draft
              </button>
            </div>
          </form>
        </section>
      </section>
    </main>
  );
}

function Field({
  label,
  name,
  defaultValue,
  placeholder,
  optional = false,
}: {
  label: string;
  name: string;
  defaultValue: string;
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
        defaultValue={defaultValue}
        className="mt-2 h-12 w-full rounded-[8px] border border-stone-300 bg-white px-4 text-sm text-stone-950 outline-none focus:border-emerald-700 focus:ring-4 focus:ring-emerald-100"
        placeholder={placeholder}
      />
    </div>
  );
}
