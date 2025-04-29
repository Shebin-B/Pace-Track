const jwt = require("jsonwebtoken");

const JWT_SECRET = process.env.JWT_SECRET || "your_secret_key"; // Use env variable in production

const authMiddleware = (req, res, next) => {
  const token = req.header("Authorization");

  if (!token) {
    return res.status(401).json({ message: "Access denied. No token provided." });
  }

  try {
    const decoded = jwt.verify(token.replace("Bearer ", ""), JWT_SECRET);
    req.user = decoded; // Store user details in request object
    next();
  } catch (error) {
    return res.status(403).json({ message: "Invalid or expired token." });
  }
};

module.exports = authMiddleware;
