import jwt from "jsonwebtoken";

export const verifyToken = async (req, res, next) => {
  try {
    let token = req.header("Authorization");

    if (!token || !token.startsWith("Bearer ")) {
      return res.status(403).json({ message: "Access denied."});
    }

    if (token.startsWith("Bearer ")) {
      token = token.slice(7).trim();
    }

    const verified = jwt.verify(token, process.env.JWT_SECRET);
    req.user = verified;
    next()
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
}