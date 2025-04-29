const express = require("express");
const router = express.Router();
const site_regcontroller = require("../controllers/site_regcontrol");



// Define API routes
router.post("/Createsite", site_regcontroller.Createsite);  // Use a cleaner route ("/" instead of "/createsite")
router.get("/getsite", site_regcontroller.getSites);
router.delete("/deletesite/:id", site_regcontroller.deleteSite);
router.put("/assign-manager", site_regcontroller.assignProjectManager);
router.post("/assign-supervisor", site_regcontroller.assignSupervisor);
router.get("/getmanager", site_regcontroller.Getmanager);
router.get("/getsupervisor", site_regcontroller.Getsupervisor);
router.get("/viewclientsite/:clientId", site_regcontroller.getClientSites);
router.get("/getManagerSites/:projectManagerId",site_regcontroller.getManagerSites);
router.put("/removeManager/:siteId", site_regcontroller.removeManager);
router.post("/assign-employee", site_regcontroller.assignEmployeeToSite);
router.get('/assigned-sites/:employeeId', site_regcontroller.getAssignedSites);
router.put('/remove-employee', site_regcontroller.removeEmployeeFromSite);
router.get("/employees/:siteId", site_regcontroller.getEmployeesForSite);



router.get("/sites/:siteId", site_regcontroller.getSiteById);





  

module.exports = router;
