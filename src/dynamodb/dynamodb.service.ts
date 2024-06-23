import { Injectable, InternalServerErrorException } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import {
  DynamoDBClient,
  ScanCommand,
  UpdateItemCommand
} from '@aws-sdk/client-dynamodb'
import {
  DynamoDBDocumentClient,
  PutCommand,
  GetCommand,
  QueryCommand
} from '@aws-sdk/lib-dynamodb'

@Injectable()
export class DynamoDBService {
  private readonly dynamoDB: DynamoDBDocumentClient

  constructor(private readonly config: ConfigService) {
    let client: DynamoDBClient
    if (config.get('NODE_ENV') !== 'production') {
      client = new DynamoDBClient({
        region: config.get('DYNAMODB_RESION'),
        endpoint: config.get('DYNAMODB_ENDPOINT_URL'),
        credentials: {
          accessKeyId: config.get('DYNAMODB_ACCESS_KEY_ID'),
          secretAccessKey: config.get('DYNAMODB_SECRET_KEY')
        }
      })
    } else {
      client = new DynamoDBClient({
        region: config.get('DYNAMODB_RESION'),
        endpoint: config.get('DYNAMODB_ENDPOINT_URL')
      })
    }
    this.dynamoDB = DynamoDBDocumentClient.from(client)
  }

  async putItem(item: any, tableName: string): Promise<void> {
    try {
      await this.dynamoDB.send(
        new PutCommand({
          TableName: tableName,
          Item: item
        })
      )
    } catch (error) {
      throw new InternalServerErrorException(error)
    }
  }

  async getItem<T>(id: string, tableName: string): Promise<T> {
    try {
      const result = await this.dynamoDB.send(
        new GetCommand({
          TableName: tableName,
          Key: { id }
        })
      )

      return result.Item as T
    } catch (error) {
      console.error('Error fetching item:', error)
    }
  }

  async queryItems<T>(
    tableName: string,
    keyConditionExpression: string,
    expressionAttributeValues: { [key: string]: any }
  ): Promise<T[]> {
    try {
      const result = await this.dynamoDB.send(
        new QueryCommand({
          TableName: tableName,
          KeyConditionExpression: keyConditionExpression,
          ExpressionAttributeValues: expressionAttributeValues
        })
      )
      return result.Items as T[]
    } catch (error) {
      console.error('Error querying items:', error)
    }
  }

  async scanItems<T>(
    tableName: string,
    filterExpression: string,
    expressionAttributeValues: { [key: string]: any }
  ): Promise<T[]> {
    try {
      const result = await this.dynamoDB.send(
        new ScanCommand({
          TableName: tableName,
          FilterExpression: filterExpression,
          ExpressionAttributeValues: expressionAttributeValues
        })
      )

      return result.Items as T[]
    } catch (error) {
      throw new InternalServerErrorException(error)
    }
  }

  async updateItem(
    tableName: string,
    key: { [key: string]: any },
    updateExpression: string,
    expressionAttributeValues: { [key: string]: any }
  ): Promise<void> {
    try {
      await this.dynamoDB.send(
        new UpdateItemCommand({
          TableName: tableName,
          Key: key,
          UpdateExpression: updateExpression,
          ExpressionAttributeValues: expressionAttributeValues,
          ReturnValues: 'UPDATED_NEW'
        })
      )
    } catch (error) {
      throw new InternalServerErrorException(error)
    }
  }
}
