import dotenv, { config, } from "dotenv";
import {v2 as cloudinary} from "cloudinary"

dotenv.config();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const upload = async (file: any) => {
  const image = await cloudinary.uploader.upload(
    file,
    { folder: "cohut" },
    (result: any) => result
  );
  return image;
};

// console.log(upload)
// const optimizeUrl = cloudinary.url('cohort', {
//     fetch_format: 'auto',
//     quality: 'auto'
// });
// console.log(optimizeUrl);
// const autoCropUrl = cloudinary.url('cohort', {
//     crop: 'auto',
//     gravity: 'auto',
//     width: 500,
//     height: 500,
// });
// console.log(autoCropUrl);   

export default upload;