const emp_register = require("../models/emp_regmodel");
const bcrypt = require("bcryptjs");

// Create Client with Image & ID Proof Upload
const createemployee = async (req, res) => {
    try {
        const { name, phone, address, email, work_category, salary } = req.body;
        const employee = await emp_register.findOne({ email: email });

        if (employee) {
            return res.status(409).json({ error: "Email already exists" });
        }

        

        // Extract files from Multer
        const profileImage = req.files["image"] ? req.files["image"][0] : null;
        const idProofFile = req.files["idProof"] ? req.files["idProof"][0] : null;

        await Client_register.create({
            name: name,
            phone: phone,
            address: address,
            email: email,
            work_category:work_category,
            salary:salary,
            image: profileImage ? { data: profileImage.buffer, contentType: profileImage.mimetype } : null,
            idProof: idProofFile ? { data: idProofFile.buffer, contentType: idProofFile.mimetype } : null
        });

        res.json({ success: true, message: "Employee registered successfully" });

    } catch (error) {
        console.log(error);
        return res.status(500).json({ success: false, msg: "An error occurred" });
    }
};

const Getemployee = async (req, res) => {
  try {
      const employees = await emp_register.find({}, { password: 0 });

      // Convert Binary Data to Base64 Format
      const updatedEmployees = employees.map(employee => ({
          ...employee._doc,
          image: employee.image?.data 
              ? `data:${employee.image.contentType};base64,${employee.image.data.toString("base64")}` 
              : null,
          idProof: employee.idProof?.data 
              ? `data:${employee.idProof.contentType};base64,${employee.idProof.data.toString("base64")}` 
              : null
      }));

      res.json(updatedEmployees);
  } catch (error) {
      console.log(error);
      return res.status(500).json({ success: false, msg: "An error occurred while fetching employees" });
  }
};





const Deleteemployee = async (req, res) => {
    try {
        const { id } = req.params;
        const employee = await emp_register.findByIdAndDelete(id);
        if (!employee) {
            return res.status(404).json({ success: false, msg: "employee not found" });
        }
        res.json({ success: true, message: "employee deleted successfully" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, msg: "Error deleting employee" });
    }
};



const Getemployeebyid = async (req, res) => {
  try {
    const { id } = req.params;                          // matches :id in route

    const employee = await emp_register.findById(id, { password: 0 });
    if (!employee) {
      return res.status(404).json({ success: false, message: "Employee not found" });
    }

    // Convert binary image / idProof to base64 URLs
    const employeeData = {
      ...employee._doc,
      image: employee.image?.data
        ? `data:${employee.image.contentType};base64,${employee.image.data.toString("base64")}`
        : null,
      idProof: employee.idProof?.data
        ? `data:${employee.idProof.contentType};base64,${employee.idProof.data.toString("base64")}`
        : null,
    };

    // === keep the response exactly how your React code expects ===
    return res.json({ success: true, employee: employeeData });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ success: false, message: "Error fetching employee details" });
  }
};

const Updateemployee = async (req, res) => {
  try {
      const { employeeId } = req.params;
      const updateData = req.body;  // The data to update the employee with

      // Find the employee by ID and update their details
      const updatedEmployee = await emp_register.findByIdAndUpdate(
          employeeId,
          updateData,
          { new: true, runValidators: true } // Ensure validation and return the updated employee
      );

      if (!updatedEmployee) {
          return res.status(404).json({ success: false, message: "Employee not found" });
      }

      // Convert Binary Data to Base64 Format if images or ID proofs are updated
      const updatedEmployeeData = {
          ...updatedEmployee._doc,
          image: updatedEmployee.image?.data
              ? `data:${updatedEmployee.image.contentType};base64,${updatedEmployee.image.data.toString("base64")}`
              : null,
          idProof: updatedEmployee.idProof?.data
              ? `data:${updatedEmployee.idProof.contentType};base64,${updatedEmployee.idProof.data.toString("base64")}`
              : null
      };

      res.json({ success: true, employee: updatedEmployeeData });
  } catch (error) {
      console.error(error);
      return res.status(500).json({ success: false, message: "Error updating employee details" });
  }
};

module.exports = {
    createemployee,
    Getemployee,
    Deleteemployee,
    Getemployeebyid, 
    Updateemployee
  
};
