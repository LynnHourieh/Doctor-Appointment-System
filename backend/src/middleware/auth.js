import jwt from "jsonwebtoken";

export const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) return res.status(401).json({ message: "Token not provided" });

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) return res.status(403).json({ message: "Invalid token" });

    req.user = user; // Add user data (userId, roleId) to the request
    next();
  });
};

export const isAdmin = (req, res, next) => {
  if (req.user?.roleId !== 1) {
    return res.status(403).json({ message: "Admins only" });
  }
  next();
};