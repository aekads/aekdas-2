
const express = require("express");
const router = express.Router();
const userLoginCheck = require("../controllers/userLogin.controller");

router.post("/", userLoginCheck.checkLogin);
router.get('/',(req, res) => {
    res.render("Login", { message: null });
  })
module.exports = router;