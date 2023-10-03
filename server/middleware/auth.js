import jwt from "jsonwebtoken";

export const verifyToken = async (req, res, next) => {
    // from the request from the frontend we're grabbing the authorisation header
    // and that's were the token will be set, so we can grab it from the backend
  try {
    let token = req.header("Authorization");

    if (!token) {
      return res.status(403).send("Access Denied");
    }

    if (token.startsWith("Bearer ")) {
      token = token.slice(7, token.length).trimLeft();
    }

    const verified = jwt.verify(token, process.env.JWT_SECRET);
    req.user = verified;
    next();
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};