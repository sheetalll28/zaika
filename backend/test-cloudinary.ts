import * as dotenv from "dotenv";
dotenv.config();
import { v2 as cloudinary } from "cloudinary";

console.log("Cloud Name:", process.env.CLOUDINARY_CLOUD_NAME);
console.log("API Key:", process.env.CLOUDINARY_API_KEY);

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME as string,
    api_key: process.env.CLOUDINARY_API_KEY as string,
    api_secret: process.env.CLOUDINARY_API_SECRET as string,
    secure: true,
});

cloudinary.api.ping((error, result) => {
    if (error) {
        console.error("Cloudinary Ping Error:", error);
    } else {
        console.log("Cloudinary Ping Success:", result);
    }
});
