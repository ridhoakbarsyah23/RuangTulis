"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import {
  DASHBOARD_COOKIE_NAME,
  getDashboardAccessKey,
} from "@/lib/auth";
import {
  createPost,
  deletePost,
  updatePost,
  updatePostStatus,
  type PostStatus,
} from "@/lib/post-store";

async function requireDashboardSession() {
  const cookieStore = await cookies();
  const session = cookieStore.get(DASHBOARD_COOKIE_NAME)?.value;

  if (session !== getDashboardAccessKey()) {
    redirect("/login");
  }
}

export async function createPostAction(formData: FormData) {
  await requireDashboardSession();

  const title = String(formData.get("title") ?? "").trim();
  const excerpt = String(formData.get("excerpt") ?? "").trim();
  const content = String(formData.get("content") ?? "").trim();
  const category = String(formData.get("category") ?? "").trim();
  const cover = String(formData.get("cover") ?? "").trim();
  const intent = String(formData.get("intent") ?? "draft");
  const status: PostStatus = intent === "publish" ? "PUBLISHED" : "DRAFT";

  if (!title || !excerpt || !content) {
    redirect("/dashboard?error=missing-fields");
  }

  const post = await createPost({
    title,
    excerpt,
    content,
    category,
    cover,
    status,
  });

  revalidatePath("/");
  revalidatePath("/dashboard");
  revalidatePath(`/posts/${post.slug}`);

  if (post.status === "PUBLISHED") {
    redirect(`/posts/${post.slug}`);
  }

  redirect("/dashboard");
}

export async function togglePostStatusAction(formData: FormData) {
  await requireDashboardSession();

  const slug = String(formData.get("slug") ?? "").trim();
  const status = String(formData.get("status") ?? "").trim();

  if (!slug || (status !== "DRAFT" && status !== "PUBLISHED")) {
    redirect("/dashboard?error=invalid-action");
  }

  await updatePostStatus(slug, status);

  revalidatePath("/");
  revalidatePath("/dashboard");
  revalidatePath(`/posts/${slug}`);

  redirect("/dashboard?success=status-updated");
}

export async function updatePostAction(formData: FormData) {
  await requireDashboardSession();

  const slug = String(formData.get("slug") ?? "").trim();
  const title = String(formData.get("title") ?? "").trim();
  const excerpt = String(formData.get("excerpt") ?? "").trim();
  const content = String(formData.get("content") ?? "").trim();
  const category = String(formData.get("category") ?? "").trim();
  const cover = String(formData.get("cover") ?? "").trim();
  const intent = String(formData.get("intent") ?? "draft");
  const status: PostStatus = intent === "publish" ? "PUBLISHED" : "DRAFT";

  if (!slug || !title || !excerpt || !content) {
    redirect(`/dashboard/posts/${slug}/edit?error=missing-fields`);
  }

  const post = await updatePost(slug, {
    title,
    excerpt,
    content,
    category,
    cover,
    status,
  });

  if (!post) {
    redirect("/dashboard?error=invalid-action");
  }

  revalidatePath("/");
  revalidatePath("/dashboard");
  revalidatePath(`/posts/${slug}`);
  revalidatePath(`/dashboard/posts/${slug}/edit`);

  if (post.status === "PUBLISHED") {
    redirect(`/posts/${post.slug}`);
  }

  redirect("/dashboard?success=post-updated");
}

export async function deletePostAction(formData: FormData) {
  await requireDashboardSession();

  const slug = String(formData.get("slug") ?? "").trim();

  if (!slug) {
    redirect("/dashboard?error=invalid-action");
  }

  await deletePost(slug);

  revalidatePath("/");
  revalidatePath("/dashboard");
  revalidatePath(`/posts/${slug}`);

  redirect("/dashboard?success=post-deleted");
}
