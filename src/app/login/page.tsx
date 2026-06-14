import Link from "next/link";
import { LoginForm } from "./login-form";

export const metadata = {
  title: "Login Dashboard - RuangTulis",
};

export default function LoginPage() {
  return (
    <main className="grid min-h-screen bg-stone-50 text-stone-950 lg:grid-cols-[minmax(0,1fr)_520px]">
      <section className="flex items-center justify-center px-5 py-12">
        <div className="w-full max-w-md rounded-[8px] bg-white p-6 shadow-sm ring-1 ring-stone-200 sm:p-8">
          <Link href="/" className="text-lg font-semibold">
            RuangTulis
          </Link>
          <div className="mt-10">
            <p className="text-sm font-semibold text-emerald-700">
              Dashboard access
            </p>
            <h1 className="mt-3 text-3xl font-semibold leading-tight">
              Masuk untuk mengelola artikel.
            </h1>
            <p className="mt-4 leading-7 text-stone-600">
              Gunakan akun superadmin untuk menulis, menyimpan draft, dan
              menerbitkan artikel.
            </p>
          </div>
          <LoginForm />
        </div>
      </section>

      <aside className="hidden bg-stone-950 p-10 text-white lg:flex lg:flex-col lg:justify-between">
        <div>
          <p className="text-sm font-semibold text-amber-300">
            Secure workspace
          </p>
          <h2 className="mt-4 max-w-lg text-4xl font-semibold leading-tight">
            Ruang editorial untuk menulis dan publish dengan tenang.
          </h2>
          <p className="mt-5 max-w-md leading-7 text-stone-300">
            Dashboard menjaga alur kerja penulis tetap terpisah dari halaman
            publik yang dibaca pengunjung.
          </p>
        </div>
        <div className="grid grid-cols-3 gap-3 border-t border-white/10 pt-6">
          <LoginStat label="Session" value="8h" />
          <LoginStat label="Access" value="Admin" />
          <LoginStat label="Scope" value="Posts" />
        </div>
      </aside>
    </main>
  );
}

function LoginStat({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <div className="text-2xl font-semibold">{value}</div>
      <div className="mt-1 text-xs font-medium text-stone-400">{label}</div>
    </div>
  );
}
