import { Module } from '@nestjs/common'
import { AppController } from './app.controller'
import { AppService } from './app.service'
import { UserModule } from './user/user.module'
import { GameModule } from './game/game.module'
import { AuthModule } from './auth/auth.module'
import { ConfigModule } from '@nestjs/config'
import { DynamoDBModule } from './dynamodb/dynamodb.module'
import { StorageModule } from './storage/storage.module'

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true
    }),
    UserModule,
    GameModule,
    AuthModule,
    DynamoDBModule,
    StorageModule
  ],
  controllers: [AppController],
  providers: [AppService]
})
export class AppModule {}
