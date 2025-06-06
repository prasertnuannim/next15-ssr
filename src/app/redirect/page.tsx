import { auth } from "@/lib/auths/auth";
import { redirect } from "next/navigation";

export default async function RedirectPage() {
  const session = await auth();
  if (!session || !session.user) {
    redirect("/");
    return;
  }
  switch (session.user.role) {
    case "admin":
      redirect("/admin");
      return;
    case "user":
      redirect("/profile");
      return;
    default:
      redirect("/");
      return;
  }
}
