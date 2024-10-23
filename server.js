const express = require("express");
const session = require("express-session");
const sessionConfig = require("./src/middlewares/sessionConfig");
const path = require("path");
const cookieParser = require("cookie-parser");
require("dotenv").config();
const dashboardRoutes = require("./src/routes/dashboardRoutes");

const proposalSalesRoutes = require("./src/routes/proposalsSalesRoutes");

const loginRoutes = require("./src/routes/loginRoutes");
const flash = require("connect-flash");
const bodyParser = require("body-parser");
const bcrypt = require("bcryptjs");
const nodemailer = require("nodemailer");
const { Sequelize, DataTypes } = require("sequelize");
const cloudinary = require("./src/config/cloudinaryConfig"); 
const app = express();
const api = require("./src/controllers/api.controller");
const moment = require("moment-timezone");
const axios = require("axios");
const {
  getStatus,
  getScreenById,
  deviceConfig,
} = require("./src/models/newScreen.model");
const { viewPlaylist } = require("./src/models/playlists.model");
const db = require("./src/config/dbConnection");
const { createHash } = require("crypto");
// Database setup
const sequelize = new Sequelize(
  "dbzvtfeophlfnr",
  "u3m7grklvtlo6",
  "AekAds@24",
  {
    host: "35.209.89.182",
    dialect: "postgres",
  }
);

const checkRole = (allowedRoles) => {
  return (req, res, next) => {
    if (req.session.user && allowedRoles.includes(req.session.user.role)) {
      return next();
    } else {
      req.flash('error_msg', 'You do not have permission to access this page.');
      return res.redirect('/Dashboard');
    }
  };
};

// Define models
// const User = sequelize.define("User", {
//   name: DataTypes.STRING,
//   email: {
//     type: DataTypes.STRING,
//     allowNull: false,
//     unique: true,
//   },
//   password: {
//     type: DataTypes.STRING,
//     allowNull: false,
//   },
//   role: {
//     type: DataTypes.ENUM,
//     values: ["admin", "editor", "viewer","sales"],
//     allowNull: false,
//   },
// });


// Define models
const User1 = sequelize.define("User1", {
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  role: {
    type: DataTypes.ENUM,
    values: ["admin", "editor", "viewer", "sales"],
    allowNull: false,
  },
  permissions: {
    type: DataTypes.JSON, // Store permissions as JSON
    allowNull: true, // Can be null at registration, filled later
    defaultValue: [], // Initialize with an empty array
  },
});

const OTP = sequelize.define("OTP", {
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  otp: {
    type: DataTypes.STRING,
    allowNull: false,
  },
});

const Log = sequelize.define("Log", {
  action: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  message: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  ip: {
    type: DataTypes.STRING,
    allowNull: false,
  },
});

const Log2 = sequelize.define("Log2", {
  action: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  message: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  ip: {
    type: DataTypes.STRING,
    allowNull: false,
  },
});

// Function to fetch external IP
const getClientIP = (req) => {
  const forwarded = req.headers['x-forwarded-for'];
  return forwarded ? forwarded.split(',')[0] : req.ip;
};

// Middleware for logging actions
// Middleware for logging actions
const logAction = async (req, action, message, user) => {
  try {
    const ip = getClientIP(req);

    // Check if the user object and user.name exist
    const userName = user && user.name ? user.name : 'Unknown User';
    const logMessage = `${userName} ${message}`;

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
  res.locals.success_msg = req.flash("success_msg");
  res.locals.error_msg = req.flash("error_msg");
  res.locals.logAction = logAction;
  next();
});

// Routes
app.use("/Dashboard", dashboardRoutes.router);
app.use("/proposals", proposalSalesRoutes);

app.get("/", (req, res) => {
  res.render("Login", { message: null });
});

app.get("/alldata", api.getAllScreensAllData);
app.get("/livedata", api.getAllScreensAllData);

// Middleware to check if user is 'admin' or 'editor'

app.get("/register", (req, res) => {
  res.render("register");
});


app.post("/register", async (req, res) => {
  const { name, email, password, role } = req.body;
  const permissions = req.body.permissions || {}; // Permissions from the form
  const allowedRoles = ["admin", "editor", "member", "sales"];

  // Check if the role is valid
  if (!allowedRoles.includes(role)) {
    req.flash("error_msg", "Invalid role selected.");
    return res.redirect("/register");
  }

  console.log("permissions", permissions);

  try {
    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user with permissions
    await User1.create({
      name, // Store name in the database
      email,
      password: hashedPassword,
      role,
      permissions: Object.keys(permissions).filter(action => permissions[action] === 'on') // Store only keys with 'on'
    });

    // Log action
    await logAction(req, "register", "User registered");

    res.redirect("/Dashboard/Teams/Addmember");
  } catch (error) {
    console.error(error);
    req.flash("error_msg", "There was an error registering the user.");
    res.redirect("/register");
  }
});












app.get('/login', (req, res) => {
  res.render('Login');
});



app.post('/login', async (req, res) => {
  const { email, password } = req.body;
  const user= await User1.findOne({ where: { email } });

  if (user && await bcrypt.compare(password, user.password)) {
    // Generate OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    await OTP.create({ userId: user.id, otp });
    req.session.otp = otp;
    req.session.user = user; // Store user details and role in session

    console.log("login user",req.session.user);
    
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

    // Log the login action
    await logAction(req, 'login', 'User logged in', req.session.user);

    res.redirect('/verify-otp');  
  } else {
    req.flash('error_msg', 'Invalid email or password. Please check and try again.');
    res.redirect('/');
  }
});


app.get("/verify-otp", (req, res) => {
  res.render("verify-otp");
});

app.post("/verify-otp", async (req, res) => {
  const { otp } = req.body;
  const savedOtp = await OTP.findOne({
    where: { userId: req.session.user.id, otp },
  });

  if (savedOtp) {
    const otpCreationTime = savedOtp.createdAt;
    const currentTime = new Date();
    const timeDifference = (currentTime - otpCreationTime) / 1000; // Time difference in seconds

    if (timeDifference > 60) {
      await OTP.destroy({ where: { id: savedOtp.id } });
      req.flash("error_msg", "OTP has expired. Please request a new one.");
      console.log("OTP expired");
      res.redirect("/verify-otp");
    } else {
      await OTP.destroy({ where: { id: savedOtp.id } });

      const { role } = req.session.user;
      console.log("userrole", role);

      if (role == "sales") {
        console.log("in sales auth");
        req.session.userId = req.session.user.id;
        res.redirect("/proposals");
      } else {
        res.redirect("/Dashboard");
      }
    }
  } else {
    req.flash("error_msg", "Invalid OTP. Please check and try again.");
    res.redirect("/verify-otp");
  }
});

app.post("/resend-otp", async (req, res) => {
  const user = req.session.user;
  if (user) {
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    await OTP.create({ userId: user.id, otp });

    let transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: "aekads.otp@gmail.com",
        pass: "ntkp cloo wjnx atep",
      },
    });

    let mailOptions = {
      from: "aekads.otp@gmail.com",
      to: user.email,
      subject: "Your login OTP Code",
      text: `Your login OTP code is ${otp}`,
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.log(error);
        res.json({ success: false });
      } else {
        console.log("Email sent: " + info.response);
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
    console.log("Cloudinary Storage Data:", result); // Debug log
    return result;
  } catch (error) {
    console.error("Error fetching Cloudinary storage data:", error);
  }
};

app.get("/api/cloudinary-storage", async (req, res) => {
  const data = await getCloudinaryStorageData();
  res.json(data);
});

app.get("/logout", (req, res) => {
  req.session.destroy();
  res.redirect("/");
});

app.get("/logs", checkRole(['admin']),dashboardRoutes.isAuthenticated, async (req, res) => {
  try {
    const logs = await Log.findAll({
      order: [["createdAt", "DESC"]],
    });

    // Convert timestamps to IST
    const logsWithIST = logs.map((log) => ({
      ...log.dataValues,
      createdAt: moment(log.createdAt)
        .tz("Asia/Kolkata")
        .format("HH:mm:ss DD-MM-YYYY"),
    }));

    res.render("logs", { logs: logsWithIST });
  } catch (error) {
    console.error("Error fetching logs:", error);
    req.flash("error_msg", "Error fetching logs. Please try again.");
    res.redirect("/Dashboard");
  }
});



// Route to display all users
app.get("/admin/users", async (req, res) => {

  try {
    const users = await User1.findAll();
    res.render("admin-users", { users });
  } catch (error) {
    console.error(error);
    req.flash("error_msg", "An error occurred while fetching users.");
    res.redirect("/");
  }
});

// Route to get the edit user form
app.get("/admin/users/:id/edit", async (req, res) => {
  const userId = req.params.id;

  try {
    const userToEdit = await User1.findOne({ where: { id: userId } });

    if (!userToEdit) {
      req.flash("error_msg", "User not found.");
      return res.redirect("/admin/users");
    }

    res.render("edit-user", { user: userToEdit });
  } catch (error) {
    console.error(error);
    req.flash("error_msg", "An error occurred while fetching the user.");
    res.redirect("/admin/users");
  }
});

// Route to update a user's profile

// Route to update a user's profile
app.post("/admin/users/:id/edit", async (req, res) => {
  const {
      name,
      email,
      role,
      currentPassword,
      newPassword,
      confirmNewPassword,
      permissions, // Capture permissions from the form
  } = req.body;

  const userId = req.params.id;
  const allowedRoles = ["admin", "editor", "member", "sales"];

  // Validate role
  if (!allowedRoles.includes(role)) {
      req.flash("error_msg", "Invalid role selected.");
      return res.redirect(`/admin/users/${userId}/edit`);
  }

  try {
      const user = await User1.findOne({ where: { id: userId } });

      if (!user) {
          req.flash("error_msg", "User not found.");
          return res.redirect("/admin/users");
      }

      // Update user details
      user.name = name;
      user.email = email;
      user.role = role;

      // Capture permissions from the request body
      const permissionKeys = (permissions && typeof permissions === 'object')
          ? Object.keys(permissions).filter(action => permissions[action] === 'on')
          : [];
      
      user.permissions = permissionKeys; // Save permissions to the user object

      // Handle password updates
      if (currentPassword || newPassword || confirmNewPassword) {
          if (!currentPassword || !newPassword || !confirmNewPassword) {
              req.flash("error_msg", "Please fill in all password fields.");
              return res.redirect(`/admin/users/${userId}/edit`);
          }

          const passwordMatch = await bcrypt.compare(currentPassword, user.password);
          if (!passwordMatch) {
              req.flash("error_msg", "Current password is incorrect.");
              return res.redirect(`/admin/users/${userId}/edit`);
          }

          if (newPassword !== confirmNewPassword) {
              req.flash("error_msg", "New passwords do not match.");
              return res.redirect(`/admin/users/${userId}/edit`);
          }

          user.password = await bcrypt.hash(newPassword, 10); // Hash new password
      }

      // Save the updated user
      await user.save();
      await logAction(req, "Profile Edit", "User Profile edited");
      req.flash("success_msg", "User updated successfully.");
      res.redirect("/admin/users");
  } catch (error) {
      console.error(error);
      req.flash("error_msg", "An error occurred while updating the user.");
      res.redirect(`/admin/users/${userId}/edit`);
  }
});

// 

// Route to delete a user
app.post("/admin/users/:id/delete", async (req, res) => {
  const userId = req.params.id;

  try {
    const userToDelete = await User1.findOne({ where: { id: userId } });

    if (!userToDelete) {
      req.flash("error_msg", "User not found.");
      return res.redirect("/admin/users");
    }

    // Delete the user
    await userToDelete.destroy();
    req.flash("success_msg", "User deleted successfully.");
    await logAction(req, "Profile Delete", "User Profile deleted");
    await logAction2(req, "Profile Delete", "User Profile deleted");
    res.redirect("/admin/users");
  } catch (error) {
    console.error(error);
    req.flash("error_msg", "An error occurred while deleting the user.");
    res.redirect("/admin/users");
  }
});

app.get("/admin/logs", dashboardRoutes.isAuthenticated,async (req, res) => {
  try {
    const logs = await Log2.findAll({
      order: [["createdAt", "DESC"]],
    });

    // Convert timestamps to IST
    const logsWithIST = logs.map((log) => ({
      ...log.dataValues,
      createdAt: moment(log.createdAt)
        .tz("Asia/Kolkata")
        .format("HH:mm:ss DD-MM-YYYY"),
    }));

    res.render("log", { logs: logsWithIST });
  } catch (error) {
    console.error("Error fetching logs:", error);
    req.flash("error_msg", "Error fetching logs. Please try again.");
    res.redirect("/Dashboard");
  }
});

//device settind
app.get("/setting/:screenid",dashboardRoutes.isAuthenticated, async (req, res) => {
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
      playlists: playlists,
    };
// console.log("screen config",screenDetails.deviceConfig);

    // Render the screen settings view and pass the data
    res.render("screensetting", { screen: screenDetails });
  } catch (err) {
    console.error("Error fetching screen settings:", err);
    res.status(500).send("Internal Server Error");
  }
});



app.get('/session-data', (req, res) => {
  res.json({ user: req.session.user });
});
// Sync database and start server
sequelize.sync().then(() => {
  app.listen(3000,  () => {
    console.log("Server is running on port 3000");
  });
});
