import { Controller, Get, Post, Req, UseGuards } from '@nestjs/common'
import { AppService } from './app.service'
import { AuthGuard } from './auth/auth.guard'
import { AuthenticatedRequest } from './auth/class/authenticated-request.class'
import { UserService } from './user/user.service'

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private readonly userService: UserService
  ) {}

  @Get('health-check')
  healthCheck(): string {
    return this.appService.healthCheck()
  }

  @Post('check-register')
  @UseGuards(AuthGuard)
  async checkUser(@Req() req: AuthenticatedRequest): Promise<void> {
    return await this.userService.createUnregisteredUser(req.user)
  }
}
