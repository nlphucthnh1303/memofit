const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient({});

exports.getCollections = async (req, res) => {
  try {
    const collections = await prisma.collections.findMany({
      where: { is_delete: "0" },
    });
    res.status(200).json({
      message: "Lấy danh sách bộ sưu tập thành công",
      data: collections,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getCollection = async (req, res) => {
  try {
    const { id } = req.params;
    const collection = await prisma.collections.findUnique({
      where: { id: parseInt(id), is_delete: "0" },
    });
    if (!collection) {
      return res.status(404).json({ error: "Không tìm thấy bộ sưu tập" });
    }
    res.status(200).json({
      message: "Lấy thông tin bộ sưu tập thành công",
      data: collection,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.createCollection = async (req, res) => {
  try {
    const { user_id, title, description, cover_image } = req.body;
    const collection = await prisma.collections.create({
      data: {
        user_id,
        title,
        description,
        cover_image,
      },
    });
    res.status(201).json({
      message: "Tạo bộ sưu tập thành công",
      data: collection,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.updateCollection = async (req, res) => {
  try {
    const { id } = req.params;
    const data = req.body;
    const collection = await prisma.collections.update({
      where: { id: parseInt(req.params.id), is_delete: "0" },
      data,
    });
    res.status(200).json({
      message: "Cập nhật bộ sưu tập thành công",
      data: collection,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.deleteCollection = async (req, res) => {
  try {
    const { id } = req.params;
    const collection = await prisma.collections.update({
      where: { id: parseInt(req.params.id), is_delete: "0" },
      data: { is_delete: "1" },
    });
    res.status(200).json({
      message: "Xóa bộ sưu tập thành công",
      data: collection,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
