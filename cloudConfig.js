//requiring cloudinary library version 2.

const cloudinary = require('cloudinary').v2;

//requiring multer-storage-cloudinary library for the cloudinaryStorage.

const { CloudinaryStorage } = require('multer-storage-cloudinary');

//passing cloudinary configuration details for giving backend access to the cloudinary.

cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.CLOUD_API_KEY,
    api_secret: process.env.CLOUD_API_SECRET
});

//defining storage to store the files.
//the storage is defined as a function which takes the req, file and cb as parameters.
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'roomrover_DEV',
    allowedFormats: ["png","jpg","jpeg","ico"],
  },
});

//exporting cloudinary and storage.
module.exports = {
    cloudinary,
    storage,
}