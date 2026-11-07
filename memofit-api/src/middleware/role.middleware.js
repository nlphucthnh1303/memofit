module.exports = (allowedRoles = []) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        status: "error",
        error_code: "UNAUTHORIZED",
        message: "Yêu cầu đăng nhập để truy cập tài nguyên này"
      });
    }

    const userRole = req.user.role || "USER";

    if (allowedRoles.length > 0 && !allowedRoles.includes(userRole)) {
      return res.status(403).json({
        status: "error",
        error_code: "FORBIDDEN",
        message: "Bạn không có quyền thực hiện thao tác này"
      });
    }

    next();
  };
};
