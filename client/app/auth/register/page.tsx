import { Register } from "@/src/_pages/auth";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export default async function RegisterPage() {
  const cookieStore = await cookies();

  if (cookieStore.has("auth_token")) {
    redirect("/dashboard");
  }

  return <Register />
}