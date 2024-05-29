import { NextRequest, NextResponse } from 'next/server';

export function middleware(request: NextRequest) {
  // const headers = new Headers(request.headers);
  // const isHttps = headers.get('x-forwarded-proto')?.split(',')[0] === 'https';

  // if (!isHttps) {
  //   const newUrl = new URL(`http://${headers.get('host')}` || '');
  //   newUrl.protocol = 'https:';

  //   return NextResponse.redirect(
  //     new URL(
  //       `https://${headers.get('host')}${request.nextUrl.pathname}`,
  //       `http://${headers.get('host')}${request.nextUrl.pathname}`,
  //     ),
  //   );
  // }
  return NextResponse.next();
}
