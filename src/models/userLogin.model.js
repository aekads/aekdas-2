const db = require("../config/dbConnection");

const getuserByEmailPass = async (username, password) => {
  try {
    const result = await db.query(
      "SELECT * FROM userLogin WHERE user_email = $1 AND user_password = $2",
      [username, password]
    );
    return result.rows;
  } catch (err) {
    console.error("Error fetching getuserByEmailPass:", err);
    throw err;
  }
};

module.exports = {
  getuserByEmailPass,
};
