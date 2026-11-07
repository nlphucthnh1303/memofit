exports.handleUpload = (req, res) => {
  if (!req.file) {
    return res
      .status(400)
      .json({ success: false, message: "Không tìm thấy file ảnh!" });
  }
  const fileUrl = `${req.protocol}://${req.get("host")}/uploads/${req.file.filename}`;

  res.status(200).json({
    success: true,
    message: "Upload thành công",
    url: fileUrl,
  });
};
