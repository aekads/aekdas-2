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
        INSERT INTO playlists (
        screen_id, playlistname, playlistdescription,
        slot1, slot2, slot3, slot4, slot5, slot6, slot7, slot8, slot9, slot10,
        slot11, slot12, slot13, slot14, slot15, slot16, slot17, slot18, slot19, slot20,
        slot21, slot22, slot23, slot24, slot25, slot26, slot27, slot28, slot29, slot30,
        slot31, slot32, slot33, slot34, slot35, slot36, slot37, slot38, slot39, slot40,
        slot41, slot42, slot43, slot44, slot45, slot46, slot47, slot48, slot49, slot50
      ) 
      VALUES (
        $1, $2, $3, 
        $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, 
        $15, $16, $17, $18, $19, $20, $21, $22, $23, $24, 
        $25, $26, $27, $28, $29, $30, $31, $32, $33, $34, 
        $35, $36, $37, $38, $39, $40, $41, $42, $43, $44, 
        $45, $46, $47, $48, $49, $50, $51, $52, $53
      ) 
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
urls[10] || null,
urls[11] || null,
urls[12] || null,
urls[13] || null,
urls[14] || null,
urls[15] || null,
urls[16] || null,
urls[17] || null,
urls[18] || null,
urls[19] || null,
urls[20] || null,
urls[21] || null,
urls[22] || null,
urls[23] || null,
urls[24] || null,
urls[25] || null,
urls[26] || null,
urls[27] || null,
urls[28] || null,
urls[29] || null,
urls[30] || null,
urls[31] || null,
urls[32] || null,
urls[33] || null,
urls[34] || null,
urls[35] || null,
urls[36] || null,
urls[37] || null,
urls[38] || null,
urls[39] || null,
urls[40] || null,
urls[41] || null,
urls[42] || null,
urls[43] || null,
urls[44] || null,
urls[45] || null,
urls[46] || null,
urls[47] || null,
urls[48] || null,
urls[49] || null,
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
SET 
   screen_id = $2,
    playlistname = $3,
    playlistdescription = $4, 
    slot1 = $5,
    slot2 = $6,
    slot3 = $7,
    slot4 = $8, 
    slot5 = $9,
    slot6 = $10,
    slot7 = $11,
    slot8 = $12, 
    slot9 = $13,
    slot10 = $14,
    slot11 = $15,
    slot12 = $16,
    slot13 = $17,
    slot14 = $18,
    slot15 = $19,
    slot16 = $20,
    slot17 = $21,
    slot18 = $22,
    slot19 = $23,
    slot20 = $24,
    slot21 = $25,
    slot22 = $26,
    slot23 = $27,
    slot24 = $28,
    slot25 = $29,
    slot26 = $30,
    slot27 = $31,
    slot28 = $32,
    slot29 = $33,
    slot30 = $34,
    slot31 = $35,
    slot32 = $36,
    slot33 = $37,
    slot34 = $38,
    slot35 = $39,
    slot36 = $40,
    slot37 = $41,
    slot38 = $42,
    slot39 = $43,
    slot40 = $44,
    slot41 = $45,
    slot42 = $46,
    slot43 = $47,
    slot44 = $48,
    slot45 = $49,
    slot46 = $50,
    slot47 = $51,
    slot48 = $52,
    slot49 = $53,
    slot50 = $54
  WHERE id = $1
  RETURNING *;  -- Moved RETURNING to be part of the UPDATE statement
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
      urls[10] || null,
urls[11] || null,
urls[12] || null,
urls[13] || null,
urls[14] || null,
urls[15] || null,
urls[16] || null,
urls[17] || null,
urls[18] || null,
urls[19] || null,
urls[20] || null,
urls[21] || null,
urls[22] || null,
urls[23] || null,
urls[24] || null,
urls[25] || null,
urls[26] || null,
urls[27] || null,
urls[28] || null,
urls[29] || null,
urls[30] || null,
urls[31] || null,
urls[32] || null,
urls[33] || null,
urls[34] || null,
urls[35] || null,
urls[36] || null,
urls[37] || null,
urls[38] || null,
urls[39] || null,
urls[40] || null,
urls[41] || null,
urls[42] || null,
urls[43] || null,
urls[44] || null,
urls[45] || null,
urls[46] || null,
urls[47] || null,
urls[48] || null,
urls[49] || null,
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
            slot11 = NULL,
  slot12 = NULL,
  slot13 = NULL,
  slot14 = NULL,
  slot15 = NULL,
  slot16 = NULL,
  slot17 = NULL,
  slot18 = NULL,
  slot19 = NULL,
  slot20 = NULL,
  slot21 = NULL,
  slot22 = NULL,
  slot23 = NULL,
  slot24 = NULL,
  slot25 = NULL,
  slot26 = NULL,
  slot27 = NULL,
  slot28 = NULL,
  slot29 = NULL,
  slot30 = NULL,
  slot31 = NULL,
  slot32 = NULL,
  slot33 = NULL,
  slot34 = NULL,
  slot35 = NULL,
  slot36 = NULL,
  slot37 = NULL,
  slot38 = NULL,
  slot39 = NULL,
  slot40 = NULL,
  slot41 = NULL,
  slot42 = NULL,
  slot43 = NULL,
  slot44 = NULL,
  slot45 = NULL,
  slot46 = NULL,
  slot47 = NULL,
  slot48 = NULL,
  slot49 = NULL,
  slot50 = NULL

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
          slot10 = $12,
          slot11 = $13,
  slot12 = $14,
  slot13 = $15,
  slot14 = $16,
  slot15 = $17,
  slot16 = $18,
  slot17 = $19,
  slot18 = $20,
  slot19 = $21,
  slot20 = $22,
  slot21 = $23,
  slot22 = $24,
  slot23 = $25,
  slot24 = $26,
  slot25 = $27,
  slot26 = $28,
  slot27 = $29,
  slot28 = $30,
  slot29 = $31,
  slot30 = $32,
  slot31 = $33,
  slot32 = $34,
  slot33 = $35,
  slot34 = $36,
  slot35 = $37,
  slot36 = $38,
  slot37 = $39,
  slot38 = $40,
  slot39 = $41,
  slot40 = $42,
  slot41 = $43,
  slot42 = $44,
  slot43 = $45,
  slot44 = $46,
  slot45 = $47,
  slot46 = $48,
  slot47 = $49,
  slot48 = $50,
  slot49 = $51,
  slot50 = $52
        WHERE screenid = $53
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
        urls[10] || null,
        urls[11] || null,
        urls[12] || null,
        urls[13] || null,
        urls[14] || null,
        urls[15] || null,
        urls[16] || null,
        urls[17] || null,
        urls[18] || null,
        urls[19] || null,
        urls[20] || null,
        urls[21] || null,
        urls[22] || null,
        urls[23] || null,
        urls[24] || null,
        urls[25] || null,
        urls[26] || null,
        urls[27] || null,
        urls[28] || null,
        urls[29] || null,
        urls[30] || null,
        urls[31] || null,
        urls[32] || null,
        urls[33] || null,
        urls[34] || null,
        urls[35] || null,
        urls[36] || null,
        urls[37] || null,
        urls[38] || null,
        urls[39] || null,
        urls[40] || null,
        urls[41] || null,
        urls[42] || null,
        urls[43] || null,
        urls[44] || null,
        urls[45] || null,
        urls[46] || null,
        urls[47] || null,
        urls[48] || null,
        urls[49] || null,
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
          slot10 = NULL,
          slot11 = NULL,
          slot12 = NULL,
          slot13 = NULL,
          slot14 = NULL,
  slot15 = NULL,
  slot16 = NULL,
  slot17 = NULL,
  slot18 = NULL,
  slot19 = NULL,
  slot20 = NULL,
  slot21 = NULL,
  slot22 = NULL,
  slot23 = NULL,
  slot24 = NULL,
  slot25 = NULL,
  slot26 = NULL,
  slot27 = NULL,
  slot28 = NULL,
  slot29 = NULL,
  slot30 = NULL,
  slot31 = NULL,
  slot32 = NULL,
  slot33 = NULL,
  slot34 = NULL,
  slot35 = NULL,
  slot36 = NULL,
  slot37 = NULL,
  slot38 = NULL,
  slot39 = NULL,
  slot40 = NULL,
  slot41 = NULL,
  slot42 = NULL,
  slot43 = NULL,
  slot44 = NULL,
  slot45 = NULL,
  slot46 = NULL,
  slot47 = NULL,
  slot48 = NULL,
  slot49 = NULL,
  slot50 = NULL
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





// const searchScreenidandRemove = async (screenID) => {
//   try {
//     // Query to select all rows where the screenID is present in the screen_id column
//     const result = await db.query(`
//       SELECT id, screen_id, playlistname, playlistdescription, slot1, slot2, slot3, slot4, slot5, slot6, slot7, slot8, slot9, slot10 
//       FROM public.playlists
//       WHERE screen_id LIKE $1
//       ORDER BY id DESC;
//     `, [`%${screenID}%`]);

//     return result.rows;
//   } catch (error) {
//     throw new Error('Error fetching playlists with the given screenID');
//   }
// };


// Function to search for screenID in playlists and remove it
const searchScreenidandRemove = async (screenID) => {
  try {
    // Step 1: Query to select all rows where the screenID is present in the screen_id column
    const result = await db.query(`
      SELECT id, screen_id, playlistname, playlistdescription, slot1, slot2, slot3, slot4, slot5, slot6, slot7, slot8, slot9, slot10 
      FROM public.playlists
      WHERE screen_id LIKE $1
      ORDER BY id DESC;
    `, [`%${screenID}%`]);

    const rows = result.rows;

    // Step 2: Iterate through the results and update the screen_id by removing the specific screenID
    for (let row of rows) {
      await db.query(`
        UPDATE public.playlists
        SET screen_id = TRIM(BOTH ',' FROM REPLACE(screen_id, $1, ''))
        WHERE id = $2;
      `, [screenID, row.id]);
    }

    return { message: `Successfully removed screenID ${screenID} from all matching records.`, affectedRows: rows.length };

  } catch (error) {
    throw new Error('Error updating playlists with the given screenID');
  }
};



module.exports={
    createPlaylist,viewPlaylist,updateScreensWithPlaylist,getPlaylistById,editPlaylist,deletePlaylist,deleteScreensWithPlaylist,
    getScreenIDsByPlaylistId,deletePlaylistById,searchScreenidandRemove
}



