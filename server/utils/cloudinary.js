import { v2 as cloudinary } from "cloudinary";

// Debug logs to verify environment variables are loading
console.log("Cloudinary Cloud Name:", process.env.CLOUDINARY_CLOUD_NAME || "MISSING");

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export const uploadToCloudinary = (fileBuffer, folder = "automend") => {
  return new Promise((resolve, reject) => {
    if (!process.env.CLOUDINARY_CLOUD_NAME) {
      return reject(new Error("Cloudinary configuration missing: cloud_name is undefined"));
    }

    const stream = cloudinary.uploader.upload_stream(
      { folder, resource_type: "auto" },
      (error, result) => {
        if (error) {
          console.error("Cloudinary Upload Error:", error);
          reject(error);
        } else {
          resolve(result);
        }
      },
    );
    stream.end(fileBuffer);
  });
};

export default cloudinary;
