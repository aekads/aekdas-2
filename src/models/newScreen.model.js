const db = require("../config/dbConnection");

const newScreen = async (
  pairingCode,
  screenName,
  tags,
  location,
  city,
  state,
  country,
  pincode
) => {
  try {
    const result = await db.query(
      "INSERT INTO screens (PairingCode,ScreenName,Tags,Location,City,State,Country,Pincode) VALUES ($1,$2,$3,$4,$5,$6,$7,$8)",
      [pairingCode, screenName, tags, location, city, state, country, pincode]
    );

    return result.rows;
  } catch (err) {
    console.error("error occur at add new Screen in Screen:", err);
    throw err;
  }
};

const screenByPairingCode = async (pairingCode) => {
  try {
    const result = await db.query(
      "SELECT * FROM screens WHERE screenid=$1",
      [pairingCode]
    );
    return result.rows;
  } catch (err) {
    console.error("Error occurred at find SCREEN in SCREEN TABLE:", err);
    throw err;
  }
};
const screenByName = async (screenName) => {
  try {
    const result = await db.query(
      "SELECT * FROM screens WHERE screenname=$1",
      [screenName]
    );
    return result.rows;
  } catch (err) {
    console.error("Error occurred at find SCREEN name in SCREEN TABLE:", err);
    throw err;
  }
};
const getAllScreens = async () => {
  try {
    const result = await db.query("SELECT * FROM screens ORDER BY screenid DESC");
    return result.rows;
  } catch (err) {
    console.error("Error occurred at fetching all screens:", err);
    throw err;
  }
};

const getNotdeletedScreen = async () => {
  try {
    const result = await db.query(
      "SELECT * FROM screens WHERE  deleted = false ORDER BY screenid DESC"
    );
    return result.rows;
  } catch (err) {
    console.error("Error occurred at fetching all screens:", err);
    throw err;
  }
};

const updateDeleteScreen = async (screenid) => {
  try {
    const result = await db.query(
      "UPDATE screens SET deleted = true WHERE screenid = $1",
      [screenid]
    );
 
  } catch (err) {
    console.error("Error updating screen:", err);
    res.status(500).send("Error updating screen");
  }
};

const restoreScreenInDB = async (screenid) => {
  try {
    const result = await db.query(
      "UPDATE screens SET deleted = false WHERE screenid = $1",
      [screenid]
    );
    return result.rows;
  } catch (err) {
    console.error("Error restoring  screen:", err);
    res.status(500).send("Error restoring  screen");
  }
};

const editScreen = async (
  screenid,
  pairingCode,
  screenName,
  tags,
  location,
  city,
  state,
  country,
  pincode
) => {
  try {
    const result = await db.query(
      "UPDATE screens SET screenname = $2, tags = $3, location = $4, city = $5, state = $6, country = $7, pincode = $8,pairingcode = $9 WHERE screenid = $1",
      [screenid, screenName, tags, location, city, state, country, pincode,pairingCode]
    );
    return result.rows;
  } catch (err) {
    console.error("Error updating screen:", err);
    throw err;
  }
};

const getTotalScreenCount = async () => {
  try {
    const result = await db.query("SELECT COUNT(*) AS count FROM screens");
    return result.rows[0].count;
  } catch (error) {
    console.error("Error fetching screen count:", error);
    throw error;
  }
};

const getNotDeletedScreenCount = async () => {
  try {
    const result = await db.query(
      "SELECT COUNT(*) AS count FROM screens WHERE deleted=false"
    );
    return result.rows[0].count;
  } catch (error) {
    console.error("Error fetching not deleted screen count:", error);
    throw error;
  }
};
const getOnlineCountByClientTable = async () => {
  try {
    const result = await db.query(
      "SELECT COUNT(*) AS count FROM client_statuses WHERE status='online'"
    );
    return result.rows[0].count;
  } catch (error) {
    console.error("Error fetching not deleted screen count:", error);
    throw error;
  }
};

const getOfflineCountByClientTable = async () => {
  try {
    const result = await db.query(
      "SELECT COUNT(*) AS count FROM client_statuses WHERE status='offline'"
    );
    return result.rows[0].count;
  } catch (error) {
    console.error("Error fetching not deleted screen count:", error);
    throw error;
  }
};
const getDeletedScreenCount = async () => {
  try {
    const result = await db.query(
      "SELECT COUNT(*) AS count FROM screens WHERE deleted=true"
    );
    return result.rows[0].count;
  } catch (error) {
    console.error("Error fetching  deleted screen count:", error);
    throw error;
  }
};

const getDeletedScreen = async () => {
  try {
    const result = await db.query(
      "SELECT * FROM screens WHERE deleted = true ORDER BY screenid DESC"
    );
    return result.rows;
  } catch (err) {
    console.error("Error fetching deleted screens:", err);
    throw err;
  }
};


const getScreenById = async (id) => {
  try {
    const result = await db.query("SELECT * FROM screens WHERE screenid = $1", [id]);
    return result.rows[0]; // Assuming only one row is returned
  } catch (err) {
    console.error("Error fetching screen by ID:", err);
    throw err;
  }
};


const getGroupScreen=async () => {
try {
  const result = await db.query(
    "SELECT * FROM  groupscreen WHERE deleted=false"
  );
  return result.rows;
} catch (err) {
  console.error("Error occurred at fetching group screens:", err);
  throw err;
}}

const deletePlaylist = async (screenid) => {

  try {
    // Construct the SQL query to update fields to NULL
    const query = `
      UPDATE screens
      SET playlistname = NULL,
          playlistdescription = NULL,
          slot1 = NULL,
          slot2 = NULL,
          slot3 = NULL,
          slot4 = NULL,
          slot5 = NULL,
          slot6 = NULL,
          slot7 = NULL,
          slot8 = NULL,
          slot9 = NULL,
          slot10 = NULL
      WHERE screenid = $1
      RETURNING *
    `;
    
    // Execute the query with the screenId parameter
    const rows  = await db.query(query, [screenid]);

    return rows[0];

    
  } catch (error) {
    console.error("Error deleting playlist:", error);
    // res.status(500).json({ error: "Failed to delete playlist" });
  }
};


const deleteScreenById = async (screenid) => {
  const query = 'DELETE FROM screens WHERE screenid = $1';
  const values = [screenid];
  try {
      const result = await db.query(query, values);
      return result.rowCount > 0; // returns true if a row was deleted
  } catch (error) {
      throw error;
  }
};


const getStatus = async () => {
  try {
    const result = await db.query("SELECT * FROM client_statuses ORDER BY status DESC");
    return result.rows;
  } catch (err) {
    console.error("Error fetching client statuses:", err);
    throw err;
  }
};

const getClientStatuses = async () => {                                           
  try {
    const result = await db.query("SELECT * FROM client_statuses ORDER BY client_id DESC");
    console.log("Fetched client statuses:", result.rows); // Debugging
    return result.rows;
  } catch (err) {
    console.error("Error occurred at fetching all screens:", err);
    throw err;
  }
};


// Function to fetch device config by client_name
const deviceConfig = async (client_name) => {                                           
  try {
    const result = await db.query("SELECT client_name, ram_total, ram_used, storage_total, storage_used, resolution, downstream_bandwidth, upstream_bandwidth, date_time, manufacturer, model, os_version, wifi_enabled, wifi_mac_address, wifi_network_ssid, wifi_signal_strength_dbm, android_id, updated_at, ifsecondscreenispresentondevice FROM device_configs WHERE client_name = $1", [client_name]); 
    return result.rows[0]; // Return the first matching result
  } catch (err) {
    console.error("Error occurred at fetching device config:", err);
    throw err;
  }
};


const AllOnlineScreens = async () => {
  try {
    // Query to get all online clients
    const clientStatuses = await db.query("SELECT * FROM client_statuses WHERE status='online'");
    // console.log("clientStatuses",clientStatuses.rows);
    
    // Query to get all screens
    const screens = await db.query("SELECT * FROM Screens");

    // Filter screens where screen.screenid matches client_statuses.client_name
    const onlineScreens = screens.rows.map(screen => {
      const status = clientStatuses.rows.find(client => client.client_name == screen.screenid);
      return {
        ...screen,
        status: status ? status.status : 'offline',
        lastResponse: status ? status.updated_at : null
      };
    }).filter(screen => screen.status === 'online');
// console.log("onlineScreens",onlineScreens);

    // Return the filtered screens and total online count
    return {
      onlineScreens,
      totalOnlineCount: onlineScreens.length
    };
  } catch (err) {
    console.error("Error fetching client statuses:", err);
    throw err;
  }
};


const AllOfflineScreens = async () => {
  try {
    // Query to get all online clients
    const clientStatuses = await db.query("SELECT * FROM client_statuses WHERE status='offline'");
    // console.log("clientStatuses",clientStatuses.rows);
    
    // Query to get all screens
    const screens = await db.query("SELECT * FROM Screens");

// Filter screens where screen.screenid matches client_statuses.client_name
const offlineScreens = screens.rows.map(screen => {
  const status = clientStatuses.rows.find(client => client.client_name == screen.screenid);
  return {
    ...screen,
    status: status ? status.status : 'online',
    lastResponse: status ? status.updated_at : null
  };
}).filter(screen => screen.status === 'offline');
// console.log("onlineScreens",onlineScreens);

    // Return the filtered screens and total online count
    return {
      offlineScreens,
      totalOfflineCount: offlineScreens.length
    };
  } catch (err) {
    console.error("Error fetching client statuses:", err);
    throw err;
  }
};


module.exports = {
  restoreScreenInDB,
  newScreen,
  screenByPairingCode,
  getAllScreens,
  getNotdeletedScreen,
  updateDeleteScreen,
  editScreen,
  getTotalScreenCount,
  getNotDeletedScreenCount,
  getDeletedScreenCount,
  getDeletedScreen,
  getGroupScreen,
  deletePlaylist,
  deleteScreenById,
 screenByName,getStatus,getOnlineCountByClientTable,getOfflineCountByClientTable,getClientStatuses,getScreenById,deviceConfig,
 AllOnlineScreens,
 AllOfflineScreens
};

