"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import {
  DASHBOARD_COOKIE_NAME,
  getDashboardAccessKey,
} from "@/lib/auth";
import { createPost, type PostStatus } from "@/lib/post-store";

export async function createPostAction(formData: FormData) {
  const cookieStore = await cookies();
  const session = cookieStore.get(DASHBOARD_COOKIE_NAME)?.value;

  if (session !== getDashboardAccessKey()) {
    redirect("/login");
  }

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
