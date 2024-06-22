import {
  CreateBucketCommand,
  ListBucketsCommand,
  PutBucketPolicyCommand,
  S3Client
} from '@aws-sdk/client-s3'

const main = async () => {
  const client = new S3Client({
    region: process.env.AWS_CDN_BUCKET_REGION,
    endpoint: process.env.AWS_CDN_BUCKET_URL,
    forcePathStyle: true,
    credentials: {
      accessKeyId: process.env.AWS_CDN_ACCESS_KEY || '',
      secretAccessKey: process.env.AWS_CDN_SECRET_KEY || ''
    }
  })

  const bucketName = process.env.AWS_CDN_BUCKET_NAME

  if (!bucketName) throw new Error('AWS_CDN_BUCKET_NAME is not defined')

  const bucketList = await client.send(new ListBucketsCommand({}))

  const bucketExists = bucketList.Buckets?.find(
    (bucket) => bucket.Name === bucketName
  )

  if (!bucketExists) {
    await client.send(new CreateBucketCommand({ Bucket: bucketName }))

    await client.send(
      new PutBucketPolicyCommand({
        Bucket: bucketName,
        Policy: JSON.stringify({
          Version: '2012-10-17',
          Statement: [
            {
              Sid: 'AddPerm',
              Effect: 'Allow',
              Principal: '*',
              Action: ['s3:GetObject'],
              Resource: [`arn:aws:s3:::${bucketName}/*`]
            }
          ]
        })
      })
    )
    console.log('Bucket Successfully Created: ', bucketName)
  }
}

main()
