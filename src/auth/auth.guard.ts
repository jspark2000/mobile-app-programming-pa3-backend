import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException
} from '@nestjs/common'
import { AuthService } from './auth.service'
import type { AuthenticatedRequest } from './class/authenticated-request.class'
import { AuthenticatedUser } from './class/authenticated-user.class'

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private readonly authService: AuthService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request: AuthenticatedRequest = context
      .switchToHttp()
      .getRequest<AuthenticatedRequest>()
    const authHeader = request.headers['authorization'] as string

    if (!authHeader) {
      throw new UnauthorizedException('Authorization header is missing')
    }

    const token = authHeader.split(' ')[1]

    if (!token) {
      throw new UnauthorizedException('Token is missing')
    }

    try {
      const decodedToken = await this.authService.verifyToken(token)
      const user = new AuthenticatedUser(decodedToken.uid, decodedToken.email)
      request.user = user
      return true
    } catch (error) {
      throw new UnauthorizedException('Invalid token')
    }
  }
}
