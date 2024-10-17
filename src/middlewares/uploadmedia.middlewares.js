const multer = require("multer");
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const cloudinary = require("../config/cloudinaryConfig");

// Configure CloudinaryStorage
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: async (req, file) => {
    console.log("file",file);
    // let folder = "others";
    // if (file.mimetype.startsWith("image/")) {
    //   folder = "images";
    // }
    // if (file.mimetype.startsWith("video/")) {
    //   folder = "videos";
    // }

    return {
      // folder: folder,
      resource_type: file.mimetype.startsWith("video/") ? "video" : "auto",
      format: file.mimetype.split("/")[1], // Use the file extension from MIME type
      //  public_id: file.originalname.split(".")[0], // Use original file name without extension
    };
  },
});

// Configure Multer upload middleware
const upload = multer({
  storage: storage,

  fileFilter: (req, file, cb) => {
    const allowedTypes = [
      // "image/jpg",
      // "image/jpeg",
      // "image/png",
      // "image/gif",
      "video/mp4",
    ];
    if (!allowedTypes.includes(file.mimetype)) {
      const error = new Error("Invalid file type");
      error.status = 400;
      return cb(error);
    }
    cb(null, true);
  },
});

module.exports = upload;
