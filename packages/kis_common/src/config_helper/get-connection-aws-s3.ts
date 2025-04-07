import { S3Client } from '@aws-sdk/client-s3';

export const createS3Client = (env: any) => {
  return new S3Client({
    region: env.AWS_REGION ?? 'us-east-1',
    endpoint: env.S3_ENDPOINT ?? 'http://localhost:9000',
    forcePathStyle: true,
    credentials: {
      accessKeyId: env.AWS_ACCESS_KEY_ID ?? 'minioadmin',
      secretAccessKey: env.AWS_SECRET_ACCESS_KEY ?? 'minioadmin123',
    }
  });
};
