const express = require('express');
const router = express.Router();
const supervisordetails = require('../controllers/sspage_ctrl'); // Import controller

router.get('/supervisordetails/:id', supervisordetails.getSupervisorById); // Fixed function name

// Fetch Supervisor's assigned sites
router.get("/getSupervisorSites/:siteSupervisorId", supervisordetails.getSupervisorSites);
// Fetch Client Details by ID
router.get("/clientdetails/:id", supervisordetails.getClientDetails);


module.exports = router;