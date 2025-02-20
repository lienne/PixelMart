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
    const key = `${folder}/${Date.now()}_${fileName}`; // Prevent overwrites

    const params = {
        Bucket: process.env.S3_BUCKET_NAME!,
        Key: key,
        Body: fileBuffer,
        ContentType: fileType,
    };

    return s3.upload(params).promise();
};

/**
 * Delete file from S3
 */
export const deleteFileFromS3 = async (fileUrl: string) => {
    try {
        const bucketName = process.env.S3_BUCKET_NAME!;

        // Extract the S3 key from the file URL
        const urlParts = new URL(fileUrl);
        const key = decodeURIComponent(urlParts.pathname.replace(`/${bucketName}/`, "").replace(/^\/+/, ""));

        if (!key) {
            console.error(`Invalid file URL: ${fileUrl}`);
            return;            
        }

        const params = {
            Bucket: bucketName,
            Key: key,
        };

        await s3.deleteObject(params).promise();
        console.log(`Deleted from S3: ${fileUrl}`);
    } catch (err) {
        console.error("Error deleting file from S3:", err);
    }
};

/**
 * Generate a pre-signed URL for downloading a purchased file
 */
export const generatePresignedUrl = async (fileKey: string): Promise<string> => {
    const params = {
        Bucket: process.env.S3_BUCKET_NAME!,
        Key: fileKey,
        Expires: 60 * 10, // URL expires in 10min
    };

    return s3.getSignedUrlPromise("getObject", params);
};