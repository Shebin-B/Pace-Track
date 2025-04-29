const Client_register = require("../models/client_regmodel");
const bcrypt = require("bcryptjs");

// Create Client with Image & ID Proof Upload
const Createclient = async (req, res) => {
    try {
        const { name, phone, address, email, password } = req.body;
        const client = await Client_register.findOne({ email: email });

        if (client) {
            return res.status(409).json({ error: "Email already exists" });
        }

        let hashedPassword = await bcrypt.hash(password, 10);

        // Extract files from Multer
        const profileImage = req.files["image"] ? req.files["image"][0] : null;
        const idProofFile = req.files["idProof"] ? req.files["idProof"][0] : null;

        await Client_register.create({
            name: name,
            phone: phone,
            address: address,
            email: email,
            password: hashedPassword,
            status: "Pending",
            image: profileImage ? { data: profileImage.buffer, contentType: profileImage.mimetype } : null,
            idProof: idProofFile ? { data: idProofFile.buffer, contentType: idProofFile.mimetype } : null
        });

        res.json({ success: true, message: "Client registered successfully" });

    } catch (error) {
        console.log(error);
        return res.status(500).json({ success: false, msg: "An error occurred" });
    }
};

const Getclient = async (req, res) => {
    try {
        const clients = await Client_register.find({}, { password: 0 });

        // Convert Binary Data to Base64 Format
        const updatedClients = clients.map(client => ({
            ...client._doc,
            image: client.image?.data 
                ? `data:${client.image.contentType};base64,${client.image.data.toString("base64")}` 
                : null,
            idProof: client.idProof?.data 
                ? `data:${client.idProof.contentType};base64,${client.idProof.data.toString("base64")}` 
                : null
        }));

        res.json(updatedClients);
    } catch (error) {
        console.log(error);
        return res.status(500).json({ success: false, msg: "An error occurred while fetching clients" });
    }
};





const Deleteclient = async (req, res) => {
    try {
        const { id } = req.params;
        const client = await Client_register.findByIdAndDelete(id);
        if (!client) {
            return res.status(404).json({ success: false, msg: "Client not found" });
        }
        res.json({ success: true, message: "Client deleted successfully" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, msg: "Error deleting client" });
    }
};



const { sendApprovalEmail, sendRejectionEmail } = require("../controllers/mailer");


const updateClientStatus = async (req, res) => {
    try {
      const { id } = req.params;
      const { status } = req.body;
  
      const client = await Client_register.findByIdAndUpdate(
        id,
        { status: status },
        { new: true }
      );
  
      if (!client) {
        return res.status(404).json({ success: false, msg: "Client not found" });
      }
  
      // 👉 After updating, send email based on status
      if (status === "Approved") {
        await sendApprovalEmail(client.email, client.name);
      } else if (status === "Rejected") {
        await sendRejectionEmail(client.email, client.name);
      }
  
      res.status(200).json({ success: true, data: client, msg: "Client status updated successfully." });
    } catch (error) {
      console.error("Error updating client status:", error);
      res.status(500).json({ success: false, msg: "Internal server error" });
    }
  };


module.exports = {
    Createclient,
    Getclient,
    Deleteclient,
    updateClientStatus
};
