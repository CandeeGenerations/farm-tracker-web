import {authOptions} from '@/pages/api/auth/[...nextauth]'
import {NextApiRequest, NextApiResponse} from 'next'
import {getServerSession} from 'next-auth/next'

const getUserEmail = async (req: NextApiRequest, res: NextApiResponse): Promise<string | undefined> => {
  const impersonatorEmail = req.query.email as string | undefined

  if (impersonatorEmail) {
    return impersonatorEmail
  }

  const session = await getServerSession(req, res, authOptions)

  return session ? session.user.email : undefined
}

export {getUserEmail}
