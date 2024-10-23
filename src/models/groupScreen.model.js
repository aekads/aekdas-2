const db = require("../config/dbConnection");

const createGroup = async (groupName, description, screenCount,selectedScreen) => {
  try {
    const result = await db.query(
      "INSERT INTO groupscreen (group_name,group_description,total_screen,selectedscreens) VALUES ($1,$2,$3,$4)",
      [groupName, description, screenCount,selectedScreen]
    );
    return result.rows[0];
  } catch (error) {
    console.error("error occur at creating new group  in Screen:", error);
    throw error;
  }
};

const showAvailableScreen = async () => {
  try {
    const result = await db.query(
       "SELECT * FROM screens WHERE  deleted = false ORDER BY screenid DESC"
    );
    return result.rows;
  } catch (error) {
    console.error("Error occurred at fetching all screens:", error);
    throw error;
  }
};

const deleteGroup = async (groupName) => {
  try {
    const result = await db.query(
      " UPDATE groupscreen SET deleted = TRUE WHERE group_name = $1",
      [groupName]
    );
  } catch (error) {
    console.error("Error occurred at update group of deleted", error);
    throw error;
  }
};

const getGroupByGroupName = async (groupName) => {
  try {
    const result = await db.query(
      "SELECT * FROM groupscreen WHERE group_name = $1",
      [groupName]
    );
    const group = result.rows[0];

    if (group) {
      // Ensure selectedscreens is an array
      group.selectedscreens = group.selectedscreens || [];
    } else {
      return null; // Return null or throw an error if group is not found
    }

    return group;
  } catch (error) {
    console.error("Error occurred while getting group by group name:", error);
    throw error;
  }
};



const updateGroup = async (groupName, description, screenCount, selectedScreens) => {
  try {
    // Convert selectedScreens to JSONB array
    const jsonbArray = selectedScreens.map(screen => JSON.stringify(screen));

    await db.query(
      "UPDATE groupscreen SET group_description = $2, total_screen = $3, selectedscreens = $4 WHERE group_name = $1",
      [groupName, description, screenCount, jsonbArray]
    );
  } catch (error) {
    console.error("Error occurred while updating group details:", error);
    throw error;
  }
};


module.exports = {
  createGroup,
  showAvailableScreen,
  deleteGroup,
  getGroupByGroupName,
  updateGroup
};
