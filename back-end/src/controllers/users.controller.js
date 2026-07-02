const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient({});

exports.getUsers = async (req, res) => {
  try {
    const users = await prisma.users.findMany({
      where: { is_delete: "0" },
    });
    res.status(200).json({
      message: "Lấy danh sách người dùng thành công",
      data: users,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getUser = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await prisma.users.findUnique({
      where: { id: parseInt(id), is_delete: "0" },
    });
    if (!user) {
      return res.status(404).json({ message: "Không tìm thấy người dùng" });
    }
    res.status(200).json({
      message: "Lấy thông tin người dùng thành công",
      data: user,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.createUser = async (req, res) => {
  try {
    const {
      username,
      email,
      password_hash,
      current_streak,
      longest_streak,
      last_active_date,
      is_delete,
      isOtpVerify,
    } = req.body;
    const user = await prisma.users.create({
      data: {
        username,
        email,
        password_hash,
        current_streak,
        longest_streak,
        last_active_date,
        is_delete,
        isOtpVerify,
      },
    });
    res.status(201).json({
      message: "Tạo người dùng thành công",
      data: user,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      username,
      email,
      password_hash,
      current_streak,
      longest_streak,
      last_active_date,
      is_delete,
      isOtpVerify,
    } = req.body;
    const user = await prisma.users.update({
      where: { id: parseInt(id), is_delete: "0" },
      data: {
        username,
        email,
        password_hash,
        current_streak,
        longest_streak,
        last_active_date,
        is_delete,
        isOtpVerify,
      },
    });
    res.status(200).json({
      message: "Cập nhật người dùng thành công",
      data: user,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.updateOtpVerifyById = async (req, res) => {
  try {
    const { id } = req.params;
    const { isOtpVerify } = req.body;
    const user = await prisma.users.update({
      where: { id: parseInt(id), is_delete: "0" },
      data: { isOtpVerify: isOtpVerify },
    });
    res.status(200).json({
      message: "Cập nhật trạng thái xác thực OTP thành công",
      data: user,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.updateOtpVerifyByEmail = async (req, res) => {
  try {
    const { email } = req.params;
    const { isOtpVerify } = req.body;
    const existingUser = await prisma.users.findUnique({
      where: { email: email },
    });
    if (!existingUser || existingUser.is_delete !== "0") {
      return res.status(404).json({
        message: "Không tìm thấy người dùng hợp lệ hoặc tài khoản đã bị xóa!",
      });
    }
    const updatedUser = await prisma.users.update({
      where: { email: email },
      data: { isOtpVerify: isOtpVerify },
    });

    res.status(200).json({
      message: "Cập nhật trạng thái xác thực OTP thành công",
      data: updatedUser,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.deleteUser = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await prisma.users.update({
      where: { id: parseInt(id), is_delete: "0" },
      data: { is_delete: "1" },
    });
    res.status(200).json({
      message: "Xóa người dùng thành công",
      data: user,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.resetUserData = async (req, res) => {
  try {
    const userId = req.user.userId;

    await prisma.user_vocabulary_progress.deleteMany({
      where: { user_id: userId },
    });

    await prisma.quiz_results.deleteMany({
      where: {
        quiz_sessions: {
          user_id: userId,
        },
      },
    });

    await prisma.quiz_sessions.deleteMany({
      where: { user_id: userId },
    });

    await prisma.collections.deleteMany({
      where: { user_id: userId },
    });

    await prisma.users.update({
      where: { id: userId },
      data: {
        current_streak: 0,
        longest_streak: 0,
      },
    });

    res.status(200).json({
      success: true,
      message: "Xóa toàn bộ dữ liệu học tập thành công. Tài khoản đã được thiết lập lại.",
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
