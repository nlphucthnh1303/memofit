const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
  const token = req.header("Authorization")?.replace("Bearer ", "");

  if (!token) return res.status(401).json({ message: "Truy cập bị từ chối" });

  try {
    const verified = jwt.verify(
      token,
      process.env.JWT_SECRET || "your_secret_key",
    );
    req.user = verified; // Gán thông tin user vào request
    next();
  } catch (err) {
    res.status(400).json({ message: "Token không hợp lệ" });
  }
};
