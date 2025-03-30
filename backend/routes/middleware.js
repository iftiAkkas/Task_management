const jwt = require("jsonwebtoken");

const authenticateUser = (req, res, next) => {
  const token = req.header("Authorization");
  if (!token) return res.status(401).json({ message: "Access denied. No token provided." });

  try {
    // Remove "Bearer " from the token if present
    const actualToken = token.startsWith("Bearer ") ? token.slice(7, token.length) : token;

    const decoded = jwt.verify(actualToken, process.env.JWT_SECRET);
    req.user = decoded; // Attach the user info to the request
    next();
  } catch (err) {
    console.error("Token verification error:", err); // Debugging: Log the error
    res.status(400).json({ message: "Invalid token." });
  }
};

module.exports = authenticateUser;