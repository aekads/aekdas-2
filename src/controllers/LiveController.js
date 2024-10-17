const liveModel = require("../models/live.model");
const { Log } = require('../models/log.model');
const axios = require('axios');
const screenModel = require('../models/newScreen.model')

// Helper function to get external IP
// const getExternalIP = async () => {
//   try {
//       const response = await axios.get('https://api.ipify.org?format=json');
//       return response.data.ip;
//   } catch (error) {
//       console.error('Failed to retrieve external IP:', error);
//       return null;
//   }
// };

// // Helper function to log actions
// const logAction = async (action, message, user = null) => {
//   try {
//       const ip = await getExternalIP();    
//       const userName = user ? user.name : 'Anonymous'; // Default to 'Anonymous' if no user info
//       await Log.create({ action, message: `${message} by ${userName}`, ip });
//   } catch (error) {
//       console.error('Failed to log action:', error);
//   }
// };
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

const showAvailableScreen = async (req, res) => {
  try {
    const screens = await liveModel.showAvailableScreen();
    const screenDeviceConfig = await screenModel.screenDeviceConfig();

    res.render("selectlivescreen", { screens,screenDeviceConfig });
  } catch (error) {
    console.error("Error fetching available screens:", error);
    res.status(500).json({ message: "Failed to fetch available screens." });
  }
}; 
  
const createlive = async (req, res) => {
  const { liveName, liveDescription, liveUrls, screenIDs, pairingCodes } = req.body;
  console.log("live name", liveName);
  console.log("liveDescription", liveDescription);
  console.log("liveUrls", liveUrls);
  console.log("screenIDs ", screenIDs);
  console.log("pairingCodes ", pairingCodes);

  if (!liveName || !liveDescription || !liveUrls || !screenIDs || !pairingCodes || screenIDs.length !== pairingCodes.length) {
    return res.status(400).json({ message: "Missing or inconsistent data." });
  }

  const liveData = {
    name: liveName,
    description: liveDescription,
    live1: liveUrls.live1 || null,
    live2: liveUrls.live2 || null,
    live3: liveUrls.live3 || null,
    live4: liveUrls.live4 || null,
    live5: liveUrls.live5 || null,
    live6: liveUrls.live6 || null,
    live7: liveUrls.live7 || null,
    live8: liveUrls.live8 || null,
    live9: liveUrls.live9 || null,
    live10: liveUrls.live10 || null,
    screenID: screenIDs, // Assuming screenIDs is already an array [301648, 301649, 301651]
    pairingCode: pairingCodes, // Assuming pairingCodes is already an array ["Elec_go", "Elec_go", "Elec_go"]
  };

  try {
    await liveModel.createLive(liveData);
    await liveModel.updateScreenWithLive(screenIDs, pairingCodes, liveData);

    // Log the creation action
    // await logAction('CREATE', `Live content created: ${liveName}`, req.ip);
    const user = req.session.user; // Retrieve user from session
    await logAction(req,'CREATE Live', `Live content created: ${liveName}`, user);

    res.status(200).json({ message: "Live content published successfully!" });
  } catch (error) {
    console.error("Error publishing live content:", error);
    res.status(500).json({ message: "Failed to publish live content." });
  }
};

const showLivedata = async (req, res) => {
  try {
    const liveData = await liveModel.showliveData();
    res.render("Live", { liveData });
  } catch (error) {
    console.error("Error fetching live data table:", error);
    res.status(500).json({ message: "Failed to fetch live data table." });
  }
};

const deleteLive = async (req, res) => {
  const { liveId } = req.params;
  try {
    // Log the liveId to ensure it's received correctly
    console.log("Live ID:", liveId);

    // Fetch the screen IDs associated with the live content
    const screenIDs = await liveModel.getScreenIDsByLiveId(liveId);

    // Log the screen IDs to debug the returned result
    console.log("Screen IDs:", screenIDs);

    // Update screens to remove live content associations
    await liveModel.updateScreensWithLive(screenIDs, null); // Pass null if liveData doesn't exist

    console.log("Screens updated successfully");

    // Remove live content from the database
    const deletedLive = await liveModel.deleteLiveById(liveId);

    // Log the deletion action
    // await logAction('DELETE', `Live content deleted: ${liveId}`, req.ip);
    const user = req.session.user; // Retrieve user from session
    await logAction(req,'DELETE ', `Live content deleted: ${liveId}`, user);

    // Log the deleted live content to ensure it's deleted correctly
    console.log("Deleted Live Content:", deletedLive);

    // Respond with a success message
    res.status(200).json({ message: "Live content deleted successfully!" });
  } catch (err) {
    console.error("Error deleting live content:", err);
    res.status(500).json({ error: "Failed to delete live content" });
  }
};

const getliveDatabyId = async (req, res) => {
  const { liveId } = req.params;
  try {
    const result = await liveModel.getliveDatabyId(liveId);
    console.log(result);
  } catch (error) {
    console.error(error);
  }
};

module.exports = {
  showAvailableScreen,
  createlive,
  showLivedata,
  deleteLive,
  getliveDatabyId
};
