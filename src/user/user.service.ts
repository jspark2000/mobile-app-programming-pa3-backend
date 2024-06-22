import { DynamoDBService } from '@/dynamodb/dynamodb.service'
import { Injectable } from '@nestjs/common'

@Injectable()
export class UserService {
  constructor(private readonly dynamodb: DynamoDBService) {}
}
