// dashboardRoutes.js
const express = require("express");
const router = express.Router();
const { dashboardAuth } = require('../controllers/userLogin.controller');
const teamRouter = require('./TeamsRoutes');
const screenRouter = require('./screensRoutes');
const libraryRouter = require('./libraryRoutes');
const playlistRouter = require('./playlistRoutes');
const liveContentRouter = require('./liveContentRoutes');
const proposalRouter = require('./proposalsRoutes');
const dashboardController = require('../controllers/dashboard.controller');
const checkRole = require('../middlewares/roleMiddleware');  // Role-based access control middleware
const checkPermission = require('../middlewares/permissionMiddleware');
// Middleware to check if the user is authenticated and attach user to req
const isAuthenticated = (req, res, next) => {
  if (req.session.user) {
    // Attach the user from the session to the request object
    req.user = req.session.user;

    // If the user role is 'sales', redirect to login
    if (req.user.role === 'sales') {
      return res.redirect('/login');
    }
    
    next(); // User is authenticated, proceed to the next middleware/route
  } else {
    res.redirect('/login'); // Redirect to login if user is not authenticated
  }
};

// Apply the middleware to all routes
// router.use(isAuthenticated);

// Define your routes
router.get("/",isAuthenticated, dashboardController.showAllDashboardData);

router.get("/OnlineScreens",checkPermission('sv'),isAuthenticated,dashboardController.OnlineScreensAll);
router.get("/OfflineScreens",checkPermission('sv'),isAuthenticated,dashboardController.OfflineScreensAll);
router.use("/Screens",checkPermission('sv'),isAuthenticated,screenRouter);
router.use("/Teams",checkRole(['admin']),isAuthenticated, teamRouter);
router.use("/Library", isAuthenticated,checkPermission('lv'), libraryRouter); // Singl
router.use("/Playlist",isAuthenticated,checkPermission('pv'), playlistRouter );
router.use("/LiveContent",isAuthenticated,checkPermission('liv'),liveContentRouter );
router.use("/Proposal",checkRole(['admin']), isAuthenticated,proposalRouter);

module.exports = { router, isAuthenticated,checkRole, checkPermission};
