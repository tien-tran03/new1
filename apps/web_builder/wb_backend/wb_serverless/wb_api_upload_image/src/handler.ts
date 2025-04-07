import { APIGatewayProxyHandler } from 'aws-lambda';
import { generateSignedUrl } from '@kis/common';
import { UploadImageEntity } from '@kis/wb-data/dist/entities';
import { verifyUserAndInitializeDB } from "@kis/wb-api-services/dist/verify-user-and-initialize-db";

export const handler: APIGatewayProxyHandler = async (event) => {
  const { decoded, appDataSource } = await verifyUserAndInitializeDB(event);

  let bodyData;
  if (typeof event.body === 'string') {
    try {
      bodyData = JSON.parse(event.body);
    } catch (error) {
      console.error('Error parsing JSON body:', error);
      return {
        statusCode: 400,
        body: JSON.stringify({ message: 'Invalid JSON body' }),
      };
    }
  } else {
    bodyData = event.body;
  }

  console.log('Received body data:', bodyData);

  const { fileName, fileType } = bodyData;

  if (!fileName || !fileType) {
    return {
      statusCode: 400,
      body: JSON.stringify({
        message: 'Missing fileName or fileType in request body',
      }),
    };
  }

  let signedUrl;
  try {
    signedUrl = await generateSignedUrl(fileName, fileType);
    console.log('Generated signed URL:', signedUrl);
  } catch (error) {
    console.error('Error generating signed URL:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({
        message: 'Error generating signed URL for file upload',
      }),
    };
  }
  const shortUrl = signedUrl.split('?')[0];
  const fileSize = 0;
 
  const imageRepository = appDataSource.getRepository(UploadImageEntity);
  const image = new UploadImageEntity();
  image.fileName = fileName;
  image.fileType = fileType;
  image.filePath = shortUrl;
  image.fileSize = fileSize;
  image.uploadedBy = decoded.userId;
  image.uploadedAt = new Date();

  try {
    await imageRepository.save(image);
    return {
      statusCode: 200,
      body:
      signedUrl,
      shortUrl,
      imageId: image.id,
      fileName: image.fileName,
    };
  } catch (error) {
    console.error('Error saving image metadata:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({
        message: 'Error saving image data to the database',
      }),
    };
  }
};