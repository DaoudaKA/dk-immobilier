import { NextResponse, type NextRequest } from "next/server";
import { createServerClient } from "@supabase/ssr";

/** Rafraîchit la session Supabase à chaque requête et protège les pages privées. */
export async function proxy(request: NextRequest) {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key) return NextResponse.next(); // mode démo

  let response = NextResponse.next({ request });
  const supabase = createServerClient(url, key, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
        response = NextResponse.next({ request });
        cookiesToSet.forEach(({ name, value, options }) => response.cookies.set(name, value, options));
      },
    },
  });

  const { data } = await supabase.auth.getUser();
  const prive = ["/publier", "/compte", "/admin"].some((p) => request.nextUrl.pathname.startsWith(p));
  if (prive && !data.user) {
    const redirection = request.nextUrl.clone();
    redirection.pathname = "/connexion";
    redirection.searchParams.set("suite", request.nextUrl.pathname);
    return NextResponse.redirect(redirection);
  }
  return response;
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|brand|icon|apple-touch-icon|.*\\.(?:svg|png|jpg|jpeg|webp)$).*)"],
};
