import { InternalServerError } from '@aws-sdk/client-dynamodb'
import {
  DeleteObjectCommand,
  PutObjectCommand,
  S3Client
} from '@aws-sdk/client-s3'
import { BadRequestException, Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import mime from 'mime-types'
import { v4 as uuidv4 } from 'uuid'

@Injectable()
export class StorageService {
  private readonly s3: S3Client

  constructor(private readonly configService: ConfigService) {
    if (this.configService.get('NODE_ENV') === 'production') {
      this.s3 = new S3Client()
    } else {
      this.s3 = new S3Client({
        region: this.configService.get('AWS_CDN_BUCKET_REGION'),
        endpoint: this.configService.get('AWS_CDN_BUCKET_URL'),
        forcePathStyle: true,
        credentials: {
          accessKeyId: this.configService.get('AWS_CDN_ACCESS_KEY') || '',
          secretAccessKey: this.configService.get('AWS_CDN_SECRET_KEY') || ''
        }
      })
    }
  }

  async uploadObject(
    file: Express.Multer.File,
    src: string
  ): Promise<{ src: string }> {
    try {
      const extension = this.getFileExtension(file.originalname)
      const keyWithoutExtenstion = `${src}/${this.generateUniqueImageName()}`
      const key = keyWithoutExtenstion + `${extension}`
      const fileType = this.extractContentType(file)

      await this.s3.send(
        new PutObjectCommand({
          Bucket: this.configService.get('AWS_CDN_BUCKET_NAME'),
          Key:
            this.configService.get('NODE_ENV') === 'production'
              ? keyWithoutExtenstion
              : key,
          Body: file.buffer,
          ContentType: fileType
        })
      )

      if (this.configService.get('NODE_ENV') === 'production') {
        return {
          src: keyWithoutExtenstion
        }
      } else {
        return {
          src: key
        }
      }
    } catch (error) {
      throw new InternalServerError(error)
    }
  }

  async deleteObject(src: string): Promise<{ result: string }> {
    try {
      await this.s3.send(
        new DeleteObjectCommand({
          Bucket: this.configService.get('AWS_CDN_BUCKET_NAME'),
          Key: src
        })
      )

      return { result: 'ok' }
    } catch (error) {
      throw new InternalServerError(error)
    }
  }

  private generateUniqueImageName(): string {
    const uniqueId = uuidv4()

    return uniqueId
  }

  private extractContentType(file: Express.Multer.File): string {
    if (file.mimetype) {
      return file.mimetype.toString()
    }

    return file.originalname
      ? mime.lookup(file.originalname) || 'application/octet-stream'
      : 'application/octet-stream'
  }

  private getFileExtension(filename: string): string {
    const match = filename.match(/\.[^.]+$/)

    if (match) {
      return match[0]
    }

    throw new BadRequestException('Unsupported file extension')
  }
}
