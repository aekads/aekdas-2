const screen = require("../models/newScreen.model");
const library = require("../models/library.model");

const logdetails = require("../models/log.model");

const showAllDashboardData=async (req, res) => {

    const totalScreenCount= await screen.getTotalScreenCount();
    const onlineScreenCount=await screen.getOnlineCountByClientTable();
    const offlineScreenCount=await screen.getOfflineCountByClientTable();
    const totalMediaFiles=await library.getmediafileCount();
    const  screenStatus=await screen.getStatus();
    const allScreens =await screen.getNotdeletedScreen();
    const logs =await logdetails.logData();
 
  
    // try {
    //     const logs = await Log.findAll({
    //       order: [['createdAt', 'DESC']],
    //       limit: 5
    //     });
    //     res.render('showdashboard', { logs });
    //   } catch (error) {
    //     console.error('Error fetching logs:', error);
    //     req.flash('error_msg', 'Error fetching dashboard data. Please try again.');
    //     res.redirect('/Dashboard');
    //   }
// console.log(totalScreenCount,onlineScreenCount,deletedScreenCount,totalMediaFiles,allScreens,logs);
    res.render("showdashboard",{totalScreenCount,onlineScreenCount,offlineScreenCount,totalMediaFiles,allScreens,logs,screenStatus});
}


const OnlineScreensAll = async (req, res) => {
    try {
      // Call the model function to get online screens and total count
      const { onlineScreens, totalOnlineCount } = await screen.AllOnlineScreens();
    //   const  screenStatus=await screen.getStatus();
  
      // Render the onlineScreens page, passing the data
      res.render('onlineScreen', {
        onlineScreens,
        totalOnlineCount
      });
    } catch (err) {
      console.error("Error fetching online screens:", err);
      res.status(500).send('Internal Server Error');
    }
  };
  
  const OfflineScreensAll = async (req, res) => {
    try {
      // Call the model function to get online screens and total count
      const { offlineScreens, totalOfflineCount } = await screen.AllOfflineScreens();
    //   const  screenStatus=await screen.getStatus();
  
      // Render the onlineScreens page, passing the data
      res.render('offlineScreen', {
        offlineScreens,
        totalOfflineCount
      });
    } catch (err) {
      console.error("Error fetching online screens:", err);
      res.status(500).send('Internal Server Error');
    }
  };
module.exports={
    showAllDashboardData,
    OnlineScreensAll,OfflineScreensAll
}
