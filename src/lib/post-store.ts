import "server-only";

import postsSeed from "@/data/posts.json";
import { getAdminUsername } from "@/lib/auth";
import { prisma } from "@/lib/db";

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
  views?: number;
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

type StoredPost = {
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  coverImage: string | null;
  status: "DRAFT" | "PUBLISHED" | "ARCHIVED";
  readMinutes: number;
  views: number;
  featured: boolean;
  publishedAt: Date | null;
  createdAt: Date;
  author: { name: string };
  category: { name: string } | null;
};

const defaultCover =
  "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=1400&q=80";
const allowedCoverHosts = new Set([
  "images.unsplash.com",
  "encrypted-tbn0.gstatic.com",
  "encrypted-tbn1.gstatic.com",
  "encrypted-tbn2.gstatic.com",
  "encrypted-tbn3.gstatic.com",
]);

const postIncludes = {
  author: { select: { name: true } },
  category: { select: { name: true } },
} as const;

let seedPromise: Promise<void> | null = null;

export async function getPosts() {
  try {
    await seedPostsIfNeeded();

    const posts = await prisma.post.findMany({
      include: postIncludes,
      orderBy: [{ createdAt: "desc" }],
    });

    return posts
      .filter((post) => post.status === "DRAFT" || post.status === "PUBLISHED")
      .map(mapPost);
  } catch (error) {
    console.error("Falling back to seed posts because database read failed", error);
    return getSeedPosts();
  }
}

export async function getPublishedPosts() {
  try {
    await seedPostsIfNeeded();

    const posts = await prisma.post.findMany({
      where: { status: "PUBLISHED" },
      include: postIncludes,
      orderBy: [{ publishedAt: "desc" }, { createdAt: "desc" }],
    });

    return posts.map(mapPost);
  } catch (error) {
    console.error(
      "Falling back to seed published posts because database read failed",
      error,
    );
    return getSeedPosts().filter((post) => post.status === "PUBLISHED");
  }
}

export async function getFeaturedPost() {
  try {
    await seedPostsIfNeeded();

    const post =
      (await prisma.post.findFirst({
        where: { status: "PUBLISHED", featured: true },
        include: postIncludes,
        orderBy: [{ publishedAt: "desc" }, { createdAt: "desc" }],
      })) ??
      (await prisma.post.findFirst({
        where: { status: "PUBLISHED" },
        include: postIncludes,
        orderBy: [{ publishedAt: "desc" }, { createdAt: "desc" }],
      }));

    return post ? mapPost(post) : undefined;
  } catch (error) {
    console.error("Falling back to seed featured post because database read failed", error);
    const posts = getSeedPosts().filter((post) => post.status === "PUBLISHED");
    return posts.find((post) => post.featured) ?? posts[0];
  }
}

export async function getPostBySlug(slug: string) {
  try {
    await seedPostsIfNeeded();

    const post = await prisma.post.findFirst({
      where: { slug, status: "PUBLISHED" },
      include: postIncludes,
    });

    return post ? mapPost(post) : undefined;
  } catch (error) {
    console.error("Falling back to seed post because database read failed", error);
    return getSeedPosts().find(
      (post) => post.slug === slug && post.status === "PUBLISHED",
    );
  }
}

export async function getAnyPostBySlug(slug: string) {
  await seedPostsIfNeeded();

  const post = await prisma.post.findUnique({
    where: { slug },
    include: postIncludes,
  });

  return post && (post.status === "DRAFT" || post.status === "PUBLISHED")
    ? mapPost(post)
    : undefined;
}

export async function createPost(input: NewPostInput) {
  await seedPostsIfNeeded();

  const existingPosts = await prisma.post.findMany({ select: { slug: true } });
  const slug = createUniqueSlug(
    input.title,
    existingPosts.map((post) => post.slug),
  );
  const content = splitContent(input.content);
  const author = await getOrCreateAdminUser();
  const category = await getOrCreateCategory(input.category);

  const post = await prisma.post.create({
    data: {
      slug,
      title: input.title.trim(),
      excerpt: input.excerpt.trim(),
      content: content.join("\n\n"),
      coverImage: normalizeCoverUrl(input.cover),
      status: input.status,
      readMinutes: calculateReadMinutes(content),
      publishedAt: input.status === "PUBLISHED" ? new Date() : null,
      views: 0,
      authorId: author.id,
      categoryId: category.id,
    },
    include: postIncludes,
  });

  return mapPost(post);
}

export async function updatePostStatus(slug: string, status: PostStatus) {
  const currentPost = await prisma.post.findUnique({
    where: { slug },
    select: { publishedAt: true },
  });

  if (!currentPost) {
    return;
  }

  await prisma.post.update({
    where: { slug },
    data: {
      status,
      publishedAt:
        status === "PUBLISHED" ? (currentPost.publishedAt ?? new Date()) : null,
    },
  });
}

export async function updatePost(slug: string, input: UpdatePostInput) {
  const currentPost = await prisma.post.findUnique({
    where: { slug },
    select: { publishedAt: true },
  });

  if (!currentPost) {
    return null;
  }

  const content = splitContent(input.content);
  const category = await getOrCreateCategory(input.category);
  const post = await prisma.post.update({
    where: { slug },
    data: {
      title: input.title.trim(),
      excerpt: input.excerpt.trim(),
      content: content.join("\n\n"),
      categoryId: category.id,
      coverImage: normalizeCoverUrl(input.cover),
      status: input.status,
      readMinutes: calculateReadMinutes(content),
      publishedAt:
        input.status === "PUBLISHED"
          ? (currentPost.publishedAt ?? new Date())
          : null,
    },
    include: postIncludes,
  });

  return mapPost(post);
}

export async function incrementPostViews(slug: string) {
  try {
    await seedPostsIfNeeded();

    const currentPost = await prisma.post.findFirst({
      where: { slug, status: "PUBLISHED" },
      select: { id: true },
    });

    if (!currentPost) {
      return null;
    }

    const post = await prisma.post.update({
      where: { id: currentPost.id },
      data: { views: { increment: 1 } },
      include: postIncludes,
    });

    return mapPost(post);
  } catch (error) {
    console.error("Skipping view increment because database write failed", error);
    return getSeedPosts().find(
      (post) => post.slug === slug && post.status === "PUBLISHED",
    ) ?? null;
  }
}

export async function deletePost(slug: string) {
  await prisma.post.delete({ where: { slug } });
}

export function getTotalViews(posts: Post[]) {
  return posts.reduce((total, post) => total + (post.views ?? 0), 0);
}

export function formatViews(views: number) {
  return new Intl.NumberFormat("id-ID", {
    notation: "compact",
    maximumFractionDigits: 1,
  }).format(views);
}

async function seedPostsIfNeeded() {
  seedPromise ??= seedPosts();

  try {
    await seedPromise;
  } catch (error) {
    seedPromise = null;
    throw error;
  }
}

async function seedPosts() {
  const postCount = await prisma.post.count();

  if (postCount > 0) {
    return;
  }

  const author = await getOrCreateAdminUser();

  for (const seedPost of postsSeed) {
    const category = await getOrCreateCategory(seedPost.category);
    const content = Array.isArray(seedPost.content)
      ? seedPost.content
      : splitContent(String(seedPost.content));
    const status = normalizeStatus(seedPost.status);

    await prisma.post.upsert({
      where: { slug: seedPost.slug },
      create: {
        slug: seedPost.slug,
        title: seedPost.title,
        excerpt: seedPost.excerpt,
        content: content.join("\n\n"),
        coverImage: normalizeCoverUrl(seedPost.cover),
        status,
        readMinutes: calculateReadMinutes(content),
        publishedAt:
          status === "PUBLISHED" ? parsePublishedDate(seedPost.publishedAt) : null,
        views: seedPost.views ?? 0,
        featured: "featured" in seedPost ? Boolean(seedPost.featured) : false,
        authorId: author.id,
        categoryId: category.id,
      },
      update: {},
    });
  }
}

async function getOrCreateAdminUser() {
  const username = getAdminUsername();
  const email = `${username}@ruangtulis.local`;

  return prisma.user.upsert({
    where: { email },
    create: { name: username, email, role: "ADMIN" },
    update: { name: username, role: "ADMIN" },
  });
}

async function getOrCreateCategory(categoryName: string) {
  const name = categoryName.trim() || "General";
  const slug = slugify(name);

  return prisma.category.upsert({
    where: { slug },
    create: { name, slug },
    update: { name },
  });
}

function mapPost(post: StoredPost): Post {
  return {
    slug: post.slug,
    title: post.title,
    excerpt: post.excerpt,
    content: splitContent(post.content),
    category: post.category?.name ?? "General",
    author: post.author.name,
    readTime: `${Math.max(1, post.readMinutes)} min read`,
    publishedAt: post.publishedAt ? formatPublishedDate(post.publishedAt) : "Draft",
    cover: post.coverImage ?? defaultCover,
    featured: post.featured,
    views: post.views,
    status: post.status === "PUBLISHED" ? "PUBLISHED" : "DRAFT",
  };
}

function createUniqueSlug(title: string, existingSlugs: string[]) {
  const baseSlug = slugify(title);
  let slug = baseSlug;
  let counter = 2;

  while (existingSlugs.includes(slug)) {
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

function splitContent(content: string) {
  return content
    .split(/\r?\n/)
    .map((paragraph) => paragraph.trim())
    .filter(Boolean);
}

function calculateReadMinutes(content: string[]) {
  const words = content.join(" ").split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.ceil(words / 180));
}

function formatPublishedDate(date: Date) {
  return new Intl.DateTimeFormat("id-ID", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(date);
}

function parsePublishedDate(value: string) {
  if (value === "Draft") {
    return null;
  }

  const parsed = new Date(value);
  return Number.isNaN(parsed.getTime()) ? new Date() : parsed;
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

function normalizeStatus(status: string): PostStatus {
  return status === "PUBLISHED" ? "PUBLISHED" : "DRAFT";
}

function getSeedPosts() {
  return postsSeed.map((post) => {
    const content = Array.isArray(post.content)
      ? post.content
      : splitContent(String(post.content));
    const status = normalizeStatus(post.status);

    return {
      slug: post.slug,
      title: post.title,
      excerpt: post.excerpt,
      content,
      category: post.category || "General",
      author: post.author || getAdminUsername(),
      readTime: post.readTime || `${calculateReadMinutes(content)} min read`,
      publishedAt: status === "PUBLISHED" ? post.publishedAt : "Draft",
      cover: normalizeCoverUrl(post.cover),
      featured: "featured" in post ? Boolean(post.featured) : false,
      views: post.views ?? 0,
      status,
    };
  });
}
