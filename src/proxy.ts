import { createServerClient } from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server';

export async function proxy(request: NextRequest) {
  // -------- LOGIN POST --------
  if (
    request.nextUrl.pathname === '/admin/login' &&
    request.method === 'POST'
  ) {
    const formData = await request.formData();
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;

    if (!email || !password) {
      const url = new URL('/admin/login', request.url);
      url.searchParams.set('error', 'Ingresa correo y contraseña');
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

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      const url = new URL('/admin/login', request.url);
      const msg = error.message.includes('Email not confirmed')
        ? 'Email no confirmado. Revisa tu bandeja de entrada.'
        : 'Correo o contraseña incorrectos';
      url.searchParams.set('error', msg);
      return NextResponse.redirect(url, 303);
    }

    const dashboardUrl = new URL('/admin/dashboard', request.url);
    const response = NextResponse.redirect(dashboardUrl, 303);
    cookiesToApply.forEach(({ name, value, options }) => {
      response.cookies.set(name, value, options);
    });
    return response;
  }

  // -------- AUTH CHECK para GET /admin/* --------
  let supabaseResponse = NextResponse.next({ request });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value)
          );
          supabaseResponse = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (
    request.nextUrl.pathname.startsWith('/admin') &&
    !request.nextUrl.pathname.startsWith('/admin/login')
  ) {
    if (!user) {
      const url = request.nextUrl.clone();
      url.pathname = '/admin/login';
      return NextResponse.redirect(url);
    }

    const { data: adminUser } = await supabase
      .from('admin_users')
      .select('id, rol')
      .eq('id', user.id)
      .single();

    if (!adminUser) {
      const url = request.nextUrl.clone();
      url.pathname = '/admin/login';
      return NextResponse.redirect(url);
    }
  }

  return supabaseResponse;
}

export const config = {
  matcher: ['/admin/:path*'],
};
