const express = require("express");
const pool = require("../config/dbConnection");
const router = express.Router();
const multer = require("multer");
const cloudinary = require("cloudinary").v2;
const fs = require("fs");

// Middleware to check authentication
router.use((req, res, next) => {
  if (!req.session.userId) {
      console.log("erroorrrrr");
    return res.redirect("/login");
  }
  next();
});

// Configure Cloudinary
cloudinary.config({
  cloud_name: "drwl2xsxf",
  api_key: "543595266968914",
  api_secret: "q4Yn9OeUGcgs1O1VYqFgpIh6oW0",
});
// Set up Multer for file uploads (temporarily storing files in 'uploads/' directory)
const upload = multer({ dest: "uploads/" });

// Create Proposal Route
router.post("/create", async (req, res) => {
  const {
    clientName,
    startDate,
    slotDuration,
    endDate,
    cities,
    clientType,
    propertyType,
    plan,
    advertiserTag,
    geoTagging,
    popRequired,
  } = req.body;

  const userId = req.session.userId; // Assuming the user ID is stored in session
  console.log("userId", userId);

  try {
    // Insert the proposal data into the PostgreSQL database
    const result = await pool.query(
      `INSERT INTO proposals (
        client_name, start_date, end_date, slot_duration, cities, client_type, property_type, plan, advertiser_tag, geo_tagging,pop_required,user_id
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10,$11,$12) RETURNING id`,
      [
        clientName,
        startDate,
        endDate,
        slotDuration,
        cities,
        clientType,
        propertyType,
        plan,
        advertiserTag,
        geoTagging === "on" ? true : false, // Convert checkbox to boolean
        popRequired === "on" ? true : false,
        userId,
      ]
    );

    // res.json({ success: true, proposalId: result.rows[0].id });
    // res.redirect('/')
    // res.render('page2Upload', { proposalId: result.rows[0].id });
    // res.render('page2Upload');

    // Redirect to propertiesSelect page with the proposal ID as a query parameter
    res.redirect(`/proposals/propertiesSelect?proposalId=${result.rows[0].id}`);
  } catch (error) {
    console.error("Error saving proposal data:", error);
    res.status(500).json({ success: false, error: "Database error" });
  }
});

// View User's Proposals
router.get("/", async (req, res) => {
  try {
      const userId = req.session.userId;
      console.log("userID of proposal",userId);
      
      // Query to select all proposals with status 'pending'
      const result = await pool.query(
          "SELECT * FROM proposals WHERE user_id = $1 AND status = $2 ORDER BY id DESC",
          [userId, 'pending']
      );

      // Query to select all proposals with status 'Pending Activation'
      const selectResult = await pool.query(
          "SELECT * FROM proposals WHERE user_id = $1 AND status = $2",
          [userId, 'Pending Activation']
      );

      // Query to select all proposals with status 'Discarded'
      const discardProposal = await pool.query(
          "SELECT * FROM proposals WHERE user_id = $1 AND status = $2",
          [userId, 'Discarded']
      );

      // Query to select proposals with status 'Waiting for Admin Approval' or 'Active'
      const waitingOrActiveProposals = await pool.query(
          "SELECT * FROM proposals WHERE user_id = $1 AND status IN ($2, $3)",
          [userId, 'Waiting for Admin Approval', 'Active']
      );

      // Ensure all arrays are defined, even if empty
      const pendingProposals = selectResult.rows || [];
      const discardProposals = discardProposal.rows || [];
      const waitingOrActive = waitingOrActiveProposals.rows || [];

      // Render the 'createProposal' view, passing all the proposal categories
      res.render("createProposal", { 
        proposals: result.rows, 
        pendingProposals, 
        discardProposals, 
        waitingOrActive
      });
      
  } catch (error) {
      console.error("Error retrieving proposal data:", error);
      res.status(500).json({ success: false, error: "Database error" });
  }
});


router.get("/propertiesSelect", async (req, res) => {
  const proposalId = req.query.proposalId; // Get proposal ID from the query parameter
  try {
    // Fetch all properties from the database
    const result = await pool.query(
      "SELECT * FROM public.properties ORDER BY property_id DESC"
    );

    // Fetch the selected proposal based on the dynamic proposalId
    const selectedProposal = await pool.query(
      "SELECT property_ids, property_names, total_properties, total_screens, total_approx_reach, city FROM public.proposals WHERE id = $1", // Fetch only property_ids
      [proposalId] // Pass proposalId as a parameter
    );

    console.log("selectedProposal", selectedProposal.rows);

    // Check if a proposal was found
    if (selectedProposal.rows.length === 0) {
      console.warn(`No proposal found with id ${proposalId}`);
      // Handle case where no proposal is found
      res.render("propertiesSelect", {
        properties: result.rows,
        selectedPropertyIds: [],
        selectedProposal: selectedProposal.rows,
        proposalId,
      });
      return;
    }

    // Log the fetched property_ids
    const propertyIdsArray = selectedProposal.rows[0].property_ids;
    console.log("Fetched property_ids:", propertyIdsArray); // Log the value for debugging

    // Ensure propertyIdsArray is an array before processing
    if (!Array.isArray(propertyIdsArray)) {
      console.error(
        "Expected property_ids to be an array but got:",
        typeof propertyIdsArray
      );
      res.render("propertiesSelect", {
        properties: result.rows,
        selectedPropertyIds: [],
        selectedProposal: selectedProposal.rows,
        proposalId,
      });
      return;
    }

    // Convert the property_ids to numbers (if they are strings)
    const selectedPropertyIds = propertyIdsArray
      .map(Number)
      .filter((id) => !isNaN(id));

    // Render the propertiesSelect view with fetched data
    res.render("propertiesSelect", {
      properties: result.rows,
      selectedPropertyIds,
      selectedProposal: selectedProposal.rows,
      proposalId,
    });
  } catch (error) {
    console.error("Error fetching data", error);
    res.status(500).send("Error fetching data");
  }
});

// Route to handle updating properties based on proposalID
router.post("/saveProperties", async (req, res) => {
  const {
    proposalID,
    propertyIds,
    propertyNames,
    totalProperties,
    totalScreens,
    totalApproxReach,
    propertyCities,
  } = req.body;

  // Validate input
  if (
    !proposalID ||
    !propertyIds ||
    !propertyNames ||
    totalProperties === undefined ||
    totalScreens === undefined ||
    totalApproxReach === undefined
  ) {
    return res
      .status(400)
      .json({ status: "error", message: "Invalid input data" });
  }

  try {
    // Update the properties in the proposals table
    const query = `
      UPDATE public.proposals
      SET 
        property_ids = $2,
        property_names = $3,
        total_properties = $4,
        total_screens = $5,
        total_approx_reach = $6,
        city = $7
      WHERE id = $1
      RETURNING pop_required;
    `;

    const result = await pool.query(query, [
      proposalID,
      propertyIds,
      propertyNames,
      totalProperties,
      totalScreens,
      totalApproxReach,
      propertyCities,
    ]);

    // Check the value of pop_required and send JSON response
    const popRequired = result.rows[0].pop_required;
    res.json({ status: "success", popRequired, proposalID });
  } catch (error) {
    console.error("Database Error:", error);
    res
      .status(500)
      .json({ status: "error", message: "Error updating properties" });
  }
});

router.get("/popRequired", async (req, res) => {
  const proposalID = req.query.proposalID; // Extracting proposalID

  try {
    const selectedProposal = await pool.query(
      "SELECT pop_required, pop_dates, pop_properties, pop_screens, pop_geo_tagging, pop_newspaper_proof, pop_instruction FROM public.proposals WHERE id = $1",
      [proposalID]
    );

    // Log the structure of selectedProposal
    console.log("Selected Proposal Structure:", selectedProposal.rows); // Log the rows returned

    res.render("popRequired", {
      proposalID,
      selectedProposal: selectedProposal.rows,
    });
  } catch (error) {
    console.error("Error fetching proposal:", error);
    res.status(500).send("Internal Server Error");
  }
});

router.get("/pricing", async (req, res) => {
  const proposalID = req.query.proposalID; // Extracting proposalID

  try {
    const selectedProposal = await pool.query(
      "SELECT price,total_screens FROM public.proposals WHERE id = $1",
      [proposalID]
    );

    // Log the structure of selectedProposal
    console.log("Selected Proposal Structure:", selectedProposal.rows); // Log the rows returned

    res.render("pricingPage", {
      proposalID,
      selectedProposal: selectedProposal.rows,
    });
  } catch (error) {
    console.error("Error fetching proposal:", error);
    res.status(500).send("Internal Server Error");
  }
});

router.post("/popSubmit", async (req, res) => {
  try {
    const {
      proposalID,
      pop_dates,
      pop_properties,
      pop_screens,
      pop_geo_tagging,
      pop_newspaper_proof,
      pop_instruction,
    } = req.body;

    // Validate proposalID
    if (!proposalID) {
      return res.status(400).json({ error: "proposalID is required" });
    }

    // Log the data
    // console.log('Updating proposal with ID:', proposalID);
    // console.log('Request body:', req.body);

    const updateQuery = `
          UPDATE proposals
          SET 
              pop_dates = $1,
              pop_properties = $2,
              pop_screens = $3,
              pop_geo_tagging = $4,
              pop_newspaper_proof = $5,
              pop_instruction = $6
          WHERE id = $7
      `;

    await pool.query(updateQuery, [
      pop_dates,
      pop_properties,
      pop_screens,
      pop_geo_tagging,
      pop_newspaper_proof,
      pop_instruction,
      proposalID,
    ]);

    res.status(200).json({ message: "Proposal updated successfully" });
  } catch (error) {
    console.error("Error updating proposal:", error.message);
    res.status(500).json({ error: "Failed to update proposal" });
  }
});

// Route to handle form submission
router.post("/priceSubmit", async (req, res) => {
  const { price, proposalID } = req.body;

  try {
    const updateQuery = `
      UPDATE proposals
      SET 
        price = $1
      WHERE id = $2
    `;

    await pool.query(updateQuery, [price, proposalID]);

    res.status(200).json({ message: "Proposal price updated successfully" });
  } catch (error) {
    console.error("Error updating proposal:", error.message);
    res.status(500).json({ error: "Failed to update price proposal" });
  }
});

// Route to handle purchaseOrderSubmit submission
router.post(
  "/purchaseOrderSubmit",
  upload.single("purchaseOrder"),
  async (req, res) => {
    const { proposalID, orderValue, existingFileURL, originalfileName } =
      req.body; // Extract existingFileURL from the request body
    const file = req.file;

    // Validate that proposalID is provided
    if (!proposalID) {
      return res.status(400).json({ error: "Proposal ID is required" });
    }

    try {
      let pdfFileUrl = existingFileURL; // Default to existing file URL
      let originalFileName = originalfileName;

      // If a new file was uploaded, upload it to Cloudinary
      if (file) {
        const cloudinaryResult = await cloudinary.uploader.upload(file.path, {
          folder: "proposals",
        });
        pdfFileUrl = cloudinaryResult.secure_url; // Use the new URL
        originalFileName = file.originalname; // Get the original file name
      }

      // Prepare SQL query to update the proposal
      const query = `
          UPDATE proposals
          SET order_value = $1, pdf_file_url = $2, pdf_original_file_name = $3
          WHERE id = $4;
      `;
      const values = [orderValue, pdfFileUrl, originalFileName, proposalID];

      // Execute the query to update the proposal
      const dbResult = await pool.query(query, values);

      // Check if the proposal was found and updated
      if (dbResult.rowCount === 0) {
        return res.status(404).json({ error: "Proposal not found" });
      }

      // Delete the local file after uploading it to Cloudinary if a new file was uploaded
      if (file) {
        fs.unlinkSync(file.path);
      }

      // Respond with success message
      res.status(200).json({
        message: "Proposal updated successfully",
      });
    } catch (error) {
      console.error("Error while updating proposal:", error);
      res
        .status(500)
        .json({ error: "An error occurred while updating the proposal" });
    }
  }
);

router.get("/purchaseOrder", async (req, res) => {
  const proposalID = req.query.proposalID; // Extracting proposalID

  try {
    const selectedProposal = await pool.query(
      "SELECT order_value, pdf_file_url, pdf_original_file_name FROM public.proposals WHERE id = $1",
      [proposalID]
    );

    console.log("Selected Proposal Structure:", selectedProposal.rows); // Log the rows returned

    const proposalData =
      selectedProposal.rows.length > 0 ? selectedProposal.rows[0] : null;

    res.render("purchase", {
      proposalID,
      proposalData, // Pass the proposal data to the template
    });
  } catch (error) {
    console.error("Error fetching proposal:", error);
    res.status(500).send("Internal Server Error");
  }
});

router.get("/clientPOC", async (req, res) => {
  const proposalID = req.query.proposalID; // Extracting proposalID

  try {
    const selectedProposal = await pool.query(
      "SELECT poc_name, poc_designation, poc_contact, poc_alt_contact, poc_city, poc_email FROM public.proposals WHERE id = $1",
      [proposalID]
    );

    // Log the structure of selectedProposal
    console.log("Selected Proposal Structure:", selectedProposal.rows); // Log the rows returned

    res.render("clientPOC", {
      proposalID,
      selectedProposal: selectedProposal.rows[0] || {},
    });
  } catch (error) {
    console.error("Error fetching proposal:", error);
    res.status(500).send("Internal Server Error");
  }
});

router.post("/clientPOCFormSubmit", async (req, res) => {
  const {
    proposalID,
    clientPOCName,
    clientPOCDesignation,
    clientPOCContact,
    clientPOCAltContact,
    clientPOCCity,
    clientPOCEmail,
  } = req.body;
  // Validate proposalID
  if (!proposalID) {
    return res.status(400).json({ error: "proposalID is required" });
  }

  console.log("in clientPOCFormSubmit");

  try {
    const query = `
    UPDATE proposals
          SET 
              poc_name = $1,
              poc_designation = $2,
              poc_contact = $3,
              poc_alt_contact = $4,
              poc_city = $5,
              poc_email = $6
          WHERE id = $7
    `;

    const values = [
      clientPOCName,
      clientPOCDesignation,
      clientPOCContact,
      clientPOCAltContact || null,
      clientPOCCity,
      clientPOCEmail,
      proposalID,
    ];
    const result = await pool.query(query, values);

    res
      .status(200)
      .json({ message: "Proposal CLient POC updated successfully" });
  } catch (err) {
    console.error("Error inserting POC Client data:", err);
    res.status(500).send("Error saving data to database.");
  }
});

router.get("/creativeUpload", async (req, res) => {
  const proposalID = req.query.proposalID; // Extracting proposalID

  try {
    const selectedProposal = await pool.query(
      "SELECT url1, url2, url3, url4, url5, creative_instruction FROM public.proposals WHERE id = $1",
      [proposalID]
    );

    // Log the structure of selectedProposal for debugging
    console.log("Selected Proposal Structure:", selectedProposal.rows); // Log the rows returned

    // Passing data to EJS template
    res.render("creativeUpload", {
      proposalID,
      selectedProposal: selectedProposal.rows[0], // assuming you only need the first row
    });
  } catch (error) {
    console.error("Error fetching proposal:", error);
    res.status(500).send("Internal Server Error");
  }
});

// Route to handle creativeUploadSubmit submission
// POST route for form submission
router.post("/creativeUploadSubmit", upload.array("newFiles", 5), async (req, res) => {
  const { proposalID, creativeInstruction, deletedExistingFiles } = req.body;
  const existingFiles = JSON.parse(req.body.existingFiles || "[]"); // Existing file URLs
  const newFiles = req.files; // Newly uploaded files
  let mediaURLs = existingFiles; // Start with existing files that weren't deleted

  console.log("Received data:");
  console.log("Proposal ID:", proposalID);
  console.log("Creative Instruction:", creativeInstruction);
  console.log("Deleted Existing Files:", deletedExistingFiles);
  console.log("New Files:", newFiles);

  try {
      // Remove deleted files from the list
      if (deletedExistingFiles) {
          const deletedFiles = JSON.parse(deletedExistingFiles);
          mediaURLs = mediaURLs.filter(url => !deletedFiles.includes(url));
      }

      // Upload new files to Cloudinary
      const uploadPromises = newFiles.map((file) => {
          return cloudinary.uploader.upload(file.path, { resource_type: "auto" });
      });

      const uploadedFiles = await Promise.all(uploadPromises);

      uploadedFiles.forEach((file, index) => {
          mediaURLs.push(file.secure_url);
          fs.unlinkSync(newFiles[index].path); // Remove file from the server after uploading
      });

      // Only keep up to 5 files (existing + new)
      mediaURLs = mediaURLs.slice(0, 5);

      // Check if proposal exists
      const result = await pool.query("SELECT * FROM public.proposals WHERE id = $1", [proposalID]);

      if (result.rows.length > 0) {
          // Update proposal
          await pool.query(
              `UPDATE public.proposals
               SET url1 = $1, url2 = $2, url3 = $3, url4 = $4, url5 = $5, creative_instruction = $6
               WHERE id = $7`,
              [
                  mediaURLs[0] || null,
                  mediaURLs[1] || null,
                  mediaURLs[2] || null,
                  mediaURLs[3] || null,
                  mediaURLs[4] || null,
                  creativeInstruction,
                  proposalID
              ]
          );
          res.json({ message: "Proposal updated successfully" });
      } else {
          // Create new proposal
          await pool.query(
              `INSERT INTO public.proposals (id, url1, url2, url3, url4, url5, creative_instruction)
               VALUES ($1, $2, $3, $4, $5, $6, $7)`,
              [
                  proposalID,
                  mediaURLs[0] || null,
                  mediaURLs[1] || null,
                  mediaURLs[2] || null,
                  mediaURLs[3] || null,
                  mediaURLs[4] || null,
                  creativeInstruction
              ]
          );
          res.json({ message: "Proposal created successfully" });
      }
  } catch (error) {
      console.error("Error updating/creating proposal:", error);
      res.status(500).json({ error: "Internal Server Error" });
  }
});








router.get("/summaryPage", async (req, res) => {
  const proposalID = req.query.proposalID;

  try {
    // Query the database for proposal details
    const result = await pool.query(
      `SELECT * FROM public.proposals WHERE id = $1`,
      [proposalID]
    );

    if (result.rows.length > 0) {
      const proposal = result.rows[0]; // Get the first result
      // Render the EJS page with the proposal data
      res.render("summary", { proposal });
    } else {
      res.status(404).send("Proposal not found");
    }
  } catch (error) {
    console.error("Error fetching proposal: ", error);
    res.status(500).send("Internal Server Error");
  }
});














// Pending Activation Route
router.post('/SetpendingActivation', async (req, res) => {
  const { proposalId } = req.body;
  try {
      const updateResult = await pool.query(
          'UPDATE proposals SET status = $1 WHERE id = $2 RETURNING *',
          ['Pending Activation', proposalId]
      );

      if (updateResult.rows.length === 0) {
          return res.status(404).json({ message: 'Proposal not found' });
      }

      // Return the updated proposal as JSON
      res.json({ message: 'Proposal updated successfully', updatedProposal: updateResult.rows[0] });
  } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Error updating proposal' });
  }
});



router.post('/SetDiscarded', async (req, res) => {
  const { proposalId } = req.body;
  try {
      const updateResult = await pool.query(
          'UPDATE proposals SET status = $1 WHERE id = $2 RETURNING *',
          ['Discarded', proposalId]
      );

      if (updateResult.rows.length === 0) {
          return res.status(404).json({ message: 'Proposal not found' });
      }

      res.json({ message: 'Proposal discarded successfully', discardedProposal: updateResult.rows[0] });
  } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Error discarding proposal' });
  }
});


router.post('/setToAdminAproval', async (req, res) => {
  const { proposalId } = req.body;

  try {
      const updateResult = await pool.query(
          'UPDATE proposals SET status = $1 WHERE id = $2 RETURNING *',
          ['Waiting for Admin Approval', proposalId] // New status is set here
      );

      if (updateResult.rows.length === 0) {
          return res.status(404).json({ message: 'Proposal not found' });
      }

      // Return the updated proposal as JSON
      res.json({ message: 'Proposal updated successfully', updatedProposal: updateResult.rows[0] });
  } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Error updating proposal' });
  }
});

module.exports = router;
