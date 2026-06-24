const { PrismaClient } = require("@prisma/client");
const { skip } = require("@prisma/client/runtime/library");
const prisma = new PrismaClient();

exports.getVocabularies = async (req, res) => {
  try {
    const vocabularies = await prisma.vocabularies.findMany({
      where: { is_delete: "0" },
    });
    res.status(200).json({
      message: "Lấy danh sách từ vựng thành công",
      data: vocabularies,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Lỗi máy chủ nội bộ" });
  }
};

exports.getVocabulary = async (req, res) => {
  try {
    const { id } = req.params;
    const vocabulary = await prisma.vocabularies.findUnique({
      where: { id: parseInt(id), is_delete: "0" },
    });
    if (!vocabulary) {
      return res.status(404).json({ error: "Không tìm thấy từ vựng" });
    }
    res.status(200).json({
      message: "Lấy thông tin từ vựng thành công",
      data: vocabulary,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Lỗi máy chủ nội bộ" });
  }
};

exports.createVocabulary = async (req, res) => {
  try {
    const data = req.body;
    if (!data || (Array.isArray(data) && data.length === 0)) {
      return res
        .status(400)
        .json({ error: "Dữ liệu gửi lên không được để trống!" });
    }
    if (Array.isArray(data)) {
      const vocabularies = await prisma.vocabularies.createMany({
        data: data,
        skipDuplicates: true,
      });

      return res.status(201).json({
        data: vocabularies,
        message: `Đã tạo thành công ${vocabularies.count} từ vựng.`,
      });
    }
    const {
      collection_id,
      word,
      pos,
      ipa,
      meaning,
      example_sentence,
      example_meaning,
      audio_word_path,
      audio_example_path,
    } = data;
    const vocabulary = await prisma.vocabularies.create({
      data: {
        collection_id,
        word,
        pos,
        ipa,
        meaning,
        example_sentence,
        example_meaning,
        audio_word_path,
        audio_example_path,
      },
    });
    return res.status(201).json({
      data: vocabulary,
      message: "Tạo từ vựng thành công",
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      error: "Lỗi máy chủ nội bộ",
      message: error.message,
    });
  }
};

exports.updateVocabulary = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      collection_id,
      word,
      pos,
      ipa,
      meaning,
      example_sentence,
      example_meaning,
      audio_word_path,
      audio_example_path,
    } = req.body;
    const vocabulary = await prisma.vocabularies.update({
      where: { id: parseInt(id), is_delete: "0" },
      data: {
        collection_id,
        word,
        pos,
        ipa,
        meaning,
        example_sentence,
        example_meaning,
        audio_word_path,
        audio_example_path,
      },
    });
    res.status(200).json({
      message: "Cập nhật từ vựng thành công",
      data: vocabulary,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Lỗi máy chủ nội bộ" });
  }
};

exports.deleteVocabulary = async (req, res) => {
  try {
    const { id } = req.params;
    const vocabulary = await prisma.vocabularies.update({
      where: { id: parseInt(id), is_delete: "0" },
      data: { is_delete: "1" },
    });
    res.status(200).json({
      message: "Xóa từ vựng thành công",
      data: vocabulary,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Lỗi máy chủ nội bộ" });
  }
};

exports.getVocabulariesByCollectionId = async (req, res) => {
  try {
    const { id } = req.params;
    const vocabularies = await prisma.vocabularies.findMany({
      where: { collection_id: parseInt(id), is_delete: "0" },
    });
    if (!vocabularies) {
      return res.status(404).json({ error: "Không tìm thấy từ vựng" });
    }
    res.status(200).json({
      message: "Lấy thông tin từ vựng thành công",
      data: vocabularies,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Lỗi máy chủ nội bộ" });
  }
};
