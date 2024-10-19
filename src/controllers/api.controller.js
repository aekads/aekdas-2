const screen = require("../models/newScreen.model");


const getAllScreensAllData = async (req, res) => {
    try {
      const allScreens = await screen.getAllScreens(); // Assuming this function fetches all screens
  
      // Assuming you want to send allScreens as JSON
      res.json(allScreens);
    } catch (error) {
      console.error("Error fetching all screens:", error);
      res.status(500).send("Error fetching screens");
    }
  };
  
  module.exports={getAllScreensAllData};