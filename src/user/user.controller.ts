import { Body, Controller, Get, Put, Req, UseGuards } from '@nestjs/common'
import { User } from './interface/user.interface'
import { UserService } from './user.service'
import { AuthGuard } from '@/auth/auth.guard'
import { AuthenticatedRequest } from '@/auth/class/authenticated-request.class'
import { UpdateUserDTO } from './dto/update-user.dto'

@Controller('user')
@UseGuards(AuthGuard)
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('profile')
  async getMyProfile(@Req() req: AuthenticatedRequest): Promise<User> {
    return await this.userService.getUser(req.user.id)
  }

  @Put('profile')
  async updateMyProfile(
    @Req() req: AuthenticatedRequest,
    @Body() userDTO: UpdateUserDTO
  ): Promise<void> {
    return await this.userService.updateUser(req.user, userDTO)
  }
}
