const db = require("../config/dbConnection");

const uploadMediaInDB = async (fileUrl, fileType,fileName,duration,fileSizeMB) => {

  console.log("fileSizeMB",fileSizeMB);
  const query = fileType.startsWith("video/") ?
  'INSERT INTO mediafiles (url, type, filename, duration, size) VALUES ($1, $2, $3, $4, $5)' :
  'INSERT INTO mediafiles (url, type, filename, size) VALUES ($1, $2, $3, $4)';

const values = fileType.startsWith("video/") ?
  [fileUrl, fileType, fileName, duration, fileSizeMB] :
  [fileUrl, fileType, fileName, fileSizeMB];

try {
const result=  await db.query(query, values);
    return result.rows;
  } catch (err) {
    console.error("Error occur uploading files in database:", err);
    throw err;
  }
};
const viewMedia = async () => {
  try {
    const result = await db.query("SELECT * FROM mediafiles ORDER BY id DESC");
    return result.rows;
  } catch (err) {
    console.error("error occur viewing files from database:", err);
    throw err;
  }
};

const getPhotoes = async () => {
  try {
    const result = await db.query(
      "SELECT * FROM mediafiles WHERE type LIKE 'image/%' ORDER BY id DESC;"
    );
    return result.rows;
  } catch (err) {
    console.error(
      "error occur viewing  photoes images files from database:",
      err
    );
    throw err;
  }
};

const getVideos = async () => {
  try {
    const result = await db.query(
      "SELECT * FROM mediafiles WHERE type LIKE 'video/%' ORDER BY id DESC;"
    );
    return result.rows;
  } catch (err) {
    console.error("error occur viewing videos from database:", err);
    throw err;
  }
};

const getmediafileCount = async () => {
  try {
    const result = await db.query("SELECT COUNT(*) AS count FROM mediafiles");
    return result.rows[0].count;
  } catch (error) {
    console.error("Error fetching screen count:", error);
    throw error;
  }
};
const deleteMediaById = async (id) => {
  try {
    const result = await db.query('DELETE FROM mediafiles WHERE id = $1 RETURNING *', [id]);
    return result.rows;
  } catch (err) {
    console.error("Error deleting media file from database:", err);
    throw err;
  }
};

module.exports = {
  uploadMediaInDB,
  viewMedia,
  getPhotoes,
  getVideos,
  getmediafileCount,
  deleteMediaById,
};