const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");
const bcrypt = require("bcrypt");
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const moment = require("moment-timezone");

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

    const existingUser = await prisma.users.findUnique({
      where: { email },
    });

    if (existingUser) {
      return res.status(400).json({ message: "Người dùng đã tồn tại" });
    }

    password_hash = await bcrypt.hash(password, 10);

    const user = await prisma.users.create({
      data: {
        username,
        email,
        password_hash,
        current_streak: 0,
        longest_streak: 0,
        last_active_date: new Date(),
        is_delete: "0",
        isOtpVerify: false,
      },
    });

    res.status(201).json({ message: "Tạo người dùng thành công", data: user });
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
      return res.status(404).json({ message: "Không tìm thấy người dùng" });
    }

    const isMatch = await bcrypt.compare(password, user.password_hash);

    if (!isMatch) {
      return res
        .status(401)
        .json({ message: "Thông tin đăng nhập không hợp lệ" });
    }

    const token = jwt.sign(
      { userId: user.id, username: user.username },
      process.env.JWT_SECRET || "your_secret_key",
      { expiresIn: "7d" },
    );
    res.status(200).json({
      message: "Đăng nhập thành công",
      token: token,
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        isOtpVerify: user.isOtpVerify,
      },
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.checkAuth = async (req, res) => {
  try {
    const token = req.headers["authorization"];
    if (!token) return res.status(401).json({ message: "Bạn chưa đăng nhập!" });
    jwt.verify(token, "SECRET_KEY_CUA_SERVER", (err, decodedUser) => {
      if (err)
        return res.status(403).json({ message: "Token giả mạo hoặc hết hạn!" });
      res.status(200).json({
        message: "Đăng nhập thành công",
        data: decodedUser,
      });
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

    let new_otp = generateOTP(4);
    const password_resets = await prisma.password_resets.create({
      data: {
        email,
        otp: new_otp,
        type: "REGISTER",
        expires_at: moment().tz("Asia/Ho_Chi_Minh").add(3, "minutes").toDate(),
      },
    });
    // GỬI MAIL
    await transporter.sendMail({
      from: '"Memofit Support" <no-reply@memofit.com>',
      to: email,
      subject: "Mã xác thực tài khoản Memofit",
      html: `
      <!DOCTYPE html>
      <html lang="vi">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Xác thực mã OTP - Memofit</title>
        <!-- Nhúng font chữ tối ưu cho thiết bị hỗ trợ -->
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=JetBrains+Mono:wght@500;700&display=swap" rel="stylesheet">
        <style>
          body {
            margin: 0;
            padding: 0;
            width: 100% !important;
            background-color: #213145; /* Phối màu inverse-surface làm nền bao ngoài như mẫu */
            -webkit-text-size-adjust: 100%;
            -ms-text-size-adjust: 100%;
            font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
          }
          img {
            line-height: 100%;
            outline: none;
            text-decoration: none;
            border: 0;
          }
          table {
            border-collapse: collapse !important;
          }
          .main-card {
            box-shadow: 0 10px 25px rgba(0, 0, 0, 0.15);
          }
        </style>
      </head>
      <body style="background-color: #213145; padding: 40px 16px;">

        <!-- Văn bản xem trước ẩn (Preheader) cải thiện tỷ lệ click -->
        <div style="display: none; max-height: 0px; overflow: hidden;">
          Sử dụng mã OTP này để xác thực tài khoản Memofit của bạn. Có hiệu lực trong 3 phút.
        </div>

        <table border="0" cellpadding="0" cellspacing="0" width="100%" style="table-layout: fixed;">
          <tr>
            <td align="center">
              
              <!-- Khung nội dung chính mô phỏng theo cấu trúc chuẩn của image_ffd31e.png -->
              <table class="main-card" border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 520px; background-color: #ffffff; border-radius: 12px; overflow: hidden; border: 1px solid #c3c6d7;">
                
                <!-- Header Banner (Dải tiêu đề pastel phía trên như mẫu) -->
                <tr>
                  <td align="center" style="background-color: #d3e4fe; padding: 24px 32px; border-bottom: 1px solid #c3c6d7;">
                    <h1 style="color: #0b1c30; font-family: 'Inter', sans-serif; font-size: 22px; font-weight: 700; margin: 0; letter-spacing: -0.01em;">
                      Xác thực mã OTP của bạn
                    </h1>
                  </td>
                </tr>

                <!-- Nội dung chi tiết thư -->
                <tr>
                  <td style="padding: 36px 32px; background-color: #ffffff;">
                    
                    <!-- Lời chào & Nội dung dẫn nhập -->
                    <h3 style="color: #0b1c30; font-size: 16px; font-weight: 700; margin-top: 0; margin-bottom: 12px;">
                      Chào bạn,
                    </h3>
                    <p style="color: #434655; font-size: 15px; line-height: 1.6; margin-top: 0; margin-bottom: 24px;">
                      Bạn vừa thực hiện yêu cầu xác thực tài khoản tại <strong>Memofit</strong>.<br>
                      Để đảm bảo an toàn & bảo mật thông tin, vui lòng sử dụng mã OTP dưới đây để xác nhận phiên đăng nhập của bạn:
                    </p>

                    <!-- Khu vực hiển thị mã OTP nổi bật, trực quan -->
                    <table border="0" cellpadding="0" cellspacing="0" width="100%" style="margin-bottom: 24px;">
                      <tr>
                        <td align="center" style="background-color: #eff4ff; border: 1px solid #c3c6d7; border-radius: 8px; padding: 20px;">
                          <span style="font-family: 'JetBrains Mono', 'Courier New', monospace; font-size: 38px; font-weight: 700; color: #004ac6; letter-spacing: 12px; display: inline-block; padding-left: 12px;">
                            ${new_otp}
                          </span>
                        </td>
                      </tr>
                    </table>

                    <!-- Cảnh báo thời gian hiệu lực -->
                    <p style="color: #434655; font-size: 14.5px; line-height: 1.5; margin-top: 0; margin-bottom: 24px;">
                      Vui lòng nhập mã OTP này trong vòng <strong style="color: #ba1a1a;">5 phút</strong> kể từ khi nhận được email để hoàn tất tiến trình xác nhận.
                    </p>

                    <!-- Lưu ý bảo mật dạng tinh gọn của hệ thống -->
                    <p style="color: #737686; font-size: 13px; line-height: 1.5; font-style: italic; margin-top: 0; margin-bottom: 28px;">
                      Nếu bạn không thực hiện yêu cầu này, vui lòng bỏ qua thư này hoặc liên hệ ngay với hỗ trợ: 
                      <a href="mailto:support@memofit.vn" style="color: #004ac6; text-decoration: none; font-weight: 500;">support@memofit.vn</a>.
                    </p>

                    <!-- Chữ ký người gửi -->
                    <p style="color: #434655; font-size: 14.5px; line-height: 1.5; margin-top: 0; margin-bottom: 0;">
                      Trân trọng,<br>
                      <strong style="color: #0b1c30;">Đội ngũ Memofit</strong>
                    </p>

                    <!-- Đường phân cách mảnh -->
                    <hr style="border: 0; border-top: 1px solid #c3c6d7; margin: 28px 0 20px 0;">

                    <!-- Khu vực thương hiệu & Chân trang -->
                    <table border="0" cellpadding="0" cellspacing="0" width="100%">
                      <tr>
                        <td align="center" style="padding-bottom: 8px;">
                          <!-- Logo Memofit kết hợp phối màu chuẩn chỉ -->
                          <span style="font-family: 'Inter', sans-serif; font-size: 20px; font-weight: 800; color: #004ac6; letter-spacing: -0.5px;">
                            Memofit
                          </span>
                        </td>
                      </tr>
                      <tr>
                        <td align="center">
                          <p style="color: #737686; font-size: 11px; margin: 4px 0 0 0;">
                            © 2026 memofit.vn. Mọi quyền được bảo lưu.
                          </p>
                          <p style="color: #737686; font-size: 11px; margin: 4px 0 0 0;">
                            Đây là email tự động từ hệ thống bảo mật, vui lòng không trả lời thư này.
                          </p>
                        </td>
                      </tr>
                    </table>

                  </td>
                </tr>
              </table>
              
            </td>
          </tr>
        </table>

      </body>
      </html>
      `,
    });
    res.status(201).json({
      message: "Mã OTP đã được tạo thành công",
      data: password_resets,
    });
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
      return res.status(400).json({ message: "Email không tồn tại" });
    }

    let new_otp = generateOTP(4);
    const password_resets = await prisma.password_resets.create({
      data: {
        email: email,
        otp: new_otp,
        type: "FORGOT_PASSWORD",
        expires_at: moment().tz("Asia/Ho_Chi_Minh").add(3, "minutes").toDate(),
      },
    });
    // GỬI MAIL
    await transporter.sendMail({
      from: '"Memofit Support" <no-reply@memofit.com>',
      to: email,
      subject: "Mã xác thực tài khoản Memofit",
      html: `
      <!DOCTYPE html>
      <html lang="vi">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Xác thực mã OTP - Memofit</title>
        <!-- Nhúng font chữ tối ưu cho thiết bị hỗ trợ -->
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=JetBrains+Mono:wght@500;700&display=swap" rel="stylesheet">
        <style>
          body {
            margin: 0;
            padding: 0;
            width: 100% !important;
            background-color: #213145; /* Phối màu inverse-surface làm nền bao ngoài như mẫu */
            -webkit-text-size-adjust: 100%;
            -ms-text-size-adjust: 100%;
            font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
          }
          img {
            line-height: 100%;
            outline: none;
            text-decoration: none;
            border: 0;
          }
          table {
            border-collapse: collapse !important;
          }
          .main-card {
            box-shadow: 0 10px 25px rgba(0, 0, 0, 0.15);
          }
        </style>
      </head>
      <body style="background-color: #213145; padding: 40px 16px;">

        <!-- Văn bản xem trước ẩn (Preheader) cải thiện tỷ lệ click -->
        <div style="display: none; max-height: 0px; overflow: hidden;">
          Sử dụng mã OTP này để xác thực tài khoản Memofit của bạn. Có hiệu lực trong 3 phút.
        </div>

        <table border="0" cellpadding="0" cellspacing="0" width="100%" style="table-layout: fixed;">
          <tr>
            <td align="center">
              
              <!-- Khung nội dung chính mô phỏng theo cấu trúc chuẩn của image_ffd31e.png -->
              <table class="main-card" border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 520px; background-color: #ffffff; border-radius: 12px; overflow: hidden; border: 1px solid #c3c6d7;">
                
                <!-- Header Banner (Dải tiêu đề pastel phía trên như mẫu) -->
                <tr>
                  <td align="center" style="background-color: #d3e4fe; padding: 24px 32px; border-bottom: 1px solid #c3c6d7;">
                    <h1 style="color: #0b1c30; font-family: 'Inter', sans-serif; font-size: 22px; font-weight: 700; margin: 0; letter-spacing: -0.01em;">
                      Xác thực mã OTP của bạn
                    </h1>
                  </td>
                </tr>

                <!-- Nội dung chi tiết thư -->
                <tr>
                  <td style="padding: 36px 32px; background-color: #ffffff;">
                    
                    <!-- Lời chào & Nội dung dẫn nhập -->
                    <h3 style="color: #0b1c30; font-size: 16px; font-weight: 700; margin-top: 0; margin-bottom: 12px;">
                      Chào bạn,
                    </h3>
                    <p style="color: #434655; font-size: 15px; line-height: 1.6; margin-top: 0; margin-bottom: 24px;">
                      Bạn vừa thực hiện yêu cầu xác thực tài khoản tại <strong>Memofit</strong>.<br>
                      Để đảm bảo an toàn & bảo mật thông tin, vui lòng sử dụng mã OTP dưới đây để xác nhận phiên đăng nhập của bạn:
                    </p>

                    <!-- Khu vực hiển thị mã OTP nổi bật, trực quan -->
                    <table border="0" cellpadding="0" cellspacing="0" width="100%" style="margin-bottom: 24px;">
                      <tr>
                        <td align="center" style="background-color: #eff4ff; border: 1px solid #c3c6d7; border-radius: 8px; padding: 20px;">
                          <span style="font-family: 'JetBrains Mono', 'Courier New', monospace; font-size: 38px; font-weight: 700; color: #004ac6; letter-spacing: 12px; display: inline-block; padding-left: 12px;">
                            ${new_otp}
                          </span>
                        </td>
                      </tr>
                    </table>

                    <!-- Cảnh báo thời gian hiệu lực -->
                    <p style="color: #434655; font-size: 14.5px; line-height: 1.5; margin-top: 0; margin-bottom: 24px;">
                      Vui lòng nhập mã OTP này trong vòng <strong style="color: #ba1a1a;">5 phút</strong> kể từ khi nhận được email để hoàn tất tiến trình xác nhận.
                    </p>

                    <!-- Lưu ý bảo mật dạng tinh gọn của hệ thống -->
                    <p style="color: #737686; font-size: 13px; line-height: 1.5; font-style: italic; margin-top: 0; margin-bottom: 28px;">
                      Nếu bạn không thực hiện yêu cầu này, vui lòng bỏ qua thư này hoặc liên hệ ngay với hỗ trợ: 
                      <a href="mailto:support@memofit.vn" style="color: #004ac6; text-decoration: none; font-weight: 500;">support@memofit.vn</a>.
                    </p>

                    <!-- Chữ ký người gửi -->
                    <p style="color: #434655; font-size: 14.5px; line-height: 1.5; margin-top: 0; margin-bottom: 0;">
                      Trân trọng,<br>
                      <strong style="color: #0b1c30;">Đội ngũ Memofit</strong>
                    </p>

                    <!-- Đường phân cách mảnh -->
                    <hr style="border: 0; border-top: 1px solid #c3c6d7; margin: 28px 0 20px 0;">

                    <!-- Khu vực thương hiệu & Chân trang -->
                    <table border="0" cellpadding="0" cellspacing="0" width="100%">
                      <tr>
                        <td align="center" style="padding-bottom: 8px;">
                          <!-- Logo Memofit kết hợp phối màu chuẩn chỉ -->
                          <span style="font-family: 'Inter', sans-serif; font-size: 20px; font-weight: 800; color: #004ac6; letter-spacing: -0.5px;">
                            Memofit
                          </span>
                        </td>
                      </tr>
                      <tr>
                        <td align="center">
                          <p style="color: #737686; font-size: 11px; margin: 4px 0 0 0;">
                            © 2026 memofit.vn. Mọi quyền được bảo lưu.
                          </p>
                          <p style="color: #737686; font-size: 11px; margin: 4px 0 0 0;">
                            Đây là email tự động từ hệ thống bảo mật, vui lòng không trả lời thư này.
                          </p>
                        </td>
                      </tr>
                    </table>

                  </td>
                </tr>
              </table>
              
            </td>
          </tr>
        </table>

      </body>
      </html>
      `,
    });
    res.status(201).json({
      message: "Mã OTP đã được tạo thành công",
      data: password_resets,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.verifyOtp = async (req, res) => {
  try {
    const { email, otp, type } = req.body;

    const password_resets = await prisma.password_resets.findFirst({
      where: {
        email: email,
        otp: otp,
        type: type,
      },
      orderBy: { created_at: "desc" },
    });
    if (!password_resets) {
      return res.status(400).json({ message: "Mã OTP không chính xác!" });
    }
    if (password_resets.expires_at < new Date()) {
      return res.status(400).json({ message: "Mã OTP đã hết hạn!" });
    }

    await prisma.password_resets.deleteMany({
      where: { email },
    });
    res.status(200).json({ message: "Xác thực OTP thành công" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.resetPassword = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await prisma.users.findUnique({ where: { email } });
    if (!user) {
      return res.status(404).json({ message: "Người dùng không tồn tại" });
    }
    const password_hash = await bcrypt.hash(password, 10);

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
