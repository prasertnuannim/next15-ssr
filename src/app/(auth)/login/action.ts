"use server";

import { prisma } from "@/lib/prisma";
import { signIn } from "@/lib/auth";
import bcrypt from "bcryptjs";
import { loginSchema } from "@/lib/validators/auth";

export type LoginFormState = {
  errors?: {
    email?: string;
    password?: string;
    general?: string;
  };
  values?: {
    email: string;
    password?: string;
  };
  success?: boolean;
};

export async function loginUser(_: unknown, formData: FormData): Promise<LoginFormState> {
  const raw = {
    email: String(formData.get("email") ?? ""),
    password: String(formData.get("password") ?? ""),
  };

  // 1️⃣ Zod validation
  const result = loginSchema.safeParse(raw);
  if (!result.success) {
    const errors: LoginFormState["errors"] = {};
    result.error.errors.forEach((error) => {
      const field = error.path[0] as keyof typeof errors;
      errors[field] = error.message;
    });
    return { errors, values: { email: raw.email } };
  }

  // 2️⃣ Check if user exists
  const user = await prisma.user.findUnique({
    where: { email: raw.email },
  });
  if (!user) {
    return {
      errors: { general: "Invalid email address" },
      values: { email: raw.email },
    };
  }

  // 3️⃣ Check password
  if (!user.password) {
    return {
      errors: { general: "Password is required" },
      values: { email: raw.email },
    };
  }
  const isValid = await bcrypt.compare(raw.password, user.password);
  if (!isValid) {
    return {
      errors: { general: "Invalid password" },
      values: { email: raw.email },
    };
  }

  // 4️⃣ If successful, sign in
  const res = await signIn("credentials", {
    redirect: false,
    email: raw.email,
    password: raw.password,
  });

  if (!res || res.error) {
    return {
      errors: { general: "Something went wrong. Please try again." },
      values: { email: raw.email },
    };
  }

  // Success
     return { success: true };


}
