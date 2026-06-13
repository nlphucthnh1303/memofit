const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");
const bcrypt = require("bcrypt");
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

const generateOTP = function (length) {
  let digits = "0123456789";
  let otp = "";
  for (let i = 0; i < length; i++) {
    otp += digits[Math.floor(Math.random() * 10)];
  }
  return otp;
};

exports.register = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    // Check if user already exists
    const existingUser = await prisma.users.findUnique({
      where: { email },
    });

    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    password_hash = await bcrypt.hash(password, 10);

    // Create new user
    const user = await prisma.users.create({
      data: {
        username,
        email,
        password_hash,
        current_streak: 0,
        longest_streak: 0,
        last_active_date: new Date(),
      },
    });

    res.status(201).json({ message: "User created successfully", data: user });
  } catch (error) {
    console.error("Error registering user:", error);
    res.status(500).json({ error: error.message });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await prisma.users.findUnique({
      where: { email },
    });
    const password_hash = await bcrypt.hash(password, 10);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const isMatch = await bcrypt.compare(password, user.password_hash);

    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign(
      { userId: user.id, username: user.username },
      process.env.JWT_SECRET || "your_secret_key",
      { expiresIn: "7d" },
    );
    res.status(200).json({
      message: "Login successful",
      token: token,
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
      },
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Gửi khi khởi tạo tài khoản
exports.sendRegisterAuthOTP = async (req, res) => {
  try {
    const { email } = req.body;
    const existingUser = await prisma.users.findFirst({
      where: { OR: [{ email }] },
    });
    if (existingUser) {
      return res.status(400).json({ message: "Email already exists" });
    }

    let new_otp = generateOTP(4);
    const password_resets = await prisma.password_resets.create({
      data: {
        email,
        otp: new_otp,
        expires_at: new Date(Date.now() + 180000),
      },
    });
    // GỬI MAIL
    await transporter.sendMail({
      from: '"Memofit Support" <no-reply@memofit.com>',
      to: email,
      subject: "Mã xác thực tài khoản Memofit",
      html: `
      <div style="background-color: #f9f9f9; padding: 40px 20px; font-family: 'Segoe UI', Arial, sans-serif;">
        <table align="center" width="100%" max-width="500px" style="background-color: #ffffff; border: 1px solid #e0e0e0; border-radius: 8px; padding: 40px; text-align: center; border-spacing: 0;">
            <tr>
            <td>
                <h2 style="color: #333; margin-bottom: 20px;">Xác thực tài khoản của bạn</h2>
                
                <p style="color: #555; line-height: 1.6; margin-bottom: 30px;">
                Chào bạn, đây là mã xác thực (OTP) của bạn để hoàn tất quy trình bảo mật tại <strong>Memofit</strong>. Mã này sẽ hết hạn trong 5 phút.
                </p>

                <div style="background-color: #f4f7fe; border: 1px solid #d1d9e6; border-radius: 8px; padding: 25px; margin-bottom: 25px;">
                <span style="font-size: 40px; font-weight: bold; color: #1a73e8; letter-spacing: 10px;">
                    ${new_otp}
                </span>
                </div>

                <div style="display: inline-block; background-color: #fce8e6; color: #d93025; padding: 8px 16px; border-radius: 20px; font-size: 14px; margin-bottom: 30px;">
                Hết hạn sau 03:00
                </div>

                <hr style="border: 0; border-top: 1px solid #eee; margin: 20px 0;">
                <p style="color: #888; font-size: 13px; text-align: left;">
                🛡 Nếu bạn không thực hiện yêu cầu này, vui lòng bỏ qua email này hoặc liên hệ với bộ phận hỗ trợ nếu bạn lo ngại về bảo mật.
                </p>
            </td>
            </tr>
        </table>
        
        <p style="text-align: center; color: #aaa; font-size: 12px; margin-top: 20px;">
            © 2026 Memofit
        </p>
        </div>
      `,
    });
    res
      .status(201)
      .json({ message: "OTP created successfully", data: password_resets });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

//Gửi khi đổi mật khâu, quên mật khẩu
exports.sendForgotAuthOTP = async (req, res) => {
  try {
    const { email } = req.body;
    const existingUser = await prisma.users.findFirst({
      where: { OR: [{ email }] },
    });
    if (!existingUser) {
      return res.status(400).json({ message: "Email not found" });
    }

    let new_otp = generateOTP(4);
    const password_resets = await prisma.password_resets.create({
      data: {
        email: email,
        otp: new_otp,
        expires_at: new Date(Date.now() + 180000),
      },
    });
    // GỬI MAIL
    await transporter.sendMail({
      from: '"Memofit Support" <no-reply@memofit.com>',
      to: email,
      subject: "Mã xác thực tài khoản Memofit",
      html: `
      <div style="background-color: #f9f9f9; padding: 40px 20px; font-family: 'Segoe UI', Arial, sans-serif;">
        <table align="center" width="100%" max-width="500px" style="background-color: #ffffff; border: 1px solid #e0e0e0; border-radius: 8px; padding: 40px; text-align: center; border-spacing: 0;">
            <tr>
            <td>
                <h2 style="color: #333; margin-bottom: 20px;">Xác thực tài khoản của bạn</h2>
                
                <p style="color: #555; line-height: 1.6; margin-bottom: 30px;">
                Chào bạn, đây là mã xác thực (OTP) của bạn để hoàn tất quy trình bảo mật tại <strong>Memofit</strong>. Mã này sẽ hết hạn trong 5 phút.
                </p>

                <div style="background-color: #f4f7fe; border: 1px solid #d1d9e6; border-radius: 8px; padding: 25px; margin-bottom: 25px;">
                <span style="font-size: 40px; font-weight: bold; color: #1a73e8; letter-spacing: 10px;">
                    ${new_otp}
                </span>
                </div>

                <div style="display: inline-block; background-color: #fce8e6; color: #d93025; padding: 8px 16px; border-radius: 20px; font-size: 14px; margin-bottom: 30px;">
                Hết hạn sau 03:00
                </div>

                <hr style="border: 0; border-top: 1px solid #eee; margin: 20px 0;">
                <p style="color: #888; font-size: 13px; text-align: left;">
                🛡 Nếu bạn không thực hiện yêu cầu này, vui lòng bỏ qua email này hoặc liên hệ với bộ phận hỗ trợ nếu bạn lo ngại về bảo mật.
                </p>
            </td>
            </tr>
        </table>
        
        <p style="text-align: center; color: #aaa; font-size: 12px; margin-top: 20px;">
            © 2026 Memofit
        </p>
        </div>
      `,
    });
    res
      .status(201)
      .json({ message: "OTP created successfully", data: password_resets });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.verifyOtp = async (req, res) => {
  try {
    const { email, otp } = req.body;

    const password_resets = await prisma.password_resets.findUnique({
      where: { email },
    });
    if (password_resets.otp !== otp) {
      return res.status(400).json({ message: "Invalid OTP" });
    }
    if (password_resets.expires_at < Date.now()) {
      return res.status(400).json({ message: "Expired OTP" });
    }
    await prisma.password_resets.delete({
      where: { email },
    });
    res.status(200).json({ message: "OTP verified successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.resetPassword = async (req, res) => {
  try {
    const { email, password, otp } = req.body;

    const otpRecord = await prisma.password_resets.findFirst({
      where: {
        email: email,
        otp: otp,
        expires_at: { gt: new Date() },
      },
    });

    if (!otpRecord) {
      return res
        .status(400)
        .json({ message: "Mã OTP không hợp lệ hoặc đã hết hạn" });
    }

    const user = await prisma.users.findUnique({ where: { email } });
    if (!user)
      return res.status(404).json({ message: "Người dùng không tồn tại" });

    // 3. Hash mật khẩu mới
    const password_hash = await bcrypt.hash(password, 10);

    // 4. Cập nhật mật khẩu và XÓA OTP đã dùng
    await prisma.$transaction([
      prisma.users.update({
        where: { email },
        data: { password_hash },
      }),
      prisma.password_resets.deleteMany({
        where: { email },
      }),
    ]);

    res.status(200).json({ message: "Mật khẩu đã được đặt lại thành công" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
