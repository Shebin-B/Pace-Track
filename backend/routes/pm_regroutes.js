const express=require('express');
const router = express.Router();
const multer = require("multer");
const pm_regcontroller=require("../controllers/pm_regcontrol")
const upload = multer({ storage: multer.memoryStorage() });

router.post(
    "/Createmanager",
    upload.fields([{ name: "image", maxCount: 1 }, { name: "idProof", maxCount: 1 }]),
    pm_regcontroller.Createmanager
);

router.get('/Getmanager',pm_regcontroller.Getmanager);
router.delete('/Deletemanager/:id', pm_regcontroller.Deletemanager);
router.put("/updateStatus/:id", pm_regcontroller.updateManagerStatus);
router.get("/sitesofmanager/:managerId", pm_regcontroller.GetSitesByManager);

module.exports = router;