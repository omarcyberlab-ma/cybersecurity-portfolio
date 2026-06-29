// Middleware: attach supabase auth token from incoming request to function call init
export async function attachSupabaseAuth(req: Request, init: RequestInit = {}) {
  const headers = new Headers(init.headers || {});
  const incomingAuth = req.headers.get('authorization');
  if (incomingAuth) {
    headers.set('authorization', incomingAuth);
  } else {
    // Try cookies commonly used by Supabase JS
    const cookie = req.headers.get('cookie') || '';
    const m = cookie.match(/(?:sb-access-token|supabase-auth-token)=([^;\s]+)/);
    if (m) headers.set('authorization', `Bearer ${m[1]}`);
  }
  return { req, init: { ...init, headers } };
}
