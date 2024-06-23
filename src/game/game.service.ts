import { AuthenticatedUser } from '@/auth/class/authenticated-user.class'
import { DynamoDBService } from '@/dynamodb/dynamodb.service'
import { Injectable, InternalServerErrorException } from '@nestjs/common'
import { v4 as uuidv4 } from 'uuid'
import { CreateGameDTO } from './dto/create-game.dto'
import { Game } from './interface/game.interface'
import { User } from '@/user/interface/user.interface'

@Injectable()
export class GameService {
  constructor(private readonly dynamodbService: DynamoDBService) {}

  async getGame(id: string): Promise<Game | { host: User }> {
    try {
      const game = await this.dynamodbService.getItem<Game>(id, 'Game')
      const host = await this.dynamodbService.getItem<User>(game.hostId, 'User')

      return {
        ...game,
        host
      }
    } catch (error) {
      throw new InternalServerErrorException(error)
    }
  }

  async createGame(
    user: AuthenticatedUser,
    gameDTO: CreateGameDTO
  ): Promise<void> {
    try {
      const newGame: Game = {
        id: this.generateUniqueId(),
        hostId: user.id,
        date: gameDTO.date,
        type: gameDTO.type
      }

      return await this.dynamodbService.putItem(newGame, 'Game')
    } catch (error) {
      throw new InternalServerErrorException(error)
    }
  }

  async joinGame(user: AuthenticatedUser, gameId: string): Promise<void> {
    try {
      return await this.dynamodbService.updateItem(
        'Game',
        { id: { S: gameId } },
        'SET participantId = :participantId',
        { ':participantId': { S: user.id } }
      )
    } catch (error) {
      throw new InternalServerErrorException(error)
    }
  }

  async getMyMatchedGames(user: AuthenticatedUser): Promise<Game[]> {
    try {
      const games = await this.dynamodbService.scanItems<Game>(
        'Game',
        '(hostId = :hostId OR participantId = :participantId)',
        {
          ':hostId': { S: user.id },
          ':participantId': { S: user.id }
        }
      )

      return this.transformDynamoDBItems(games)
    } catch (error) {
      throw new InternalServerErrorException(error)
    }
  }

  async getUnmatchedGames(): Promise<Game[]> {
    try {
      const games = await this.dynamodbService.scanItems<Game>(
        'Game',
        'attribute_not_exists(participantId) OR participantId = :nullValue',
        { ':nullValue': { S: '' } }
      )

      return this.transformDynamoDBItems(games)
    } catch (error) {
      throw new InternalServerErrorException(error)
    }
  }

  private generateUniqueId(): string {
    const uniqueId = uuidv4()

    return uniqueId
  }

  private transformDynamoDBItems(items: any[]): Game[] {
    return items.map((item) => ({
      id: item.id.S,
      hostId: item.hostId.S,
      date: item.date.S,
      type: item.type.S as 'Duo' | 'In-House',
      participantId: item.participantId ? item.participantId.S : undefined
    }))
  }
}
