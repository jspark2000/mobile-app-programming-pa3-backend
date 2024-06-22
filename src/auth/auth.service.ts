import { Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import * as admin from 'firebase-admin'

@Injectable()
export class AuthService {
  private defaultApp: admin.app.App

  constructor(private readonly config: ConfigService) {
    const serviceAccountPath = this.config.get<string>(
      'FIREBASE_SERVICE_ACCOUNT_PATH'
    )
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const serviceAccount = require(serviceAccountPath)

    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount)
    })
  }

  async verifyToken(token: string) {
    try {
      return await this.defaultApp.auth().verifyIdToken(token)
    } catch (error) {
      throw new Error('Invalid token')
    }
  }
}
