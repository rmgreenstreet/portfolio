if (process.env.NODE_ENV !== 'production') require('dotenv').config()
const crypto = require('crypto');
const cloudinary = require('cloudinary');
const cloudinaryStorage = require('multer-storage-cloudinary');

//configure cloudinary upload settings
cloudinary.config({
    cloud_name: 'rgreenstreet',
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});


const storage = cloudinaryStorage({
    cloudinary: cloudinary,
    folder: ('portfolio/'+process.env.CLOUDINARY_FOLDER+'projects'),
    allowedFormats: ['jpeg', 'jpg', 'png'],
    filename: function (req, file, cb) {
        let buf = crypto.randomBytes(16);
        buf = buf.toString('hex');
        let uniqFileName = file.originalname.replace(/\.jpeg|\.jpg|\.png/ig, '');
        uniqFileName += buf;
      cb(undefined, uniqFileName );
    }
  });

async function imageDelete(public_id, project) {
    //remove image from cloudinary
    await cloudinary.uploader.destroy(public_id);
    // delete image from post.images array
    for(const image of project.images) {
        if(image.public_id === public_id) {
            project.images.splice(project.images.indexOf(image), 1);
        }
    }
}
  
  module.exports = {
      cloudinary,
      storage,
      imageDelete
  }