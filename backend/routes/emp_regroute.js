const express=require('express');
const router = express.Router();
const multer = require("multer");
const emp_regcontroller=require("../controllers/emp_regcontrol")
const upload = multer({ storage: multer.memoryStorage() });

router.post(
    "/createemployee",
    upload.fields([
        { name: "image", maxCount: 1 },
        { name: "idProof", maxCount: 1 }
    ]),
    emp_regcontroller.createemployee
);

router.get('/Getemployee',emp_regcontroller.Getemployee);
router.delete('/Deleteemployee/:id',emp_regcontroller.Deleteemployee);
router.put("/Updateemployee/:id", emp_regcontroller.Updateemployee);
router.get("/Getemployeebyid/:id", emp_regcontroller.Getemployeebyid);


module.exports = router;
