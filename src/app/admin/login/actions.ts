"use server";
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

export async function loginAction(email: string, password: string) {
  const cookieStore = await cookies();
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) =>
            cookieStore.set(name, value, options)
          );
        },
      },
    }
  );

  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    console.error("[Server Action] Login error:", error.message);
    if (error.message.includes("Email not confirmed")) {
      return { error: "Email no confirmado. Revisa tu bandeja de entrada." };
    }
    return { error: "Correo o contraseña incorrectos" };
  }

  return { success: true };
}
