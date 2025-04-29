const express=require('express');
const router = express.Router();
const multer = require("multer");
const ss_regcontroller=require("../controllers/ss_regcontrol")
const upload = multer({ storage: multer.memoryStorage() });

router.post(
    '/Createsupervisor',
    upload.fields([{ name: "image", maxCount: 1 }, { name: "idProof", maxCount: 1 }]),
    ss_regcontroller.Createsupervisor
);

router.get('/Getsupervisor',ss_regcontroller.Getsupervisor);
router.delete('/Deletesupervisor/:id', ss_regcontroller.Deletesupervisor);
router.put("/updatesupervisorStatus/:id", ss_regcontroller.updatesupervisorStatus);

router.get("/getSupervisorSites/:supervisorId", ss_regcontroller.getSupervisorSites);

router.put("/removeSupervisor/:siteId", ss_regcontroller.removeSupervisor);





module.exports = router;