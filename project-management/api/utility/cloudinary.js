import {v2 as cloudinary} from 'cloudinary';


export const cloudinaryUpload = async (path) => {
    const res = await cloudinary.uploader.upload(path);
    return res.secure_url;
}

export const cloudinaryDelete = async (publicId) => {
    await cloudinary.uploader.destroy(publicId);
}

