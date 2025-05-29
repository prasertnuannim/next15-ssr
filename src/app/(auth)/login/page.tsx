"use client";

import { useActionState, useEffect } from "react";
import { loginUser, LoginFormState } from "./action";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const initialState: LoginFormState = {
    errors: {},
    values: { email: "sert@sert.com", password: "123456" },
  };
  const router = useRouter();

  const [state, formAction] = useActionState(loginUser, initialState);
  console.log("state>> ", state)
  useEffect(() => {
    if (state.success) {
      router.replace("/profile");
    }
  }, [state.success, router]);
  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <form
        action={formAction}
        className="bg-white p-6 shadow rounded space-y-4 w-full max-w-sm"
      >
        <h1 className="text-xl font-bold text-center">Login</h1>

        <div>
          <label>Email</label>
          <input
            name="email"
            type="email"
            className="border p-2 w-full rounded"
            defaultValue={state.values?.email}
          />
          {state.errors?.email && (
            <p className="text-red-500">{state.errors.email}</p>
          )}
        </div>

        <div>
          <label>Password</label>
          <input
            name="password"
            type="password"
            className="border p-2 w-full rounded"
             defaultValue={state.values?.password}
          />
          {state.errors?.password && (
            <p className="text-red-500">{state.errors.password}</p>
          )}
        </div>
        {state.errors?.general && (
          <p className="text-red-500">{state.errors.general}</p>
        )}

        <button
          type="submit"
          className="bg-blue-500 text-white px-4 py-2 rounded w-full"
        >
          Login
        </button>
        <p className="text-center text-sm text-gray-600">
          Don&apos;t have an account?{" "}
          <Link href="/register" className="text-blue-500 hover:underline">
            Register here
          </Link>
        </p>
      </form>
    </div>
  );
}
