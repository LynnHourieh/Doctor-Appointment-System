import jwt from "jsonwebtoken";

export const authenticateToken = (req, res, next) => {
  const token = req.cookies.token;


  if (!token) return res.status(401).json({ message: "Token not provided" });

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) return res.status(403).json({ message: "Invalid token" });

    req.user = user; // Add user data (userId, roleId) to the request
    next();
  });
};

export const isAdmin = (req, res, next) => {
  // ensure the auth middleware has set req.user (from your JWT)
  if (!req.user) return res.status(401).json({ message: 'Unauthorized' });

  // role is an enum string now: 'ADMIN' | 'DOCTOR' | 'PATIENT'
  if (req.user.role !== 'ADMIN') {
    return res.status(403).json({ message: 'Admins only' });
  }
  next();
};