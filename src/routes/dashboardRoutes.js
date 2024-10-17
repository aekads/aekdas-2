const express = require("express");
const router = express.Router();
const {dashboardAuth}= require('../controllers/userLogin.controller')
const teamRouter=require('./TeamsRoutes');
const screenRouter=require('./screensRoutes');
const libraryRouter=require('./libraryRoutes');
const playlistRouter=require('./playlistRoutes');
const liveContentRouter=require('./liveContentRoutes');
const dashboardController=require('../controllers/dashboard.controller');


const isAuthenticated = (req, res, next) => {
  if (req.session.user) {
      next(); // User is authenticated, proceed to dashboard
  } else {
      res.redirect('/login'); // Redirect to login if user is not authenticated
  }
};
//  router.use(dashboardAuth)
router.get("/",isAuthenticated,dashboardController.showAllDashboardData);
router.get("/OnlineScreens",isAuthenticated,dashboardController.OnlineScreensAll);
router.get("/OfflineScreens",isAuthenticated,dashboardController.OfflineScreensAll);
router.use("/Screens",isAuthenticated,screenRouter);
router.use("/Teams",isAuthenticated, teamRouter);
router.use("/Library",isAuthenticated,libraryRouter);
router.use("/Playlist",isAuthenticated, playlistRouter );
router.use("/LiveContent",isAuthenticated,liveContentRouter );



module.exports = {router,isAuthenticated};
