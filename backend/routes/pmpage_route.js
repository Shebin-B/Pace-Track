const express = require('express');
const router = express.Router();
const managerdetails = require('../controllers/pmpage_ctrl'); // Import controller

// Define route for fetching client by ID
router.get('/managerdetails/:id',managerdetails.getManagerById);

// Ensure you are using the correct controller
router.get("/clientdetails/:id", managerdetails.getClientDetails);

router.get("/pmsites/:managerId", managerdetails.getManagerAssignedSites);


module.exports = router;