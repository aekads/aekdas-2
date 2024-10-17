const express = require("express");
const router = express.Router();
const liveController=require('../controllers/LiveController');


router.get("/",liveController.showLivedata);
router.get('/liveLink',(req,res)=>{
    res.render("livelink");
})
router.get('/liveLink/selectlivescreens',liveController.showAvailableScreen)
router.post('/createlive',liveController.createlive)

router.delete("/deletePlaylist/:liveId", liveController.deleteLive);

router.get('/liveEditLink/:liveId',liveController.getliveDatabyId)

module.exports = router;
