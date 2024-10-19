// src/routes/logsRoutes.js

const express = require('express');
const moment = require('moment-timezone');
const { Log, Log2 } = require('../models/logsmodel'); // Adjust path as necessary
const dashboardRoutes = require('./dashboardRoutes'); // Adjust path if needed

const router = express.Router();





// Function to fetch external IP
const getClientIP = (req) => {
    const forwarded = req.headers['x-forwarded-for'];
    return forwarded ? forwarded.split(',')[0] : req.ip;
  };
  
  // Middleware for logging actions
  const logAction = async (req, action, message, user) => {
    try {
      const ip = getClientIP(req);
      const logMessage = `${user.name} ${message}`;
      await Log.create({ action, message: logMessage, ip });
    } catch (error) {
      console.error('Error logging action:', error);
    }
  };
         
  
  
  
  const logAction2 = async (req, action, message) => {
    const ip = getClientIP(req);
    await Log2.create({ action, message, ip });
  };
  

// Get logs for the main logs page
router.get('/logs', dashboardRoutes.isAuthenticated, async (req, res) => {
  try {
    const logs = await Log.findAll({
      order: [['createdAt', 'DESC']]
    });

    // Convert timestamps to IST
    const logsWithIST = logs.map(log => ({
      ...log.dataValues,
      createdAt: moment(log.createdAt).tz('Asia/Kolkata').format('HH:mm:ss DD-MM-YYYY')
    }));

    res.render('logs', { logs: logsWithIST });
  } catch (error) {
    console.error('Error fetching logs:', error);
    req.flash('error_msg', 'Error fetching logs. Please try again.');
    res.redirect('/Dashboard');
  }
});

// Get logs for the admin logs page
router.get('/admin/logs', dashboardRoutes.isAuthenticated, async (req, res) => {
  try {
    const logs = await Log2.findAll({
      order: [['createdAt', 'DESC']]
    });

    // Convert timestamps to IST
    const logsWithIST = logs.map(log => ({
      ...log.dataValues,
      createdAt: moment(log.createdAt).tz('Asia/Kolkata').format('HH:mm:ss DD-MM-YYYY')
    }));

    res.render('log', { logs: logsWithIST });
  } catch (error) {
    console.error('Error fetching logs:', error);
    req.flash('error_msg', 'Error fetching logs. Please try again.');
    res.redirect('/Dashboard');
  }
});

module.exports = router;
