export {default} from 'next-auth/middleware'
export const config = {matcher: ['/', '/animals/:path*', '/api/:path*', '/home/:path*', '/products/:path*']}
