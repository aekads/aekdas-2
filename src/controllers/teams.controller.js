const userModel = require("../models/Teams.model");
const dotenv = require("dotenv");

dotenv.config();

const addMember = async (req, res) => {
  const { memberName, memberEmail, role, memberPassword } = req.body;
  try {
    const existingMembers = await userModel.findMemberByEmail(memberEmail);
    if (existingMembers.length > 0) {
      res.render("Teams", { message: "Member with this email already exists" });
    }

    const user = await userModel.createTeamMember(
      memberName,
      memberEmail,
      role,
      memberPassword
    );
    res.render("Teams", { message: "successfully registered member" });
  } catch (err) {
    console.error(err);
    res.status(500).send("addmember error");
  }
};

module.exports = {
  addMember,
};
