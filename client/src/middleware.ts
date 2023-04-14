export {default} from 'next-auth/middleware'
export const config = {matcher: ['/', '/animals/:path*', '/api/auth/:path*', '/home/:path*', '/products/:path*']}
