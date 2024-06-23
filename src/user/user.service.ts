import { AuthenticatedUser } from '@/auth/class/authenticated-user.class'
import { DynamoDBService } from '@/dynamodb/dynamodb.service'
import { Injectable, InternalServerErrorException } from '@nestjs/common'
import { User } from './interface/user.interface'
import { UpdateUserDTO } from './dto/update-user.dto'

@Injectable()
export class UserService {
  constructor(private readonly dynamodb: DynamoDBService) {}

  async createUnregisteredUser(user: AuthenticatedUser): Promise<void> {
    try {
      const isRegistered = await this.getUser(user.id)

      if (isRegistered) return

      const newUser = {
        id: user.id,
        email: user.email
      }

      await this.dynamodb.putItem(newUser, 'User')
    } catch (error) {
      throw new InternalServerErrorException(error)
    }
  }

  async getUser(id: string): Promise<User> {
    try {
      return await this.dynamodb.getItem<User>(id, 'User')
    } catch (error) {
      throw new InternalServerErrorException(error)
    }
  }

  async updateUser(
    user: AuthenticatedUser,
    userDTO: UpdateUserDTO
  ): Promise<void> {
    try {
      return await this.dynamodb.updateItem(
        'User',
        { id: { S: user.id } },
        'SET nickname = :nickname, major = :major, sex = :sex',
        {
          ':nickname': { S: userDTO.nickname },
          ':major': { S: userDTO.major },
          ':sex': { S: userDTO.sex }
        }
      )
    } catch (error) {
      console.log(error)
      throw new InternalServerErrorException(error)
    }
  }
}
