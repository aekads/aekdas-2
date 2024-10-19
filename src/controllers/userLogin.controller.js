const userLogin = require("../models/Teams.model");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

const checkLogin = async (req, res) => {
  const { username, password } = req.body;
  console.log(username, password);
  try {
    const user = await userLogin.findMember(username, password);

    if (user) {
      // const token = jwt.sign(
      //   { id: user.id, username: user.username },
      //   process.env.JWT_SECRET,
      //   { expiresIn: process.env.JWT_EXPIRY }
      // );
  // console.log('loginTimeToken',token);
      
      // res.cookie("token", token, {
      //   httpOnly: true,
      //   secure: true,        
      //   sameSite: "strict",
      // });
      // console.log('cookies',req.cookies);
      res.redirect("/Dashboard");
    } else {
      res.render("Login", { message: "Invalid login credentials" });
    }
  } catch (error) {
    console.error("Error:", error);
    res.status(500).send("Failed to fetch users by findmember");
  }
};
const dashboardAuth = (req, res, next) => {
  const token = req.cookies?.token;
  // console.log('dashboardAuthtoken',token);
  if (!token) {
    return res.redirect("/login");
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      console.error("JWT Verification Error:", err);
      return res.redirect("/login");
    }

    // If token is valid, allow access to dashboard
    req.user = decoded;

    next();
  });
};



module.exports = {
  checkLogin,
  dashboardAuth,
};
