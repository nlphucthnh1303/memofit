const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient({});

exports.getCollections = async (req, res) => {
  try {
    const collections = await prisma.collections.findMany({
      where: { is_delete: "0" },
    });
    res.status(200).json({
      message: "Collections retrieved successfully",
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
      return res.status(404).json({ error: "Collection not found" });
    }
    res.status(200).json({
      message: "Collection retrieved successfully",
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
      message: "Collection created successfully",
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
      message: "Collection updated successfully",
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
      message: "Collection deleted successfully",
      data: collection,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
