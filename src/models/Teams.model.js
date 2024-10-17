const db = require("../config/dbConnection");
// const bcrypt = require("bcryptjs");

const createTeamMember = async (
  memberName,
  memberEmail,
  role,
  memberPassword
) => {
  try {
    // const hashedPassword = await bcrypt.hash(memberPassword, 12);
    const result = await db.query(
      "INSERT INTO teamMember (memberName, memberEmail,role,memberPassword) VALUES ($1,$2,$3,$4)",
      [memberName, memberEmail, role, memberPassword]
    );
    
    return result.rows;
  } catch (err) {
    console.error("error occur at add member in teams:", err);
    throw err;
  }
};


const findMember = async (memberEmail, memberPassword) => {
  try {
    const result = await db.query(
      "SELECT * FROM teamMember WHERE memberEmail=$1",
      [memberEmail]
    );

    const user = result.rows[0];
    
    if (user) {
      // const passwordMatch = await bcrypt.compare(memberPassword, user.memberpassword);
      if (memberPassword) {
        return user;
      } else {
        return null; // Password does not match
      }
    } else {
      return null; // User not found
    }
  } catch (err) {
    console.error("Error occurred at find member in teams:", err);
    throw err;
  }
};

const findMemberByEmail = async (memberEmail) => {
  try {
    const result = await db.query("SELECT * FROM teamMember WHERE memberEmail=$1", [memberEmail]);
    return result.rows;
  } catch (err) {
    console.error("Error occurred at find member in teams:", err);
    throw err;
  }
};

module.exports = {
  createTeamMember,
  findMember,
  findMemberByEmail
};
