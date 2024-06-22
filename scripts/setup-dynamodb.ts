import {
  CreateTableCommand,
  ScalarAttributeType,
  KeyType,
  DynamoDBClient
} from '@aws-sdk/client-dynamodb'
import { DynamoDBDocumentClient } from '@aws-sdk/lib-dynamodb'

const main = async () => {
  /** Connect to DynamoDB */
  const client = new DynamoDBClient({
    region: process.env.DYNAMODB_RESION,
    endpoint: process.env.DYNAMODB_ENDPOINT_URL,
    credentials: {
      accessKeyId: process.env.DYNAMODB_ACCESS_KEY_ID,
      secretAccessKey: process.env.DYNAMODB_SECRET_KEY
    }
  })

  const dynamoDB = DynamoDBDocumentClient.from(client)

  /** Create User Table */
  const userTableParams = {
    TableName: 'User',
    KeySchema: [{ AttributeName: 'id', KeyType: 'HASH' as KeyType }],
    AttributeDefinitions: [
      { AttributeName: 'id', AttributeType: 'S' as ScalarAttributeType }
    ],
    ProvisionedThroughput: {
      ReadCapacityUnits: 5,
      WriteCapacityUnits: 5
    }
  }

  try {
    await dynamoDB.send(new CreateTableCommand(userTableParams))
  } catch (error) {
    if (error.name === 'ResourceInUseException') {
      console.log('Table already exists')
    } else {
      console.error('Error creating table:', error)
    }
  }

  /** Create Game Table */
  const gameTableParams = {
    TableName: 'Game',
    KeySchema: [{ AttributeName: 'id', KeyType: 'HASH' as KeyType }],
    AttributeDefinitions: [
      { AttributeName: 'id', AttributeType: 'S' as ScalarAttributeType }
    ],
    ProvisionedThroughput: {
      ReadCapacityUnits: 5,
      WriteCapacityUnits: 5
    }
  }

  try {
    await dynamoDB.send(new CreateTableCommand(gameTableParams))
  } catch (error) {
    if (error.name === 'ResourceInUseException') {
      console.log('Table already exists')
    } else {
      console.error('Error creating table:', error)
    }
  }
}

main()
