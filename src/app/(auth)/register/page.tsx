"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import { registerUser } from "./action";import { AuthFormState } from "@/types/auth.type";
;

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      className="bg-blue-500 text-white px-4 py-2 rounded w-full disabled:bg-gray-400"
      disabled={pending}
    >
      {pending ? "Registering..." : "Register"}
    </button>
  );
}

export default function RegisterPage() {
  const initialState: AuthFormState = {
    errors: {},
    values: { name: "", email: "", password: "", confirmPassword: "" },
  };

  const [state, formAction] = useActionState(registerUser, initialState);
  console.log("state:", state);
  return (
    <div className="flex justify-center items-center min-h-screen">
      <div className="bg-white shadow-md rounded p-6 w-full max-w-md space-y-4">
        <h1 className="text-xl font-bold text-center">Register</h1>

        {state.errors.general && (
          <p className="text-red-500">{state.errors.general}</p>
        )}

        <form action={formAction} className="space-y-4">
          <div>
            <label>Username</label>
            <input
              name="name"
              className="border p-2 w-full rounded"
              defaultValue={state.values.name}
            />
            {state.errors.name && (
              <p className="text-red-500">{state.errors.name}</p>
            )}
          </div>

          <div>
            <label>Email</label>
            <input
              name="email"
              type="email"
              className="border p-2 w-full rounded"
              defaultValue={state.values.email}
            />
            {state.errors.email && (
              <p className="text-red-500">{state.errors.email}</p>
            )}
          </div>

          <div>
            <label>Password</label>
            <input
              name="password"
              type="password"
              className="border p-2 w-full rounded"
              defaultValue={state.values.password}
            />
            {state.errors.password && (
              <p className="text-red-500">{state.errors.password}</p>
            )}
          </div>

          <div>
            <label>Confirm Password</label>
            <input
              name="confirmPassword"
              type="password"
              className="border p-2 w-full rounded"
              defaultValue={state.values.confirmPassword}
            />
            {state.errors.confirmPassword && (
              <p className="text-red-500">{state.errors.confirmPassword}</p>
            )}
          </div>

          <SubmitButton />
        </form>
      </div>
    </div>
  );
}
