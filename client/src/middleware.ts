export {default} from 'next-auth/middleware'
export const config = {
  matcher: ['/animals/:path*', '/home/:path*', '/products/:path*', '/sales/:path*'],
}
