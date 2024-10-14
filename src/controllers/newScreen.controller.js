// const { json } = require("express");
// const screen = require("../models/newScreen.model");
// const dotenv = require("dotenv");

// dotenv.config();

// const addScreen = async (req, res) => {
//   const {
//     pairingCode,
//     screenName,
//     tags,
//     location,
//     city,
//     state,
//     country,
//     pincode,
//   } = req.body;
//   try {
//     if (pairingCode.length > 6) {
//       return res.render("Screen", {
//         message:
//           "Your pairing code is incorrect. It must be 6 characters or less.",
//         screens: [],
//         screenCount: 0,
//         onlineScreen: 0,
//         offlineScreen: 0,
//         groupscreen: 0,
//         deletedScreens: 0,
//       });
//     }

//     const existingScreen = await screen.screenByPairingCode(pairingCode);
//     if (existingScreen.length > 0) {
//       const allScreens = await screen.getNotdeletedScreen();
//       const screenCount = await screen.getTotalScreenCount();
//       const onlineScreen = await screen.getNotDeletedScreenCount();
//       const offlineScreen = await screen.getDeletedScreenCount();
//       const deletedScreens = await screen.getDeletedScreen(); // Fetch deleted screens
//       const groupscreen = await screen.getGroupScreen();

//       return res.render("Screen", {
//         message: "Screen with this Pairing Code already exists",
//         screens: allScreens,
//         screenCount,
//         onlineScreen,
//         offlineScreen,
//         deletedScreens,
//         groupscreen,
//       });
//     }

//     await screen.newScreen(
//       pairingCode,
//       screenName,
//       tags,
//       location,
//       city,
//       state,
//       country,
//       pincode
//     );
//     const screenCount = await screen.getTotalScreenCount();
//     const onlineScreen = await screen.getNotDeletedScreenCount();
//     const offlineScreen = await screen.getDeletedScreenCount();
//     // const allScreens = await screen.getAllScreens();
//     const allScreens = await screen.getNotdeletedScreen();

//     const deletedScreens = await screen.getDeletedScreen(); // Fetch deleted screens
//     const groupscreen = await screen.getGroupScreen();

//     res.render("Screen", {
//       message: "Successfully registered Screen",
//       screens: allScreens,
//       screenCount,
//       onlineScreen,
//       offlineScreen,
//       deletedScreens,
//       groupscreen,
//     });
//   } catch (error) {
//     console.error(error);
//     res.status(500).send("Add Screen error");
//   }
// };

// const getAllScreens = async (req, res) => {
//   try {
//     // const allScreens = await screen.getAllScreens(); // Fetch all screens
//     const allScreens = await screen.getNotdeletedScreen();

//     const onlineScreen = await screen.getNotDeletedScreenCount();
//     const screenCount = await screen.getTotalScreenCount();
//     const offlineScreen = await screen.getDeletedScreenCount();
//     const deletedScreens = await screen.getDeletedScreen(); // Fetch deleted screens
//     const groupscreen = await screen.getGroupScreen();
//     res.render("Screen", {
//       message: null,
//       screens: allScreens,
//       screenCount,
//       onlineScreen,
//       offlineScreen,deletedScreens,
//       groupscreen,
//     });
//   } catch (error) {
//     console.error("Error fetching all screens:", error);
//     res.status(500).send("Error fetching screens");
//   }
// };

// const getAllScreensAllData = async (req, res) => {
//   try {
//     const allScreens = await screen.getAllScreens(); // Assuming this function fetches all screens

//     // Assuming you want to send allScreens as JSON
//     res.json(allScreens);
//   } catch (error) {
//     console.error("Error fetching all screens:", error);
//     res.status(500).send("Error fetching screens");
//   }
// };



// const getNotdeletedScreen = async (req, res) => {
//   try {
//     const notDeletedScreen = await screen.getNotdeletedScreen(); // Fetch not deleted screens

//     res.render("Screen", {
//       message: null,
//       screens: notDeletedScreen,
//     });
//   } catch (error) {
//     console.error("Error fetching screens:", error);
//     res.status(500).send("Error fetching screens");
//   }
// };

// const updateDeleteScreen = async (req, res) => {
//   const { pairingCode } = req.body;

//   try {
//     await screen.updateDeleteScreen(pairingCode);
//     res.sendStatus(204); // No Content status code indicates successful deletion
//   } catch (error) {
//     console.error(error);
//     res.status(500).send("Error deleting screen");
//   }
// };

// const editScreen = async (req, res) => {
//   const {
//     pairingCode,
//     screenName,
//     tags,
//     location,
//     city,
//     state,
//     country,
//     pincode,
//   } = req.body;

//   try {
//     await screen.editScreen(
//       pairingCode,
//       screenName,
//       tags,
//       location,
//       city,
//       state,
//       country,
//       pincode
//     );
//     const offlineScreen = await screen.getDeletedScreenCount();
//     const deletedScreens = await screen.getDeletedScreen(); // Fetch deleted screens
//     const groupscreen = await screen.getGroupScreen();

//     const screenCount = await screen.getTotalScreenCount();
//     const onlineScreen = await screen.getNotDeletedScreenCount();
//     // const allScreens = await screen.getAllScreens(); // Fetch updated not deleted screens
//     const allScreens = await screen.getNotdeletedScreen();

//     res.render("Screen", {
//       message: "Screen edited successfully",
//       screens: allScreens,
//       offlineScreen,
//       screenCount,
//       onlineScreen,
//       deletedScreens,
//       groupscreen,
//     });
//   } catch (error) {
//     console.error(error);
//     res.status(500).send("Error editing screen");
//   }
// };

// const screenByPairingCode = async (req, res) => {
//   const { pairingCode } = req.params;
//   try {
//     const screenData = await screen.screenByPairingCode(pairingCode);
//     if (screenData.length === 0) {
//       return res.status(404).json({ message: "Screen not found" });
//     }
//     res.json(screenData[0]);
//   } catch (error) {
//     console.error("Error fetching screen:", error);
//     res.status(500).send("Error fetching screen");
//   }
// };



// const restoreScreen = async (req, res) => {
//   const { pairingCode } = req.body;
//   try {
//     const restoredScreen = await screen.restoreScreenInDB(pairingCode);
//     res.json({ success: true, screen: restoredScreen });
//   } catch (error) {
//     console.log(error);
//     res.status(500).json({ success: false, message: "Error restoring screen" });
//   }
// };

// const deletePlaylist = async (req, res) => {
//   const { screenid } = req.params;
// console.log("screenid",screenid);
//   try {
//   const response= await screen.deletePlaylist(screenid);

//     res.json(response);
//   } catch (error) {
//     console.error("Error deleting playlist:", error);
//     res.status(500).json({ error: "Failed to delete playlist" });
//   }
// };
// module.exports = {
//   addScreen,
//   getAllScreens,
//   getNotdeletedScreen,
//   updateDeleteScreen,
//   editScreen,
//   screenByPairingCode,
//   // getDeletedScreens,
//   // showGroupScreen,
//   restoreScreen,
//   getAllScreensAllData,
//   deletePlaylist
// };



const { json } = require("express");
const screen = require("../models/newScreen.model");
const dotenv = require("dotenv");
const { Log } = require('../models/log.model'); // Adjust the path if needed
const axios = require('axios');

dotenv.config();

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



// Add a new screen
const addScreen = async (req, res) => {
    const {
        pairingCode,
        screenName,
        tags,
        location,
        city,
        state,
        country,
        pincode,
    } = req.body;
    try {
        if (pairingCode.length > 6) {
            await logAction('addScreen', 'Failed to add screen: pairing code too long');
            return res.render("Screen", {
                message: {
                    type: "error",
                    text: "Your pairing code is incorrect. It must be 6 characters or less.",
                },
                screens: [],
                screenCount: 0,
                onlineScreen: 0,
                offlineScreen: 0,
                groupscreen: 0,
                deletedScreens: 0,
                screenStatus:0
            });
        }

        const existingScreen = await screen.screenByPairingCode(pairingCode);
        if (existingScreen.length > 0) {
            const allScreens = await screen.getNotdeletedScreen();
            const screenCount = await screen.getTotalScreenCount();
            const onlineScreen = await screen.getNotDeletedScreenCount();
            const offlineScreen = await screen.getDeletedScreenCount();
            const deletedScreens = await screen.getDeletedScreen();
            const groupscreen = await screen.getGroupScreen();
          const  screenStatus=await screen.getStatus();
            await logAction('addScreen', 'Failed to add screen: pairing code already exists');
            return res.render("Screen", {
                message: {
                    type: "error",
                    text: "Screen with this Pairing Code already exists",
                },
                screens: allScreens,
                screenCount,
                onlineScreen,
                offlineScreen,
                deletedScreens,
                groupscreen,
                screenStatus
            });
        }

        // Check if a screen with the same name already exists
        const existingScreenByName = await screen.screenByName(screenName);
        if (existingScreenByName.length > 0) {
            const allScreens = await screen.getNotdeletedScreen();
            const screenCount = await screen.getTotalScreenCount();
            const onlineScreen = await screen.getNotDeletedScreenCount();
            const offlineScreen = await screen.getDeletedScreenCount();
            const deletedScreens = await screen.getDeletedScreen();
            const groupscreen = await screen.getGroupScreen();

            const  screenStatus=await screen.getStatus();
            return res.render("Screen", {
                message: {
                    type: "error",
                    text: "Screen with this name already exists",
                },
                screens: allScreens,
                screenCount,
                onlineScreen,
                offlineScreen,
                deletedScreens,
                groupscreen,screenStatus
            });
        }

        await screen.newScreen(
            pairingCode,
            screenName,
            tags,
            location,
            city,
            state,
            country,
            pincode
        );

        // await logAction('addScreen', 'Successfully added screen');
        // const user = req.session.user; // Retrieve user from session
        // await logAction('addScreen', `Successfully added screen`, user);
        const user = req.session.user; // Retrieve user from session
await logAction(req, 'addScreen', 'Successfully added screen', user);


        const screenCount = await screen.getTotalScreenCount();
        const onlineScreen = await screen.getNotDeletedScreenCount();
        const offlineScreen = await screen.getDeletedScreenCount();
        const allScreens = await screen.getNotdeletedScreen();
        const deletedScreens = await screen.getDeletedScreen();
        const groupscreen = await screen.getGroupScreen();
        const  screenStatus=await screen.getStatus();

        req.session.successMessage = 'Successfully added screen!';
        res.render("Screen", {
            message: {
                type: "success",
                text: "Successfully registered Screen",
            },
            screens: allScreens,
            screenCount,
            onlineScreen,
            offlineScreen,
            deletedScreens,
            groupscreen,screenStatus
        });
    } catch (error) {
        console.error(error);
        await logAction('addScreen', 'Error adding screen');
        res.status(500).send("Add Screen error");
    }
};

// Get all screens
const getAllScreens = async (req, res) => {
    try {
        const allScreens = await screen.getNotdeletedScreen();
        const onlineScreen = await screen.getNotDeletedScreenCount();
        const screenCount = await screen.getTotalScreenCount();
        const offlineScreen = await screen.getDeletedScreenCount();
        const deletedScreens = await screen.getDeletedScreen();
        const groupscreen = await screen.getGroupScreen();
        const  screenStatus=await screen.getStatus();

        const screenSlotData=await screen.getScreenSlotData();
        const screenDeviceConfig=await screen.screenDeviceConfig();

        res.render("Screen", {
            message: null,
            screens: screenSlotData,
            screenCount,
            onlineScreen,
            offlineScreen,
            deletedScreens,
            groupscreen,screenStatus,screenDeviceConfig
        });
    } catch (error) {
        console.error("Error fetching all screens:", error);
        res.status(500).send("Error fetching screens");
    }
};











const getAllScreens1 = async (req, res) => {
    try {
        const allScreens = await screen.getNotdeletedScreen();
        // const onlineScreen = await screen.getNotDeletedScreenCount();
        const screenCount = await screen.getTotalScreenCount();
        // const offlineScreen = await screen.getDeletedScreenCount();
        const deletedScreens = await screen.getDeletedScreen();
        const groupscreen = await screen.getGroupScreen();
        const  screenStatus=await screen.getStatus();
        // const totalScreenCount= await screen.getTotalScreenCount();
        const onlineScreenCount=await screen.getOnlineCountByClientTable();
        const offlineScreenCount=await screen.getOfflineCountByClientTable();
        res.render("sales", {
            message: null,
            screens: allScreens,
            screenCount,
            onlineScreen:onlineScreenCount,
            offlineScreen:offlineScreenCount,
            deletedScreens,
            groupscreen,screenStatus
        });
    } catch (error) {
        console.error("Error fetching all screens:", error);
        res.status(500).send("Error fetching screens");
    }
};






















// Get all screens data
const getAllScreensAllData = async (req, res) => {
    try {
        const allScreens = await screen.getAllScreens();
        res.json(allScreens);
    } catch (error) {
        console.error("Error fetching all screens:", error);
        res.status(500).send("Error fetching screens");
    }
};

// Get not deleted screens
const getNotdeletedScreen = async (req, res) => {
    try {
        const notDeletedScreen = await screen.getNotdeletedScreen();
        res.render("Screen", {
            message: null,
            screens: notDeletedScreen,
        });
    } catch (error) {
        console.error("Error fetching screens:", error);
        res.status(500).send("Error fetching screens");
    }
};

// Update or delete a screen
const updateDeleteScreen = async (req, res) => {
    const { screenid } = req.body;

    try {
        await screen.updateDeleteScreen(screenid);
       // await logAction('DeleteScreen', `Screen deleted: ${screenid}`);
         const user = req.session.user; // Retrieve user from session
await logAction(req, 'DeleteScreen', `Screen deleted: ${screenid}`, user);


        res.sendStatus(204);
    } catch (error) {
        console.error(error);
        await logAction('updateDeleteScreen', `Error updating screen: ${screenid}`);
        res.status(500).send("Error deleting screen");
    }
};

// Edit a screen
const editScreen = async (req, res) => {
    const {
        screenid,
        pairingCode,
        screenName,
        tags,
        location,
        city,
        state,
        country,
        pincode,
    } = req.body;

    try {
        await screen.editScreen(
            screenid,
            pairingCode,
            screenName,
            tags,
            location,
            city,
            state,
            country,
            pincode
        );

        // const user = req.session.user; // Retrieve user from session
        // await logAction('editScreen', `Screen edited: ${screenid}`, user);
        const user = req.session.user; // Retrieve user from session
        await logAction(req, 'editScreen', `Screen edited: ${screenid}`, user);
        
        
        const screenCount = await screen.getTotalScreenCount();
        const onlineScreen = await screen.getNotDeletedScreenCount();
        const offlineScreen = await screen.getDeletedScreenCount();
        const allScreens = await screen.getNotdeletedScreen();
        const deletedScreens = await screen.getDeletedScreen();
        const groupscreen = await screen.getGroupScreen();
        const  screenStatus=await screen.getStatus();


        res.render("Screen", {
            message: {
                type: "success",
                text: "Screen edited successfully",
            },
            screens: allScreens,
            screenCount,
            onlineScreen,
            offlineScreen,
            deletedScreens,
            groupscreen,screenStatus
        });
    } catch (error) {
        console.error(error);
        const user = req.session.user; // Retrieve user from session
        await logAction('editScreen', `Error editing screen: ${screenid}`, user);
        res.status(500).send("Error editing screen");
    }
};

// Get screen by pairing code
const screenByPairingCode = async (req, res) => {
    const { pairingCode } = req.params;
    try {
        const screenData = await screen.screenByPairingCode(pairingCode);
        if (screenData.length === 0) {
            return res.status(404).json({ message: "Screen not found" });
        }
        res.json(screenData[0]);
    } catch (error) {
        console.error("Error fetching screen:", error);
        res.status(500).send("Error fetching screen");
    }
};

// Restore a screen
const restoreScreenInDB = async (req, res) => {
    const { screenid } = req.body;

    try {
        await screen.restoreScreenInDB(screenid);
        const user = req.session.user; // Retrieve user from session
        await logAction(req, 'restoreScreen', 'Screen restored', user);
        
          //await logAction('restoreScreen', `Screen restored: ${pairingCode}`);
        res.sendStatus(204);
    } catch (error) {
        console.error(error);

        res.status(500).send("Error restoring screen");
    }
};



// Delete a playlist
const deletePlaylist = async (req, res) => {
    const { screenid } = req.params;
    try {
        const response = await screen.deletePlaylist(screenid);
        await logAction('deletePlaylist', Playlist `deleted: ${screenid}`, req.ip);
        res.json(response);
    } catch (error) {
        console.error("Error deleting playlist:", error);
        await logAction('deletePlaylist', Error `deleting playlist: ${screenid}`, req.ip);
        res.status(500).json({ error: "Failed to delete playlist" });
    }
};

// Delete a screen
const deleteScreen = async (req, res) => {
    const { screenid } = req.params;
    try {
        const success = await screen.deleteScreenById(screenid);
        if (success) {
            await logAction('deleteScreen', Screen `deleted: ${screenid}`, req.ip);
            res.json({ success: true });
        } else {
            res.json({ success: false, message: 'Screen not found' });
        }
    } catch (error) {
        console.error(error);
        await logAction('deleteScreen', Error `deleting screen: ${screenid}`, req.ip);
        res.status(500).json({ success: false, message: 'An error occurred while deleting the screen' });
    }
}

module.exports = {
    addScreen,
    getAllScreens,  
        getAllScreens1,
    getNotdeletedScreen,
    updateDeleteScreen,
    editScreen,
    screenByPairingCode,
    restoreScreenInDB, 
    getAllScreensAllData,
    deletePlaylist,
    deleteScreen
};
