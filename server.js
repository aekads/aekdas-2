const express = require("express");
const session = require("express-session");
const sessionConfig = require("./src/middlewares/sessionConfig");
const path = require("path");
const cookieParser = require("cookie-parser");
require("dotenv").config();
const dashboardRoutes = require("./src/routes/dashboardRoutes");
const loginRoutes = require("./src/routes/loginRoutes");
const flash = require('connect-flash');
const bodyParser = require('body-parser');
const bcrypt = require('bcryptjs');
const nodemailer = require('nodemailer');
const { Sequelize, DataTypes } = require('sequelize');
const cloudinary = require('./src/config/cloudinaryConfig');
const app = express();
const api = require('./src/controllers/api.controller');
const moment = require('moment-timezone');
const axios = require('axios');
const { getStatus, getScreenById, deviceConfig } = require('./src/models/newScreen.model');
const { viewPlaylist } = require('./src/models/playlists.model');
const db = require("./src/config/dbConnection");
const { createHash } = require("crypto");

const { User, OTP } = require('./src/models/usermodel');
const { Log, Log2, sequelize } = require('./src/models/logsmodel');


const logsRoutes = require('./src/routes/logsRoutes');

const dotenv = require('dotenv');
dotenv.config();







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


// Express middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));
app.use(session(sessionConfig));
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({ extended: false }));
app.use(flash());

app.use((req, res, next) => {
  res.locals.success_msg = req.flash('success_msg');
  res.locals.error_msg = req.flash('error_msg');
  res.locals.logAction = logAction;
  next();
});

// Routes
app.use("/Dashboard", dashboardRoutes.router);
app.use('/', logsRoutes);      
app.get("/", (req, res) => {
  res.render("Login", { message: null });
});

app.get('/alldata', api.getAllScreensAllData);
app.get('/livedata', api.getAllScreensAllData);

app.get('/register', dashboardRoutes.isAuthenticated, (req, res) => {
  res.render('register');
});
app.post('/register', dashboardRoutes.isAuthenticated, async (req, res) => {
  const { name, email, password, role } = req.body;
  const allowedRoles = ['admin', 'editor', 'viewer'];

  // Check if the role is one of the allowed roles
  if (!allowedRoles.includes(role)) {
    req.flash('error_msg', 'Invalid role selected.');
    return res.redirect('/register');
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  await User.create({ name, email, password: hashedPassword, role });

  // Log the registration action
  await logAction(req, 'register', 'User registered');
  await logAction2(req, 'register', 'User registered');


  res.redirect('/Dashboard/Teams/Addmember');
});

app.get('/login', (req, res) => {
  res.render('Login');
});

app.post('/login', async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ where: { email } });
  if (user && await bcrypt.compare(password, user.password)) {
    // Generate OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    await OTP.create({ userId: user.id, otp });
    req.session.otp = otp;
    req.session.user = user;

    // Send OTP via email
    let transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: 'aekads.otp@gmail.com',
        pass: 'ntkp cloo wjnx atep'
      }
    });

    let mailOptions = {
      from: 'aekads.otp@gmail.com',
      to: user.email,
      subject: 'Your login OTP Code',
      text: `Your login OTP code is ${otp}`
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.log(error);
      } else {
        console.log('Email sent: ' + info.response);
      }
    });
    // Assuming password check passed
    req.user = user;  // Set req.user

    // Log the login action
    // await logAction(req, 'login', 'User logged in');
    await logAction(req, 'login', 'logged in', req.user);

    res.redirect('/verify-otp');
  } else {
    req.flash('error_msg', 'Invalid email or password. Please check and try again.');
    res.redirect('/');
  }
});

app.get('/verify-otp', (req, res) => {
  res.render('verify-otp');
});

app.post('/verify-otp', async (req, res) => {
  const { otp } = req.body;
  const savedOtp = await OTP.findOne({ where: { userId: req.session.user.id, otp } });

  if (savedOtp) {
    const otpCreationTime = savedOtp.createdAt;
    const currentTime = new Date();
    const timeDifference = (currentTime - otpCreationTime) / 1000; // Time difference in seconds

    if (timeDifference > 60) {
      await OTP.destroy({ where: { id: savedOtp.id } });
      req.flash('error_msg', 'OTP has expired. Please request a new one.');
      console.log('OTP expired');
      res.redirect('/verify-otp');
    } else {
      await OTP.destroy({ where: { id: savedOtp.id } });

      res.redirect('/Dashboard');
    }
  } else {
    req.flash('error_msg', 'Invalid OTP. Please check and try again.');
    res.redirect('/verify-otp');
  }
});

app.post('/resend-otp', async (req, res) => {
  const user = req.session.user;
  if (user) {
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    await OTP.create({ userId: user.id, otp });

    let transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: 'aekads.otp@gmail.com',
        pass: 'ntkp cloo wjnx atep'
      }
    });

    let mailOptions = {
      from: 'aekads.otp@gmail.com',
      to: user.email,
      subject: 'Your login OTP Code',
      text: `Your login OTP code is ${otp}`
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.log(error);
        res.json({ success: false });
      } else {
        console.log('Email sent: ' + info.response);
        res.json({ success: true });
      }
    });
  } else {
    res.json({ success: false });
  }
});

// Function to fetch Cloudinary storage data
const getCloudinaryStorageData = async () => {
  try {
    const result = await cloudinary.api.usage();
    console.log('Cloudinary Storage Data:', result); // Debug log
    return result;
  } catch (error) {
    console.error('Error fetching Cloudinary storage data:', error);
  }
};

app.get('/api/cloudinary-storage', async (req, res) => {
  const data = await getCloudinaryStorageData();
  res.json(data);
});

app.get('/logout', (req, res) => {
  req.session.destroy();
  res.redirect('/');
});




// Route to display all users
app.get('/admin/users', dashboardRoutes.isAuthenticated, async (req, res) => {
  const user = req.session.user;


  try {
    const users = await User.findAll();
    res.render('admin-users', { users });
  } catch (error) {
    console.error(error);
    req.flash('error_msg', 'An error occurred while fetching users.');
    res.redirect('/');
  }
});

// Route to get the edit user form
app.get('/admin/users/:id/edit', dashboardRoutes.isAuthenticated, async (req, res) => {
  const user = req.session.user;
  const userId = req.params.id;


  try {
    const userToEdit = await User.findOne({ where: { id: userId } });

    if (!userToEdit) {
      req.flash('error_msg', 'User not found.');
      return res.redirect('/admin/users');
    }

    res.render('edit-user', { user: userToEdit });
  } catch (error) {
    console.error(error);
    req.flash('error_msg', 'An error occurred while fetching the user.');
    res.redirect('/admin/users');
  }
});

// Route to update a user's profile
app.post('/admin/users/:id/edit', dashboardRoutes.isAuthenticated, async (req, res) => {
  const { name, email, role, currentPassword, newPassword, confirmNewPassword } = req.body;
  const allowedRoles = ['admin', 'editor', 'viewer'];
  const userId = req.params.id;

  // Check if the role is one of the allowed roles
  if (!allowedRoles.includes(role)) {
    req.flash('error_msg', 'Invalid role selected.');
    return res.redirect(`/admin/users/${userId}/edit`);
  }

  try {
    const user = await User.findOne({ where: { id: userId } });

    if (!user) {
      req.flash('error_msg', 'User not found.');
      return res.redirect('/admin/users');
    }

    // Update user details
    user.name = name;
    user.email = email;
    user.role = role;

    if (currentPassword || newPassword || confirmNewPassword) {
      if (!currentPassword || !newPassword || !confirmNewPassword) {
        req.flash('error_msg', 'Please fill in all password fields.');
        return res.redirect(`/admin/users/${userId}/edit`);
      }

      const passwordMatch = await bcrypt.compare(currentPassword, user.password);
      if (!passwordMatch) {
        req.flash('error_msg', 'Current password is incorrect.');
        return res.redirect(`/admin/users/${userId}/edit`);
      }

      if (newPassword !== confirmNewPassword) {
        req.flash('error_msg', 'New passwords do not match.');
        return res.redirect(`/admin/users/${userId}/edit`);
      }

      user.password = await bcrypt.hash(newPassword, 10);
    }

    await user.save();
    await logAction(req, 'Profile Edit', 'User Profile edited');
    await logAction2(req, 'edit Profile', 'User edit');
    req.flash('success_msg', 'User updated successfully.');
    res.redirect('/admin/users');
  } catch (error) {
    console.error(error);
    req.flash('error_msg', 'An error occurred while updating the user.');
    res.redirect(`/admin/users/${userId}/edit`);
  }
});


// Route to delete a user
app.post('/admin/users/:id/delete', dashboardRoutes.isAuthenticated, async (req, res) => {
  const user = req.session.user;
  const userId = req.params.id;


  try {
    const userToDelete = await User.findOne({ where: { id: userId } });

    if (!userToDelete) {
      req.flash('error_msg', 'User not found.');
      return res.redirect('/admin/users');
    }

    // Delete the user
    await userToDelete.destroy();
    req.flash('success_msg', 'User deleted successfully.');
    await logAction(req, 'Profile Delete', 'User Profile deleted');
    await logAction2(req, 'Profile Delete', 'User Profile deleted');
    res.redirect('/admin/users');
  } catch (error) {
    console.error(error);
    req.flash('error_msg', 'An error occurred while deleting the user.');
    res.redirect('/admin/users');
  }
});





//device settind
app.get('/setting/:screenid', dashboardRoutes.isAuthenticated, async (req, res) => {
  try {
    const screenid = req.params.screenid;

    // Fetch the screen data by screenid
    const screenData = await getScreenById(screenid);
    if (!screenData) {
      return res.status(404).send("Screen not found");
    }

    // Fetch the device config using screenid (which matches client_name)
    const deviceConfigData = await deviceConfig(screenid);
    const playlists = await viewPlaylist();

    // Prepare screen details with device config
    const screenDetails = {
      ...screenData,
      deviceConfig: deviceConfigData || {}, // Ensure it doesn't crash if no data found
      playlists: playlists
    };


    // Render the screen settings view and pass the data
    res.render('screensetting', { screen: screenDetails });

  } catch (err) {
    console.error("Error fetching screen settings:", err);
    res.status(500).send("Internal Server Error");
  }
});




// Sync database and start server
sequelize.sync().then(() => {
  app.listen(3000, () => {
    console.log('Server is running on port 3000');
  });
});

