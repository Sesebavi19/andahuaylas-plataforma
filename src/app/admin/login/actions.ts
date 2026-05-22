"use server";
import { redirect } from "next/navigation";
import { createClient } from "@/utils/supabase/server";

export async function login(formData: FormData) {
  const supabase = await createClient();
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    const msg = error.message.includes("Email not confirmed")
      ? "Email no confirmado. Revisa tu bandeja de entrada."
      : "Correo o contraseña incorrectos";
    redirect(`/admin/login?error=${encodeURIComponent(msg)}`);
  }

  redirect("/admin/dashboard");
}
