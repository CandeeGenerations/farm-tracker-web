import {withAuth} from 'next-auth/middleware'

export default withAuth({
  callbacks: {
    authorized: ({token}) => !!token,
  },
})

export const config = {
  matcher: ['/animals/:path*', '/home/:path*', '/products/:path*', '/sales/:path*'],
}
