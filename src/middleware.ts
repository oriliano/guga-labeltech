import { NextResponse, type NextRequest } from 'next/server'

/**
 * Next does not expose the request path to layouts or to the not-found boundary,
 * so the path is copied into a header the server components can read. Nothing is
 * rewritten or redirected here.
 */
export const middleware = (request: NextRequest) => {
  const headers = new Headers(request.headers)
  headers.set('x-pathname', request.nextUrl.pathname)
  return NextResponse.next({ request: { headers } })
}

export const config = {
  matcher: ['/((?!admin|api|_next|favicon.ico|.*\\.[^/]+$).*)'],
}
