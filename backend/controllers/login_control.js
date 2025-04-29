// controllers/authController.js
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const Client = require('../models/client_regmodel');
const ProjectManager = require('../models/pm_regmodel');
const SiteSupervisor = require('../models/sitesupervisor_model');

// JWT Secret Key (Replace with an environment variable in production)
const JWT_SECRET = 'your_jwt_secret';

// Generic Login Handler
const loginUser = async (req, res) => {
    const { email, password } = req.body;
    try {
        let user = null;
        let role = '';
        
        if (email === 'admin@gmail.com' && password === 'admin123') {
            const token = jwt.sign({ role: 'admin' }, JWT_SECRET, { expiresIn: '1h' });
            return res.json({ message: 'Admin login successful', token, role: 'admin' });
        }
        
        user = await Client.findOne({ email });
        if (user) role = 'client';
        
        if (!user) {
            user = await ProjectManager.findOne({ email });
            if (user) role = 'project_manager';
        }
        
        if (!user) {
            user = await SiteSupervisor.findOne({ email });
            if (user) role = 'site_supervisor';
        }
        
        if (!user) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }
        
        if (user.status !== 'Approved') {
            return res.status(403).json({ message: 'User not approved for login' });
        }
        
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }
        
        const token = jwt.sign({ id: user._id, role }, JWT_SECRET, { expiresIn: '1h' });
        res.json({ message: `${role} login successful`, token, userId: user._id, role });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
};

// Login Route
exports.login = loginUser;