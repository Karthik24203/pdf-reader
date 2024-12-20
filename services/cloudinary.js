import { v2 as cloudinary } from "cloudinary";

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

/**
 * Uploads a file to Cloudinary
 * @param {string} file - The base64 file string (e.g., `data:<file_type>;base64,<base64_content>`)
 * @param {string} folder - The folder in Cloudinary where the file will be stored
 * @returns {Promise<Object>} - Returns the Cloudinary upload result
 */
export const uploadToCloudinary = async (file) => {
  try {
    const uploadResult = await cloudinary.uploader.upload(file, {
      folder:"pdf-reader",
      resource_type: "auto", // Automatically detect file type (image, video, etc.)
    });
    return uploadResult;
  } catch (error) {
    throw new Error(`Cloudinary upload failed: ${error.message}`);
  }
};
