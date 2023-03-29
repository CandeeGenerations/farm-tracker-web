import {Request, Response} from 'express'
import {IException} from '../types/logger'
import {logError} from './logger'

export const handleError = (res: Response, error: IException): Response => {
  logError(error.message, error)

  return res.status(500).send({code: 500, error: `${error.name}: ${error.message}`})
}

export const handleSuccess = (res: Response, data?: any): Response => res.status(200).send({code: 200, data})

export const getEmail = (req: Request, res: Response): string => {
  const email = req.header('email')

  if (!email) {
    res.status(401)
    return ''
  }

  return email as string
}

export const generateString = (
  length = 6,
  includeUpperCharacters = false,
  includeSpecialCharacters = false,
): string => {
  let result = ''
  let characters = 'abcdefghijklmnopqrstuvwxyz'

  if (includeUpperCharacters) {
    characters = `${characters}ABCDEFGHIJKLMNOPQRSTUVWXYZ`
  }

  if (includeSpecialCharacters) {
    characters = `${characters}0123456789!@#$%^&*()_+-=[];",./{}|:<>?`
  }

  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * characters.length))
  }

  return result
}
