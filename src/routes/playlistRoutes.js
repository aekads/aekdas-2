const express = require("express");
const router = express.Router();
const upload=require('../middlewares/uploadmedia.middlewares');
const library=require('../controllers/library.controller');
const playlist=require('../controllers/playlists.controller');
const groupScreen = require("../controllers/groupScreen.controller");

// router.get("/PlaylistEdit/plylistEditScreen", (req, res) => {
//   res.render("selectionNewPlaylist");
// });
router.get('/',playlist.showPlaylist)
router.get("/newPlaylist", library.viewMediaForPlaylist);
router.get("/Photoes", library.getPhotoesForPlaylist);
router.get("/Videos", library.getVideosForPlaylist);
router.post("/UploadFile",upload.single('file'), library.handleUploadInDBForNewPlaylist);
router.post('/createPlaylist',playlist.createPlaylist)
router.post('/editPlaylist',playlist.editPlaylist)
router.get("/PlaylistEdit/plylistEditScreen",playlist.showAvailableScreenForEditPlaylist)
router.get("/PlaylistEdit/:playlistId",playlist.getPlaylistById)
// router.get("/PlaylistDelete/:playlistId",playlist.deletePlaylist)
router.post("/PlaylistDelete/:playlistId", playlist.deletePlaylist);

router.get("/newPlaylist/selectScreens",playlist.showAvailableScreen)


router.post("/:screenID/deleteScreenids",playlist.deleteScreenidsFromPlaylist)


module.exports = router;
