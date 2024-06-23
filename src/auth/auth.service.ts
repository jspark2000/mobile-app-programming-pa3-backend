import { Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import * as admin from 'firebase-admin'
import { DecodedIdToken } from 'firebase-admin/lib/auth/token-verifier'

@Injectable()
export class AuthService {
  private defaultApp: admin.app.App

  constructor(private readonly config: ConfigService) {
    const serviceAccountPath = this.config.get<string>(
      'FIREBASE_SERVICE_ACCOUNT_PATH'
    )
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const serviceAccount = require(serviceAccountPath)

    this.defaultApp = admin.initializeApp({
      credential: admin.credential.cert(serviceAccount)
    })
  }

  async verifyToken(token: string): Promise<DecodedIdToken> {
    try {
      return await admin.auth().verifyIdToken(token)
    } catch (error) {
      throw new Error('Invalid token')
    }
  }
}
