const express = require("express");
const router = express.Router();
const upload=require('../middlewares/uploadmedia.middlewares');
const db = require("../config/dbConnection");
// const upload=require('../middlewares/uploadmedia.s3middlewares')
const library=require('../controllers/library.controller');

router.get("/", library.viewMedia);

router.get("/Photos", library.getPhotoes);
router.get("/Videos", library.getVideos);
router.post("/UploadMedia", upload.single('file'), library.handleUploadInDB);
//
router.post("/DeleteMedia/:id", library.deleteMedia);
router.post('/storeVideoUrl', async (req, res) => {
  const { videoUrl, type, filename, duration, size } = req.body;

  if (!videoUrl || !type || !filename || !duration || !size) {
    return res.status(400).send('All fields are required');
  }

  try {
    const query = `
      INSERT INTO mediafiles (url, type, filename, duration, size)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING *;
    `;
    const values = [videoUrl, type, filename, duration, size];
    const result = await db.query(query, values);
    res.status(200).json(result.rows[0]);
  } catch (error) {
    console.error('Error storing video URL in database:', error);
    res.status(500).send('Server error');
  }
});
module.exports = router;