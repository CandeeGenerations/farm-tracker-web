import {withAuth} from 'next-auth/middleware'

export default withAuth

export const config = {
  matcher: ['/animals/:path*', '/home/:path*', '/products/:path*', '/sales/:path*'],
}
