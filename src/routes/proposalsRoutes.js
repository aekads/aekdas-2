const express = require('express');
const pool = require('../config/dbConnection');
const router = express.Router();

router.get('/', async (req, res) => {
    // This route is only accessible to superadmins

    try {

         // Query to select all proposals with status 'pending'
      const result = await pool.query(
        "SELECT * FROM proposals WHERE status = $1 ORDER BY id DESC",
        ['pending']
    );
      // Query to select all proposals with status 'Pending Activation'
      const selectResult = await pool.query(
          "SELECT * FROM proposals WHERE status = $1",
          ['Waiting for Admin Approval']
      );

      // Query to select all proposals with status 'Discarded'
      const discardProposal = await pool.query(
          "SELECT * FROM proposals WHERE status = $1",
          ['Discarded']
      );

      // Query to select proposals with status 'Waiting for Admin Approval' or 'Active'
      const waitingOrActiveProposals = await pool.query(
          "SELECT * FROM proposals WHERE status = $1",
          ['Active']
      );

      // Ensure all arrays are defined, even if empty
      const waitingForAdminApproveProposals = selectResult.rows || [];
      const discardProposals = discardProposal.rows || [];
      const activeProposals = waitingOrActiveProposals.rows || [];

      // Render the 'createProposal' view, passing all the proposal categories
      res.render("Proposals", { 
        proposals: result.rows, 
        waitingForAdminApproveProposals, 
        discardProposals, 
        activeProposals
      });
      
  } catch (error) {
      console.error("Error retrieving proposal data:", error);
      res.status(500).json({ success: false, error: "Database error" });
  }
});

router.post('/AdminAproval', async (req, res) => {
  const { proposalId } = req.body;

  try {
      const updateResult = await pool.query(
          'UPDATE proposals SET status = $1 WHERE id = $2 RETURNING *',
          ['Active', proposalId] // New status is set here
      );

      if (updateResult.rows.length === 0) {
          return res.status(404).json({ message: 'Proposal not found' });
      }

      // Return the updated proposal as JSON
      res.json({ message: 'Proposal Aproved successfully', updatedProposal: updateResult.rows[0] });
  } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Error updating proposal' });
  }
});

module.exports = router;