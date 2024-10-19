const playlists = require("../models/playlists.model");
const groupScreen = require("../models/groupScreen.model");
const screenModel = require("../models/newScreen.model");
const library = require("../models/library.model");
const { json } = require("express");
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


const createPlaylist = async (req, res) => {
  try {
    const { urls, screenIDs, playlistName, playlistDescription } = req.body;

    // Create playlist object
    const playlistData = {
      screenIDs,
      playlistName,
      playlistDescription,
      urls,
    };

    // Call model function to save playlist
    const newPlaylist = await playlists.createPlaylist(playlistData);
    await playlists.updateScreensWithPlaylist(screenIDs, playlistName, playlistDescription, urls);

    // Log the create playlist action
    // await logAction('createPlaylist', `Playlist created: ${playlistName}`, req.ip);
    // const user = req.session.user; // Retrieve user from session
    // await logAction('createPlaylist',`Playlist created: ${playlistName}`, user);
    const user = req.session.user; // Retrieve user from session
await logAction(req, 'createPlaylist', `Playlist created: ${playlistName}`, user);




    // Respond with the newly created playlist
    res.status(201).json({
      message: "Playlist created successfully",
      playlist: newPlaylist,
    });
  } catch (err) {
    console.error("Error creating playlist:", err);
    res.status(500).json({ error: "Failed to create playlist" });
  }
};

const editPlaylist = async (req, res) => {
  try {
    const { playlistId, urls, screenIDs, playlistName, playlistDescription } = req.body;

    // Create playlist object
    const playlistData = {
      playlistId,
      screenIDs,
      playlistName,
      playlistDescription,
      urls,
    };

    // Call model function to update playlist
    const updatedPlaylist = await playlists.editPlaylist(playlistData);

    // Update screens with the new playlist
    await playlists.updateScreensWithPlaylist(screenIDs, playlistName, playlistDescription, urls);

    // Log the edit playlist action
    // await logAction('editPlaylist', `Playlist edited: ${playlistName}`, req.ip);
    const user = req.session.user; // Retrieve user from session
    await logAction(req,'editPlaylist',`Playlist edited: ${playlistName}`, user);

    // Respond with the updated playlist
    res.status(200).json({
      message: "Playlist updated successfully",
      playlist: updatedPlaylist,
    });
  } catch (err) {
    console.error("Error updating playlist:", err);
    res.status(500).json({ error: "Failed to update playlist" });
  }
};

const showPlaylist = async (req, res) => {
  try {
    const playlistsData = await playlists.viewPlaylist();
    res.render('Playlist', { playlists: playlistsData });
  } catch (error) {
    console.error("Controller showPlaylist error", error);
    res.status(500).send("Error retrieving playlists");
  }
};

const showAvailableScreen = async (req, res) => {
  const screens = await screenModel.getNotdeletedScreen();
  res.render("selectionNewPlaylist", { screens });
};

const showAvailableScreenForEditPlaylist = async (req, res) => {
  const playlistsAll = await playlists.viewPlaylist();
  const screens = await screenModel.getNotdeletedScreen();
  res.render("EditselectionPlaylist", { screens, playlistsAll });
};

const getPlaylistById = async (req, res) => {
  const playlistId = req.params.playlistId;
  try {
    const playlist = await playlists.getPlaylistById(playlistId);
    const mediafiles = await library.viewMedia();
    const convertedMediaFiles = mediafiles.map(file => {
      const durationString = intervalToString(file.duration);
      return { ...file, durationString };
    });
    res.render('newEditPlaylist', { playlist, mediafiles: convertedMediaFiles });
  } catch (error) {
    console.error('Error fetching playlist:', error);
    res.status(500).send('Internal Server Error');
  }
};

function intervalToString(interval) {
  const hours = interval.hours ? `${interval.hours}h ` : '';
  const minutes = interval.minutes ? `${interval.minutes}m ` : '';
  const seconds = interval.seconds ? `${interval.seconds} sec` : '';
  return `${hours}${minutes}${seconds}`.trim();
}


const deletePlaylist = async (req, res) => {
  try {
    const { playlistId } = req.params;

    // Log the playlistId to ensure it's received correctly
    console.log("Playlist ID:", playlistId);

    // Fetch the screen IDs associated with the playlist
    const screenIDs = await playlists.getScreenIDsByPlaylistId(playlistId);

    // Log the screen IDs to debug the returned result
    console.log("Screen IDs:", screenIDs);

    // Update screens to remove playlist associations
    await playlists.deleteScreensWithPlaylist(screenIDs);
    // await logAction('deletePlaylist', `Playlist deleted: ${playlistId}`, req.ip);
    const user = req.session.user; // Retrieve user from session
    await logAction(req,'deletePlaylist', `Playlist deleted: ${playlistId}`, user);

    
    console.log("Screens updated successfully");       

    // Remove playlist from the database
    const deletedPlaylist = await playlists.deletePlaylistById(playlistId);

    // Log the deleted playlist to ensure it's deleted correctly
    console.log("Deleted Playlist:", deletedPlaylist);

    // Respond with the deleted playlist
    res.redirect('/Dashboard/Playlist');
  } catch (err) {
    console.error("Error deleting playlist:", err);
    res.status(500).json({ error: "Failed to delete playlist" });
  }
};








// const deleteScreenidsFromPlaylist = async (req, res) => {
//   const { screenID } = req.params;
// console.log(" strat of the deleteScreenidsFromPlaylist ");

//   try {
//     // Fetch all playlists related to the screenID
//     const playlistsAll = await playlists.searchScreenidandRemove(screenID);
// console.log("searchScreenidandRemove",playlistsAll);

//     // Return the playlists data in JSON format
//     res.json({
//       success: true,
//       message: 'Screen IDs retrieved successfully',
//       data: playlistsAll,
//     });
//   } catch (error) {
//     res.status(500).json({
//       success: false,
//       message: 'Error retrieving screen IDs',
//       error: error.message,
//     });
//   }
// };

// Controller function for deleting screen ID from playlists
const deleteScreenidsFromPlaylist = async (req, res) => {
  console.log("Start of the deleteScreenidsFromPlaylist function");

  const { screenID } = req.params;

  try {
    // Fetch all playlists related to the screenID and remove the screenID
    const playlistsAll = await playlists.searchScreenidandRemove(screenID);
    console.log("searchScreenidandRemove", playlistsAll);

    // Return the playlists data in JSON format
    res.json({
      success: true,
      message: 'Screen ID removed successfully from all playlists',
      data: playlistsAll,
    });
  } catch (error) {
    // Return error response in case of failure
    res.status(500).json({
      success: false,
      message: 'Error removing screen ID from playlists',
      error: error.message,
    });
  }
};



module.exports = { createPlaylist, showPlaylist, showAvailableScreen, getPlaylistById, 
  showAvailableScreenForEditPlaylist, editPlaylist, deletePlaylist,deleteScreenidsFromPlaylist };






