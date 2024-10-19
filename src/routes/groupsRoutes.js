const express = require("express");
const router = express.Router();
const groupScreen = require("../controllers/groupScreen.controller");

router.get('/',groupScreen.showAvailableScreen);

router.post("/",groupScreen.createGroup);
router.get("/:groupName", groupScreen.editGroup);

router.delete("/:groupName", groupScreen.deleteGroup);
module.exports = router;