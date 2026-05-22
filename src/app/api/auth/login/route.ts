import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";

export async function POST(request: NextRequest) {
  const formData = await request.formData();
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  if (!email || !password) {
    const url = new URL("/admin/login", request.url);
    url.searchParams.set("error", "Ingresa correo y contraseña");
    return NextResponse.redirect(url, 303);
  }

  const cookiesToApply: Array<{
    name: string;
    value: string;
    options?: Record<string, unknown>;
  }> = [];

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach((c) => cookiesToApply.push(c));
        },
      },
    }
  );

  const { error } = await supabase.auth.signInWithPassword({ email, password });

  if (error) {
    const url = new URL("/admin/login", request.url);
    const msg = error.message.includes("Email not confirmed")
      ? "Email no confirmado. Revisa tu bandeja de entrada."
      : "Correo o contraseña incorrectos";
    url.searchParams.set("error", msg);
    return NextResponse.redirect(url, 303);
  }

  const dashboardUrl = new URL("/admin/dashboard", request.url);
  const response = NextResponse.redirect(dashboardUrl, 303);
  cookiesToApply.forEach(({ name, value, options }) => {
    response.cookies.set(name, value, options);
  });
  return response;
}
