"use client";

import { useState } from "react";
import { logoutAction } from "@/app/login/actions";

export function LogoutButton() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        className="rounded-[8px] bg-stone-950 px-4 py-2 text-sm font-semibold text-white hover:bg-stone-800"
      >
        Logout
      </button>

      {isOpen ? (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-stone-950/55 px-5"
          role="dialog"
          aria-modal="true"
          aria-labelledby="logout-title"
        >
          <div className="w-full max-w-sm rounded-[8px] bg-white p-5 text-stone-950 shadow-xl ring-1 ring-stone-200">
            <div className="flex size-11 items-center justify-center rounded-[8px] bg-amber-100 text-lg font-semibold text-amber-800">
              !
            </div>
            <h2 id="logout-title" className="mt-4 text-xl font-semibold">
              Logout dari dashboard?
            </h2>
            <p className="mt-2 text-sm leading-6 text-stone-600">
              Sesi superadmin akan diakhiri. Kamu perlu login lagi untuk
              mengelola artikel.
            </p>

            <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:justify-end">
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="rounded-[8px] border border-stone-300 px-4 py-2 text-sm font-semibold text-stone-700 hover:border-stone-950"
              >
                Batal
              </button>
              <form action={logoutAction}>
                <button className="w-full rounded-[8px] bg-stone-950 px-4 py-2 text-sm font-semibold text-white hover:bg-stone-800 sm:w-auto">
                  Ya, Logout
                </button>
              </form>
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}
