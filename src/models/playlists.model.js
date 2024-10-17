

const db = require("../config/dbConnection");

const createPlaylist = async (playlistData) => {
  const {screenIDs,  playlistName, playlistDescription, urls } = playlistData;
  console.log("urls", urls);
    console.log("screenID", screenIDs);
    console.log("playlistName", playlistName);
    console.log("playlistDescription", playlistDescription);
  try {
    // Insert into playlists table
    const query = `
      INSERT INTO playlists ( screen_id,playlistname, playlistdescription, slot1, slot2, slot3, slot4, slot5, slot6, slot7, slot8, slot9, slot10)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12,$13)
      RETURNING *;
    `;
    const values = [
      screenIDs,
      playlistName,
      playlistDescription,
      urls[0] || null,
      urls[1] || null,
      urls[2] || null,
      urls[3] || null,
      urls[4] || null,
      urls[5] || null,
      urls[6] || null,
      urls[7] || null,
      urls[8] || null,
      urls[9] || null,
    ];

    // Execute query and return newly created playlist
    const { rows } = await db.query(query, values);
    return rows[0];
  } catch (error) {
    throw new Error('Error creating playlist');
  }
};


const editPlaylist = async (playlistData) => {
  const {screenIDs,  playlistName, playlistDescription, urls,playlistId } = playlistData;
  console.log("urls", urls);
  console.log("screenID", screenIDs);
  console.log("playlistName", playlistName);
  console.log("playlistDescription", playlistDescription);

  try {
    // Update playlists table
    const query = `
      UPDATE playlists
      SET screen_id =$2,
          playlistname = $3,
          playlistdescription = $4, 
          slot1 = $5,
          slot2 =  $6,
          slot3 =  $7,
          slot4 =   $8, 
          slot5 =   $9,
          slot6 =  $10,
          slot7 =  $11,
          slot8 =  $12, 
          slot9 = $13,
          slot10 = $14
      WHERE id=  $1
      RETURNING *;
    `;
    const values = [
      playlistId,
      screenIDs,
      playlistName,
      playlistDescription,
      urls[0] || null,
      urls[1] || null,
      urls[2] || null,
      urls[3] || null,
      urls[4] || null,
      urls[5] || null,
      urls[6] || null,
      urls[7] || null,
      urls[8] || null,
      urls[9] || null,
    ];

    // Execute query and return updated playlist
    const { rows } = await db.query(query, values);
    return rows[0];
  } catch (error) {
    throw new Error('Error updating playlist');
  }
};


// const deletePlaylist = async (playlistData) => {
//   const {screenIDs,  playlistName, playlistDescription, urls,playlistId } = playlistData;
//   console.log("urls", urls);
//   console.log("screenID", screenIDs);
//   console.log("playlistName", playlistName);
//   console.log("playlistDescription", playlistDescription);

//   try {
//     // Update playlists table
//     const query = `
//       UPDATE playlists
//       SET screen_id =$2,
//           playlistname = $3,
//           playlistdescription = $4, 
//           slot1 = $5,
//           slot2 =  $6,
//           slot3 =  $7,
//           slot4 =   $8, 
//           slot5 =$9,
//           slot6 =  $10,
//           slot7 =  $11,
//           slot8 =  $12, 
//           slot9 = $13,
//           slot10 = $14
//       WHERE id=  $1
//       RETURNING *;
//     `;
//     const values = [
//       playlistId,
//       screenIDs,
//       playlistName,
//       playlistDescription,
//       urls[0] || null,
//       urls[1] || null,
//       urls[2] || null,
//       urls[3] || null,
//       urls[4] || null,
//       urls[5] || null,
//       urls[6] || null,
//       urls[7] || null,
//       urls[8] || null,
//       urls[9] || null,
//     ];

//     // Execute query and return updated playlist
//     const { rows } = await db.query(query, values);
//     return rows[0];
//   } catch (error) {
//     throw new Error('Error delete playlist');
//   }
// };


const deletePlaylist = async (playlistData) => {
  const { playlistId } = playlistData;

  try {
    // Update playlists table to set fields to null
    const query = `
      UPDATE playlists
      SET screen_id = NULL,
          playlistname = NULL,
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
      WHERE id = $1
      RETURNING *;
    `;

    const values = [playlistId];

    // Execute query and return updated playlist
    const { rows } = await db.query(query, values);
    return rows[0];
  } catch (error) {
    throw new Error('Error deleting playlist');
  }
};

// const deletePlaylistById = async (playlistId) => {
//   const query = `DELETE FROM playlists WHERE id = $1 RETURNING *`;
//   const { rows } = await db.query(query, [playlistId]);
//   return rows[0];
// };


const viewPlaylist=async()=>{
  try {
   const result = await db.query('SELECT * FROM playlists ORDER BY id DESC');
    return result.rows;
  } catch (error) {
    throw new Error('Error show playlist');
  }
}



const updateScreensWithPlaylist = async (screenIDs, playlistName, playlistDescription, urls) => {
  try {
    
    const updatePromises = screenIDs.map(async (screenID, index) => {
      const query = `
        UPDATE screens
        SET 
          playlistname = $1,
          playlistdescription = $2,
          slot1 = $3,
          slot2 = $4,
          slot3 = $5,
          slot4 = $6,
          slot5 = $7,
          slot6 = $8,
          slot7 = $9,
          slot8 = $10,
          slot9 = $11,
          slot10 = $12
        WHERE screenid = $13
      `;
      const values = [
        playlistName,
        playlistDescription,
        urls[0] || null,
        urls[1] || null,
        urls[2] || null,
        urls[3] || null,
        urls[4] || null,
        urls[5] || null,
        urls[6] || null,
        urls[7] || null,
        urls[8] || null,
        urls[9] || null,
        screenID,
      ];

      await db.query(query, values);
    });

    await Promise.all(updatePromises);
  
  } catch (error) {
    console.error("Error updating screens with playlist:", error);
    throw new Error("Failed to update screens with playlist");
  }
};

// const deleteScreensWithPlaylist = async (playlistData) => {
//   const {screenIDs,  playlistName, playlistDescription, urls } = playlistData;

//   try {
    
//     const updatePromises = screenIDs.map(async (screenID, index) => {
//       const query = `
//         UPDATE screens
//         SET 
//           playlistname = $1,
//           playlistdescription = $2,
//           slot1 = $3,
//           slot2 = $4,
//           slot3 = $5,
//           slot4 = $6,
//           slot5 = $7,
//           slot6 = $8,
//           slot7 = $9,
//           slot8 = $10,
//           slot9 = $11,
//           slot10 = $12
//         WHERE screenid = $13
//       `;
//       const values = [
//         playlistName,
//         playlistDescription,
//         urls[0] || null,
//         urls[1] || null,
//         urls[2] || null,
//         urls[3] || null,
//         urls[4] || null,
//         urls[5] || null,
//         urls[6] || null,
//         urls[7] || null,
//         urls[8] || null,
//         urls[9] || null,
//         screenID,
//       ];

//       await db.query(query, values);
//     });

//     await Promise.all(updatePromises);
  
//   } catch (error) {
//     console.error("Error deleted screens with playlist:", error);
//     throw new Error("Failed to delted screens with playlist");
//   }
// };


// const deleteScreensWithPlaylist = async (screenIDs) => {
//   try {
//     const updatePromises = screenIDs.map(async (screenID) => {
//       const query = `
//         UPDATE screens
//         SET 
//           playlistname = NULL,
//           playlistdescription = NULL,
//           slot1 = NULL,
//           slot2 = NULL,
//           slot3 = NULL,
//           slot4 = NULL,
//           slot5 = NULL,
//           slot6 = NULL,
//           slot7 = NULL,
//           slot8 = NULL,
//           slot9 = NULL,
//           slot10 = NULL
//         WHERE screenid = $1
//       `;
//       const values = [screenID];

//       await db.query(query, values);
//     });

//     await Promise.all(updatePromises);

//   } catch (error) {
//     console.error("Error deleting screens with playlist:", error);
//     throw new Error("Failed to delete screens with playlist");
//   }
// };


// const getScreenIDsByPlaylistId = async (playlistId) => {
//   const query = `SELECT screen_id FROM playlists WHERE id = $1`;
//   const { rows } = await db.query(query, [playlistId]);
  
//   if (rows.length === 0) {
//     return [];
//   }

//   const screenIDs = rows[0].screen_id;

//   // Remove curly braces and split by comma, then filter out non-numeric values
//   return screenIDs
//     .replace(/[{}]/g, '')
//     .split(',')
//     .map(id => id.trim())
//     .filter(id => !isNaN(id))
//     .map(id => parseInt(id, 10));
// };








const getScreenIDsByPlaylistId = async (playlistId) => {
  try {
    const query = `SELECT screen_id FROM playlists WHERE id = $1`;
    const { rows } = await db.query(query, [playlistId]);

    // Log the raw result from the database
    console.log("Raw rows from database:", rows);

    if (rows.length === 0) {
      return [];
    }

    const screenIDs = rows[0].screen_id;

    // Log the raw screenIDs value before processing
    console.log("Raw screen IDs:", screenIDs);

    // Remove curly braces, split by comma, trim quotes, and filter out non-numeric values
    const formattedScreenIDs = screenIDs
      .replace(/[{}]/g, '')
      .split(',')
      .map(id => id.replace(/"/g, '').trim())
      .filter(id => !isNaN(id))
      .map(id => parseInt(id, 10));

    // Log the formatted screen IDs
    console.log("Formatted Screen IDs:", formattedScreenIDs);

    return formattedScreenIDs;
  } catch (error) {
    console.error("Error fetching screen IDs:", error);
    throw new Error("Failed to fetch screen IDs");
  }
};


const deleteScreensWithPlaylist = async (screenIDs) => {
  try {
    const updatePromises = screenIDs.map(async (screenID) => {
      const query = `
        UPDATE screens
        SET 
          playlistname = NULL,
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
      `;
      await db.query(query, [screenID]);
    });

    await Promise.all(updatePromises);
    console.log("Screens updated successfully");
  } catch (error) {
    console.error("Error deleting screens with playlist:", error);
    throw new Error("Failed to delete screens with playlist");
  }
};

const deletePlaylistById = async (playlistId) => {
  try {
    const query = `DELETE FROM playlists WHERE id = $1 RETURNING *`;
    const { rows } = await db.query(query, [playlistId]);
    return rows[0];
  } catch (error) {
    console.error("Error deleting playlist:", error);
    throw new Error("Failed to delete playlist");
  }
};
























const getPlaylistById = async (playlistId) => {
  try {
    const result = await db.query('SELECT * FROM playlists WHERE id = $1', [playlistId]);
    return result.rows[0];
  } catch (error) {
    throw new Error('Error fetching playlist');
  }
};
module.exports={
    createPlaylist,viewPlaylist,updateScreensWithPlaylist,getPlaylistById,editPlaylist,deletePlaylist,deleteScreensWithPlaylist,getScreenIDsByPlaylistId,deletePlaylistById
}











