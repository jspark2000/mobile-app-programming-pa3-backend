import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Put,
  Req,
  UseGuards
} from '@nestjs/common'
import { GameService } from './game.service'
import { AuthGuard } from '@/auth/auth.guard'
import { Game } from './interface/game.interface'
import { User } from '@/user/interface/user.interface'
import { CreateGameDTO } from './dto/create-game.dto'
import { AuthenticatedRequest } from '@/auth/class/authenticated-request.class'

@Controller('game')
@UseGuards(AuthGuard)
export class GameController {
  constructor(private readonly gameService: GameService) {}

  @Get('matched')
  async getMatchedGames(@Req() req: AuthenticatedRequest): Promise<Game[]> {
    return await this.gameService.getMyMatchedGames(req.user)
  }

  @Get('unmatched')
  async getUnmatchedGames(): Promise<Game[]> {
    return await this.gameService.getUnmatchedGames()
  }

  @Get(':gameId')
  async getGame(
    @Param('gameId') gameId: string
  ): Promise<Game | { host: User }> {
    return await this.gameService.getGame(gameId)
  }

  @Post('')
  async createGame(
    @Body() gameDTO: CreateGameDTO,
    @Req() req: AuthenticatedRequest
  ): Promise<void> {
    return await this.gameService.createGame(req.user, gameDTO)
  }

  @Put(':gameId')
  async joinGame(
    @Param('gameId') gameId: string,
    @Req() req: AuthenticatedRequest
  ): Promise<void> {
    return await this.gameService.joinGame(req.user, gameId)
  }
}
