import { NextFunction, Request, Response } from "express";
import ErrorResponse from "../utils/error.util";
import upload from "config/cloudinary.config";
import fs from "fs";


/**
 * Upload a single image to Cloudinary
 */
export const uploadImage = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<any> => {
  try {
    // File is available on `req.file` due to Multer
    if (!req.files) {
      return next(new ErrorResponse("No file uploaded.", 400, []));
    }

    const { image } = req.files as any;
    const fileTypes = ["image/jpeg", "image/png", "image/jpg"];
    const imageSize = 1024;

    if (!fileTypes.includes(image.mimetype))
      return next(
        new ErrorResponse("Image formats supported: JPG, PNG, JPEG", 400, [])
      );

    if (image.size / 1024 > imageSize)
      return next(
        new ErrorResponse(
          `Image size should be less than ${imageSize}kb`,
          400,
          []
        )
      );

    const cloudFile = await upload(image.tempFilePath);

    fs.unlink(image.tempFilePath, (err) => {
      if (err) {
        next(new ErrorResponse("Error deleting file temp file.", 500, []));
      }
    });

    // Send success response
    res.status(200).json({
      error: false,
      errors: [],
      data: {
        url: cloudFile.url,
        secureURL: cloudFile.secure_url,
        originalFileName: cloudFile.original_filename,
        publicId: cloudFile.public_id,
      },
      message: "Image uploaded successfully",
      status: 200,
    });
  } catch (error: any) {
    return next(new ErrorResponse("Failed to upload image.", 500, []));
  }
};
