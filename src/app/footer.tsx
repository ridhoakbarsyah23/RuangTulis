import Link from "next/link";

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-stone-200 bg-white">
      <div className="mx-auto flex max-w-7xl flex-col gap-3 px-5 py-6 text-sm text-stone-500 sm:flex-row sm:items-center sm:justify-between">
        <p>© {year} RuangTulis - Eldorado Tech. All rights reserved.</p>
        <nav className="flex gap-4 font-medium">
          <Link href="/" className="hover:text-stone-950">
            Explore
          </Link>
          <Link href="/dashboard" className="hover:text-stone-950">
            Dashboard
          </Link>
        </nav>
      </div>
    </footer>
  );
}
