import type { AuthenticatedUser } from './authenticated-user.class'
import type { Request } from 'express'

export class AuthenticatedRequest extends Request {
  user: AuthenticatedUser
}
