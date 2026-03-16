import { v2 as cloudinary } from "cloudinary";
import { logger } from "./logger.js";

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME || "",
  api_key: process.env.CLOUDINARY_API_KEY || "",
  api_secret: process.env.CLOUDINARY_API_SECRET || "",
});

/**
 * Upload image to Cloudinary
 * @param fileBuffer - Buffer of image file
 * @param filename - Original filename
 * @returns Public URL of uploaded image
 */
export async function uploadImageToCloudinary(
  fileBuffer: Buffer,
  filename: string
): Promise<string> {
  try {
    logger.info(`Uploading image to Cloudinary: ${filename}`);

    const result = await new Promise<any>((resolve, reject) => {
      cloudinary.uploader
        .upload_stream(
          {
            folder: "expense-tracker/avatars",
            resource_type: "image",
            public_id: `avatar-${Date.now()}-${filename.split(".")[0]}`,
            transformation: [
              { width: 500, height: 500, crop: "fill" }, // Resize to 500x500
              { quality: "auto" }, // Auto optimize
            ],
          },
          (error, result) => {
            if (error) {
              reject(error);
            } else {
              resolve(result);
            }
          }
        )
        .end(fileBuffer);
    });

    logger.success(`Image uploaded successfully: ${result.secure_url}`);
    return result.secure_url;
  } catch (error) {
    logger.error(`Cloudinary upload error: ${(error as Error).message}`);
    throw new Error(`Failed to upload image: ${(error as Error).message}`);
  }
}

/**
 * Delete image from Cloudinary
 * @param publicId - Public ID of image to delete
 */
export async function deleteImageFromCloudinary(publicId: string): Promise<void> {
  try {
    await cloudinary.uploader.destroy(publicId);
    logger.success(`Image deleted from Cloudinary: ${publicId}`);
  } catch (error) {
    logger.error(`Cloudinary delete error: ${(error as Error).message}`);
    // Don't throw error for delete operation
  }
}

export { cloudinary };
