"use server";

import { prisma } from "@/lib/prisma";
import { signIn } from "@/lib/auths/auth";
import bcrypt from "bcryptjs";
import { loginSchema } from "@/lib/validators/auth";

export type LoginFormState = {
  errors?: {
    name?: string;
    password?: string;
    general?: string;
  };
  values?: {
    name: string;
    password?: string;
  };
  success?: boolean;
};

export async function loginUser(_: unknown, formData: FormData): Promise<LoginFormState> {
  const raw = {
    name: String(formData.get("name") ?? ""),
    password: String(formData.get("password") ?? ""),
  };
  const result = loginSchema.safeParse(raw);
  if (!result.success) {
    const errors: LoginFormState["errors"] = {};
    result.error.errors.forEach((error) => {
      const field = error.path[0] as keyof typeof errors;
      errors[field] = error.message;
    });
    return { errors, values: { name: raw.name } };
  }
  const user = await prisma.user.findFirst({
    where: { name: raw.name },
  });
  if (!user) {
    return {
      errors: { general: "Invalid user name" },
      values: { name: raw.name },
    };
  }
  if (!user.password) {
    return {
      errors: { general: "Password is required" },
      values: { name: raw.name, password: raw.password },
    };
  }
  const isValid = await bcrypt.compare(raw.password, user.password);
  if (!isValid) {
    return {
      errors: { general: "Invalid password" },
      values: { name: raw.name, password: raw.password },
    };
  }

  // 4️⃣ If successful, sign in
  const res = await signIn("credentials", {
    redirect: false,
    name: raw.name,
    password: raw.password,
  });
  if (!res || res.error) {
    return {
      errors: { general: "Something went wrong. Please try again." },
      values: { name: raw.name },
    };
  }
     return { success: true };
}


export async function githubSignInAction() {
  await signIn("github", { callbackUrl: "/redirect" });
}