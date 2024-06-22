import { Global, Module } from '@nestjs/common'
import { DynamoDBService } from './dynamodb.service'

@Global()
@Module({
  providers: [DynamoDBService],
  exports: [DynamoDBService]
})
export class DynamoDBModule {}
