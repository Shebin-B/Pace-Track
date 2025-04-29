const express=require('express');
const router = express.Router();
const multer = require("multer");
const client_regcontroller=require("../controllers/client_regcontrol")

const upload = multer({ storage: multer.memoryStorage() });

// Client Registration (With Image & ID Proof Uploads)
router.post(
    "/Createclient",
    upload.fields([{ name: "image", maxCount: 1 }, { name: "idProof", maxCount: 1 }]),
    client_regcontroller.Createclient
);
router.get('/Getclient',client_regcontroller.Getclient);
router.delete('/Deleteclient/:id', client_regcontroller.Deleteclient);
router.put("/updateStatus/:id", client_regcontroller.updateClientStatus);



module.exports = router;