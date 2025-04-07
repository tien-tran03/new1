import { S3Client, CreateBucketCommand, PutObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { createS3Client } from './get-connection-aws-s3';

const bucketName = process.env.S3_BUCKET || 'sample-bucket';

const ensureBucketExists = async (s3Client: S3Client, bucketName: string) => {
  try {
    await s3Client.send(new CreateBucketCommand({ Bucket: bucketName }));
    console.log(`Bucket "${bucketName}" đã được tạo thành công.`);
  } catch (error: any) {
    if (error.name === 'BucketAlreadyOwnedByYou') {
      console.log(`Bucket "${bucketName}" đã tồn tại.`);
    } else {
      console.error('Lỗi khi tạo bucket:', error);
      throw error;
    }
  }
};

export const generateSignedUrl = async (fileName: string, fileType: string): Promise<string> => {
  const s3Client = createS3Client(process.env);

  await ensureBucketExists(s3Client, bucketName);

  try {
    const signedUrl = await getSignedUrl(
      s3Client, 
      new PutObjectCommand({
        Bucket: bucketName,
        Key: fileName,
        ContentType: fileType,
      }), 
      { expiresIn: 3600 }
    );
    return signedUrl;
  } catch (error) {
    console.error('Lỗi khi tạo signed URL:', error);
    throw new Error('Lỗi khi tạo signed URL để upload file');
  }
};

