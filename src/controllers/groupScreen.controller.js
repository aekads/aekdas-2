    const groupScreen = require("../models/groupScreen.model");
    const dotenv = require("dotenv");

    dotenv.config();

    const createGroup = async (req, res) => {
      const { group_name, group_description, screenCount, selectedscreens } = req.body;

      try {
        const groupfound = await groupScreen.getGroupByGroupName(group_name);
        if (!groupfound) {
          // Handle case where group is not found
          // throw new Error("Group not found");
          await groupScreen.createGroup(
            group_name,
            group_description,
            screenCount,
            selectedscreens
          );
          res.redirect("/Dashboard/Screens");
        }else{
          await groupScreen.updateGroup(
            group_name,
            group_description,
            screenCount,
            selectedscreens
          );
          res.redirect("/Dashboard/Screens");
        }
      } catch (err) {
        console.error(err);
        res.status(500).send("create group ERROR");
      }
    };


    const showAvailableScreen = async (req, res) => {
      const { groupName } = req.params;
      let group = null;
      if (groupName) {
        group = await groupScreen.getGroupByGroupName(groupName);
      }

      const screens = await groupScreen.showAvailableScreen();
      res.render("groupScreen", { screens,group});
    };

    const deleteGroup = async (req, res) => {
      const { groupName } = req.params;
      try {
        await groupScreen.deleteGroup(groupName);
        res.sendStatus(204);
      } catch (err) {
        console.error(err);
        res.status(500).send("Delete group ERROR");
      }
    };
    const editGroup = async (req, res) => {
      const { groupName } = req.params;

      try {
        const group = await groupScreen.getGroupByGroupName(groupName);
        const screens = await groupScreen.showAvailableScreen();

        // Ensure selectedscreens field is an array of objects
        if (!Array.isArray(group.selectedscreens)) {
          group.selectedscreens = [];
        }

        res.render("groupScreen", { group, screens });
      } catch (error) {
        console.error("Error editing group:", error);
        res.status(500).send("Edit group ERROR");
      }
    };



    module.exports = {
      createGroup,
      showAvailableScreen,
      deleteGroup,
      editGroup,
    };
