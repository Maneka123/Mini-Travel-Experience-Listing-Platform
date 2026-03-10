const jwt = require("jsonwebtoken");

// ==========================
// AUTH MIDDLEWARE
// =========================
const authMiddleware = (req, res, next) => {
  // 1️⃣ Get token from cookie or Authorization header
  const token =
    req.cookies?.token || req.header("Authorization")?.replace("Bearer ", "");

  // 2️⃣ If no token, deny access
  if (!token) return res.status(401).json({ error: "Unauthorized" });

  try {
    // 3️⃣ Verify JWT
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // 4️⃣ Attach user info to request
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(401).json({ error: "Invalid token" });
  }
};

module.exports = authMiddleware;