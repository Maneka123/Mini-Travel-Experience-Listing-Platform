import jwt from "jsonwebtoken"; // if using ESM, else use require

const authMiddleware = (req, res, next) => {
  // 1️⃣ Get token from Authorization header
  const authHeader = req.headers.authorization;
  const token = authHeader?.startsWith("Bearer ") ? authHeader.split(" ")[1] : null;

  // 2️⃣ If no token, deny access
  if (!token) {
    return res.status(401).json({ error: "Unauthorized. Please login first." });
  }

  try {
    // 3️⃣ Verify JWT
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // 4️⃣ Attach user info to request
    req.user = { id: decoded.id, email: decoded.email };
    next();
  } catch (err) {
    console.error("AUTH ERROR:", err);
    return res.status(401).json({ error: "Invalid token" });
  }
};

export default authMiddleware;