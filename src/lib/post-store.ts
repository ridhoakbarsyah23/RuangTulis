import "server-only";

import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";

export type PostStatus = "DRAFT" | "PUBLISHED";

export type Post = {
  slug: string;
  title: string;
  excerpt: string;
  content: string[];
  category: string;
  author: string;
  readTime: string;
  publishedAt: string;
  cover: string;
  featured?: boolean;
  status: PostStatus;
};

export type NewPostInput = {
  title: string;
  excerpt: string;
  content: string;
  category: string;
  cover?: string;
  status: PostStatus;
};

export type UpdatePostInput = NewPostInput;

const postsFilePath = path.join(process.cwd(), "src", "data", "posts.json");
const defaultCover =
  "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=1400&q=80";
const allowedCoverHosts = new Set([
  "images.unsplash.com",
  "encrypted-tbn0.gstatic.com",
  "encrypted-tbn1.gstatic.com",
  "encrypted-tbn2.gstatic.com",
  "encrypted-tbn3.gstatic.com",
]);

export async function getPosts() {
  const file = await readFile(postsFilePath, "utf8");
  return JSON.parse(file) as Post[];
}

export async function getPublishedPosts() {
  const posts = await getPosts();
  return posts.filter((post) => post.status === "PUBLISHED");
}

export async function getFeaturedPost() {
  const posts = await getPublishedPosts();
  return posts.find((post) => post.featured) ?? posts[0];
}

export async function getPostBySlug(slug: string) {
  const posts = await getPublishedPosts();
  return posts.find((post) => post.slug === slug);
}

export async function getAnyPostBySlug(slug: string) {
  const posts = await getPosts();
  return posts.find((post) => post.slug === slug);
}

export async function createPost(input: NewPostInput) {
  const posts = await getPosts();
  const slug = createUniqueSlug(input.title, posts);
  const content = input.content
    .split(/\r?\n/)
    .map((paragraph) => paragraph.trim())
    .filter(Boolean);

  const post: Post = {
    slug,
    title: input.title.trim(),
    excerpt: input.excerpt.trim(),
    content,
    category: input.category.trim() || "General",
    author: "superadmin",
    readTime: calculateReadTime(content),
    publishedAt:
      input.status === "PUBLISHED" ? formatPublishedDate() : "Draft",
    cover: normalizeCoverUrl(input.cover),
    status: input.status,
  };

  await mkdir(path.dirname(postsFilePath), { recursive: true });
  await writeFile(postsFilePath, JSON.stringify([post, ...posts], null, 2));

  return post;
}

export async function updatePostStatus(slug: string, status: PostStatus) {
  const posts = await getPosts();
  const nextPosts = posts.map((post) => {
    if (post.slug !== slug) {
      return post;
    }

    return {
      ...post,
      status,
      publishedAt:
        status === "PUBLISHED" && post.publishedAt === "Draft"
          ? formatPublishedDate()
          : post.publishedAt,
    };
  });

  await writePosts(nextPosts);
}

export async function updatePost(slug: string, input: UpdatePostInput) {
  const posts = await getPosts();
  const currentPost = posts.find((post) => post.slug === slug);

  if (!currentPost) {
    return null;
  }

  const content = input.content
    .split(/\r?\n/)
    .map((paragraph) => paragraph.trim())
    .filter(Boolean);

  const nextPosts = posts.map((post) => {
    if (post.slug !== slug) {
      return post;
    }

    return {
      ...post,
      title: input.title.trim(),
      excerpt: input.excerpt.trim(),
      content,
      category: input.category.trim() || "General",
      cover: normalizeCoverUrl(input.cover),
      status: input.status,
      readTime: calculateReadTime(content),
      publishedAt:
        input.status === "PUBLISHED" && post.publishedAt === "Draft"
          ? formatPublishedDate()
          : input.status === "DRAFT"
            ? "Draft"
            : post.publishedAt,
    };
  });

  await writePosts(nextPosts);
  return nextPosts.find((post) => post.slug === slug) ?? null;
}

export async function deletePost(slug: string) {
  const posts = await getPosts();
  await writePosts(posts.filter((post) => post.slug !== slug));
}

function createUniqueSlug(title: string, posts: Post[]) {
  const baseSlug = slugify(title);
  let slug = baseSlug;
  let counter = 2;

  while (posts.some((post) => post.slug === slug)) {
    slug = `${baseSlug}-${counter}`;
    counter += 1;
  }

  return slug;
}

function slugify(value: string) {
  return (
    value
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9\s-]/g, "")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-") || `artikel-${Date.now()}`
  );
}

function calculateReadTime(content: string[]) {
  const words = content.join(" ").split(/\s+/).filter(Boolean).length;
  const minutes = Math.max(1, Math.ceil(words / 180));
  return `${minutes} min read`;
}

function formatPublishedDate() {
  return new Intl.DateTimeFormat("id-ID", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(new Date());
}

async function writePosts(posts: Post[]) {
  await mkdir(path.dirname(postsFilePath), { recursive: true });
  await writeFile(postsFilePath, JSON.stringify(posts, null, 2));
}

function normalizeCoverUrl(cover?: string) {
  const value = cover?.trim();

  if (!value) {
    return defaultCover;
  }

  try {
    const url = new URL(value);
    if (url.protocol === "https:" && allowedCoverHosts.has(url.hostname)) {
      return value;
    }
  } catch {
    return defaultCover;
  }

  return defaultCover;
}
