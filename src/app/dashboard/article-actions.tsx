"use client";

import Link from "next/link";
import { useState } from "react";
import {
  deletePostAction,
  togglePostStatusAction,
} from "@/app/dashboard/actions";
import type { PostStatus } from "@/lib/post-store";

type ArticleActionsProps = {
  slug: string;
  title: string;
  status: PostStatus;
};

export function ArticleActions({ slug, title, status }: ArticleActionsProps) {
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const nextStatus = status === "PUBLISHED" ? "DRAFT" : "PUBLISHED";

  return (
    <div className="flex flex-wrap items-center gap-2">
      {status === "PUBLISHED" ? (
        <Link
          href={`/posts/${slug}`}
          className="rounded-[8px] border border-stone-300 px-3 py-2 text-xs font-semibold text-stone-700 hover:border-stone-950"
        >
          View
        </Link>
      ) : (
        <span className="rounded-[8px] border border-stone-200 px-3 py-2 text-xs font-semibold text-stone-400">
          View
        </span>
      )}

      <Link
        href={`/dashboard/posts/${slug}/edit`}
        className="rounded-[8px] border border-stone-300 px-3 py-2 text-xs font-semibold text-stone-700 hover:border-stone-950"
      >
        Edit
      </Link>

      <form action={togglePostStatusAction}>
        <input type="hidden" name="slug" value={slug} />
        <input type="hidden" name="status" value={nextStatus} />
        <button className="rounded-[8px] border border-stone-300 px-3 py-2 text-xs font-semibold text-stone-700 hover:border-stone-950">
          {status === "PUBLISHED" ? "Unpublish" : "Publish"}
        </button>
      </form>

      <button
        type="button"
        onClick={() => setIsDeleteOpen(true)}
        className="rounded-[8px] bg-red-50 px-3 py-2 text-xs font-semibold text-red-700 hover:bg-red-100"
      >
        Delete
      </button>

      {isDeleteOpen ? (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-stone-950/55 px-5"
          role="dialog"
          aria-modal="true"
          aria-labelledby={`delete-${slug}`}
        >
          <div className="w-full max-w-sm rounded-[8px] bg-white p-5 text-stone-950 shadow-xl ring-1 ring-stone-200">
            <div className="flex size-11 items-center justify-center rounded-[8px] bg-red-50 text-lg font-semibold text-red-700">
              !
            </div>
            <h2 id={`delete-${slug}`} className="mt-4 text-xl font-semibold">
              Hapus artikel?
            </h2>
            <p className="mt-2 text-sm leading-6 text-stone-600">
              Artikel <span className="font-semibold text-stone-950">{title}</span>{" "}
              akan dihapus dari workspace. Aksi ini tidak bisa dibatalkan.
            </p>

            <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:justify-end">
              <button
                type="button"
                onClick={() => setIsDeleteOpen(false)}
                className="rounded-[8px] border border-stone-300 px-4 py-2 text-sm font-semibold text-stone-700 hover:border-stone-950"
              >
                Batal
              </button>
              <form action={deletePostAction}>
                <input type="hidden" name="slug" value={slug} />
                <button className="w-full rounded-[8px] bg-red-700 px-4 py-2 text-sm font-semibold text-white hover:bg-red-800 sm:w-auto">
                  Hapus
                </button>
              </form>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
