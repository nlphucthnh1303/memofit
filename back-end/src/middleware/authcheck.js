const jwt = require("jsonwebtoken");

/**
 * Middleware xác thực Token (JWT)
 * Kiểm tra token trong Header Authorization (Bearer Token)
 */
const authcheck = (req, res, next) => {
  // Lấy token từ header Authorization
  const authHeader = req.header("Authorization");
  const token = authHeader && authHeader.split(" ")[1]; // Bearer <token>

  if (!token) {
    return res.status(401).json({ 
      message: "Truy cập bị từ chối. Không tìm thấy token xác thực." 
    });
  }

  try {
    // Xác thực token
    const verified = jwt.verify(
      token, 
      process.env.JWT_SECRET || "your_secret_key"
    );

    // Lưu thông tin user giải mã được từ token vào request object
    req.user = verified;
    
    // Cho phép request đi tiếp
    next();
  } catch (err) {
    res.status(401).json({ 
      message: "Token không hợp lệ hoặc đã hết hạn." 
    });
  }
};

module.exports = authcheck;
