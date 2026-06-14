"use client";

import { useActionState } from "react";
import { loginAction, type LoginState } from "./actions";

const initialState: LoginState = {};

export function LoginForm() {
  const [state, formAction, isPending] = useActionState(
    loginAction,
    initialState,
  );

  return (
    <form action={formAction} className="mt-8 space-y-4">
      <div>
        <label
          htmlFor="username"
          className="text-sm font-semibold text-stone-700"
        >
          Username
        </label>
        <input
          id="username"
          name="username"
          type="text"
          required
          autoComplete="username"
          className="mt-2 h-12 w-full rounded-[8px] border border-stone-300 bg-white px-4 text-stone-950 outline-none focus:border-emerald-700 focus:ring-4 focus:ring-emerald-100"
          placeholder="Masukkan username"
        />
      </div>

      <div>
        <label
          htmlFor="password"
          className="text-sm font-semibold text-stone-700"
        >
          Password admin
        </label>
        <input
          id="password"
          name="password"
          type="password"
          required
          autoComplete="current-password"
          className="mt-2 h-12 w-full rounded-[8px] border border-stone-300 bg-white px-4 text-stone-950 outline-none focus:border-emerald-700 focus:ring-4 focus:ring-emerald-100"
          placeholder="Masukkan password"
        />
      </div>

      {state.error ? (
        <p className="rounded-[8px] bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
          {state.error}
        </p>
      ) : null}

      <button
        type="submit"
        disabled={isPending}
        className="h-12 w-full rounded-[8px] bg-emerald-700 px-5 text-sm font-semibold text-white hover:bg-emerald-800 disabled:cursor-not-allowed disabled:bg-stone-400"
      >
        {isPending ? "Memeriksa..." : "Masuk Dashboard"}
      </button>
    </form>
  );
}
