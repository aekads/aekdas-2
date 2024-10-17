const library = require("../models/library.model");
const cloudinary = require("../config/cloudinaryConfig");
const { Log } = require('../models/log.model');
const axios = require('axios');


// Helper function to get external IP
const getClientIP = (req) => {
  const forwarded = req.headers['x-forwarded-for'];
  return forwarded ? forwarded.split(',')[0] : req.ip;
};

// Helper function to log actions
const logAction = async (req, action, message, user = null) => {
  try {
      const ip = getClientIP(req);
      const userName = user ? user.name : 'Anonymous'; // Default to 'Anonymous' if no user info
      await Log.create({ action, message: `${message} by ${userName}`, ip });
  } catch (error) {
      console.error('Failed to log action:', error);
  }
};

// Controller to handle logs
exports.getLogs = async (req, res) => {
  try {
      const logs = await Log.findAll({
          order: [['createdAt', 'DESC']]
      });
      res.json(logs);
  } catch (error) {
      console.error('Error fetching logs:', error);
      res.status(500).json({ message: 'Error fetching logs. Please try again.' });
  }
};

// Controller to create a new log
exports.createLog = async (req, res) => {
  const { action, message } = req.body;
  try {
      const log = await Log.create({ action, message, ip: req.ip });
      res.status(201).json(log);
  } catch (error) {
      console.error('Error creating log:', error);
      res.status(500).json({ message: 'Error creating log. Please try again.' });
  }
};



const handleUploadInDB = async (req, res) => {
  if (!req.file) {
    const errorMsg = "No file uploaded";
    await logAction('UPLOAD', errorMsg, req.ip);
    return res.status(400).send(errorMsg);
  }

  console.log(req.file);
  const fileUrl = req.file.path;
  const fileType = req.file.mimetype;
  const fileName = req.file.originalname;
  let duration;

  if (fileType.startsWith("video/")) {
    try {
      const publicId = req.file.filename;
      const result = await cloudinary.api.resource(publicId, {
        resource_type: "video",
        media_metadata: true,
      });
      duration = result.duration ? Math.ceil(result.duration) : 0;
      console.log("Duration:", result.duration);
    } catch (err) {
      console.error("Error fetching video duration from Cloudinary:", err);
      duration = 0;
    }
  }

  const fileSizeBytes = req.file.size;
  const fileSizeMB = (fileSizeBytes / (1024 * 1024)).toFixed(2);

  try {
    if (fileType.startsWith("video/")) {
      await library.uploadMediaInDB(fileUrl, fileType, fileName, duration, fileSizeMB);
    } else {
      await library.uploadMediaInDB(fileUrl, fileType, fileName, null, fileSizeMB);
    }
    const mediafiles = await library.viewMedia();
    const fileCount = await library.getmediafileCount();
    // await logAction('UPLOAD', `video uploaded: ${fileName}`, req.ip);
    const user = req.session.user; // Retrieve user from session
    await logAction(req,'UPLOAD ', `video uploaded: ${fileName}`, user);
    res.render("Library", { mediafiles: mediafiles, fileCount });
  } catch (err) {
    console.error(err);
    await logAction('UPLOAD', `Error uploading file: ${fileName}`, req.ip);
    res.status(500).send("Error uploading file");
  }
};

const handleUploadInDBForNewPlaylist = async (req, res) => {
  if (!req.file) {
    const errorMsg = "No file uploaded";
    await logAction('UPLOAD', errorMsg, req.ip);
    return res.status(400).send(errorMsg);
  }

  console.log(req.file);
  const fileUrl = req.file.path;
  const fileType = req.file.mimetype;
  const fileName = req.file.originalname;
  let duration;

  if (fileType.startsWith("video/")) {
    try {
      const publicId = req.file.filename;
      const result = await cloudinary.api.resource(publicId, {
        resource_type: "video",
        media_metadata: true,
      });
      duration = result.duration ? Math.ceil(result.duration) : 0;
      console.log("Duration:", result.duration);
    } catch (err) {
      console.error("Error fetching video duration from Cloudinary:", err);
      duration = 0;
    }
  }

  const fileSizeBytes = req.file.size;
  const fileSizeMB = (fileSizeBytes / (1024 * 1024)).toFixed(2);

  try {
    if (fileType.startsWith("video/")) {
      await library.uploadMediaInDB(fileUrl, fileType, fileName, duration, fileSizeMB);
    } else {
      await library.uploadMediaInDB(fileUrl, fileType, fileName, null, fileSizeMB);
    }
    const mediafiles = await library.viewMedia();
    const fileCount = await library.getmediafileCount();
    // await logAction('UPLOAD', `File uploaded for new playlist: ${fileName}`, req.ip);
    const user = req.session.user; // Retrieve user from session
    await logAction(req,'UPLOAD ', `File uploaded for new playlist: ${fileName}`, user);
    res.render("newPlaylist", { mediafiles: mediafiles, fileCount });
  } catch (err) {
    console.error(err);
    await logAction('UPLOAD', `Error uploading file for new playlist: ${fileName}`, req.ip);
    res.status(500).send("Error uploading file");
  }
};

const viewMedia = async (req, res) => {
  try {
    const mediafiles = await library.viewMedia();
    const fileCount = await library.getmediafileCount();
   
    res.render("Library", { mediafiles: mediafiles, fileCount });
  } catch (err) {
    console.error(err);
    
    res.status(500).send("Error viewing media");
  }
};

const viewMediaForPlaylist = async (req, res) => {
  try {
    const mediafiles = await library.viewMedia();
    const convertedMediaFiles = mediafiles.map(file => {
      const durationString = intervalToString(file.duration);
      return { ...file, durationString };
    });
   
    res.render("newPlaylist", { mediafiles: convertedMediaFiles });
  } catch (err) {
    console.error(err);
    
    res.status(500).send("Error viewing media for Playlist");
  }
};

function intervalToString(interval) {
  const hours = interval.hours ? `${interval.hours}h ` : '';
  const minutes = interval.minutes ? `${interval.minutes}m ` : '';
  const seconds = interval.seconds ? `${interval.seconds} sec` : '';
  return `${hours}${minutes}${seconds}`.trim();
}

const getPhotoes = async (req, res) => {
  try {
    const mediafiles = await library.getPhotoes();
    const fileCount = await library.getmediafileCount();
    // await logAction('Image/video', 'Add photos', req.ip);
    const user = req.session.user; // Retrieve user from session
    await logAction(req,'Image/video ', 'Add photos', user);
    res.render("Library", { mediafiles: mediafiles, fileCount });
  } catch (err) {
    console.error(err);
   
    res.status(500).send("Error viewing Photos");
  }
};

const getPhotoesForPlaylist = async (req, res) => {
  try {
    const mediafiles = await library.getPhotoes();
    await logAction('Image/video', 'Add photos', req.ip);
    res.render("newPlaylist", { mediafiles: mediafiles });
  } catch (err) {
    console.error(err);
  
    res.status(500).send("Error viewing Photos for playlist");
  }
};

const getVideos = async (req, res) => {
  try {
    const mediafiles = await library.getVideos();
    const fileCount = await library.getmediafileCount();
    res.render("Library", { mediafiles: mediafiles, fileCount });
  } catch (err) {
    console.error(err);
    res.status(500).send("Error viewing video media");
  }
};

const getVideosForPlaylist = async (req, res) => {
  try {
    const mediafiles = await library.getVideos();
    res.render("newPlaylist", { mediafiles: mediafiles });
  } catch (err) {
    console.error(err);
    await logAction('VIEW', 'Error viewing videos for playlist', req.ip);
    res.status(500).send("Error viewing video media for Playlist");
  }
};

const deleteMedia = async (req, res) => {
  const { id } = req.params;
  try {
    await library.deleteMediaById(id);
    // Optionally, delete from Cloudinary or other storage
    // await logAction('DELETE', `Media deleted with ID: ${id}`, req.ip);
    const user = req.session.user; // Retrieve user from session
    await logAction(req,'DELETE ', `Media deleted with ID: ${id}`, user);
    res.redirect('/Dashboard/Library');
  } catch (err) {
    console.error(err);
    await logAction('DELETE', `Error deleting media with ID: ${id}`, req.ip);
    res.status(500).send("Error deleting media file");
  }
};

module.exports = {
  handleUploadInDB,
  handleUploadInDBForNewPlaylist,
  viewMedia,
  getPhotoes,
  getPhotoesForPlaylist,
  getVideos,
  getVideosForPlaylist,
  deleteMedia,
  intervalToString,
  viewMediaForPlaylist
};
