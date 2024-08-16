const cloudinary = require('cloudinary').v2;
const upload = require('./../config/multer.config')

const uploadImage = async(req) => {
    try {
        console.log('From image service: ', req.image)
        // const result = await cloudinary.uploader.upload(req.file.path , {
        //     folder:'folder_name'
        // });
        // res.json({ 
        //     imageUrl: result.secure_url 
        // });
        console.log('URL: ', result.secure_url);
    } catch (error) {
        console.log('Error uploading image to Cloudinary', error);
    }
}

module.exports = {
    uploadImage
}