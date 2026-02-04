// This project now uses the separate Express backend for auth.
// Frontend code calls the backend routes directly (e.g. NEXT_PUBLIC_API_URL + '/auth/logout').
// No Next.js route handlers are defined here on purpose.

export const dynamic = 'force-static';
