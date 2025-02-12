import AWS from "aws-sdk";
import dotenv from "dotenv";

dotenv.config();

const s3 = new AWS.S3({
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    region: process.env.AWS_REGION,
});

/**
 * Upload file to S3
 */
export const uploadFileToS3 = async (
    fileBuffer: Buffer,
    fileName: string,
    fileType: string,
    isPublic: boolean
) => {
    const folder = isPublic ? "public" : "private";

    const params = {
        Bucket: process.env.S3_BUCKET_NAME!,
        Key: `${folder}/${fileName}`,
        Body: fileBuffer,
        ContentType: fileType,
    };

    return s3.upload(params).promise();
};