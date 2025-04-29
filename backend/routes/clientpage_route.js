const express = require('express');
const router = express.Router();
const clientdetails = require('../controllers/clientpage_ctrl'); // Import controller

// Define route for fetching client by ID
router.get('/clientdetails/:id',clientdetails.getClientById);

router.get("/clientsites/:clientId", clientdetails.getClientSites);


module.exports = router;
