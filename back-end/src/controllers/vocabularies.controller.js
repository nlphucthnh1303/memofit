const { PrismaClient } = require("@prisma/client");
const { skip } = require("@prisma/client/runtime/library");
const prisma = new PrismaClient();
const ExcelJS = require("exceljs");
const multer = require("multer");
const upload = multer({ storage: multer.memoryStorage() });

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

exports.getVocabulariesSearch = async (req, res) => {
  try {
    const { keyword } = req.params;
    const vocabularies = await prisma.vocabularies.findMany({
      where: {
        is_delete: "0",
        OR: [
          { word: { contains: keyword } },
          { meaning: { contains: keyword } },
        ],
      },
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

exports.getVocabulariesDetailByCollectionId = async (req, res) => {
  try {
    const { collection_id, user_id } = req.params;
    const vocabularies = await prisma.vocabularies.findMany({
      where: {
        collection_id: parseInt(collection_id),
        is_delete: "0",
      },
      include: {
        user_vocabulary_progress: {
          where: {
            user_id: parseInt(user_id),
            is_delete: "0",
          },
        },
      },
    });

    res.status(200).json({
      message: "Lấy danh sách từ vựng chi tiết thành công",
      data: vocabularies,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Lỗi máy chủ nội bộ" });
  }
};

exports.getVocabularyDetail = async (req, res) => {
  try {
    const { vocabulary_id, user_id } = req.params;
    const vocabulary = await prisma.vocabularies.findUnique({
      where: {
        id: parseInt(vocabulary_id),
        is_delete: "0",
      },
      include: {
        user_vocabulary_progress: {
          where: {
            user_id: parseInt(user_id),
            is_delete: "0",
          },
        },
      },
    });

    if (!vocabulary) {
      return res.status(404).json({ error: "Không tìm thấy từ vựng" });
    }

    res.status(200).json({
      message: "Lấy thông tin từ vựng chi tiết thành công",
      data: vocabulary,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Lỗi máy chủ nội bộ" });
  }
};

// feature import vocabulary
exports.downloadImportTemplate = async (req, res) => {
  try {
    const workbook = new ExcelJS.Workbook();
    const sheet = workbook.addWorksheet("Vocabularies");
    sheet.columns = [
      { header: "Từ vựng", key: "word", width: 20 },
      { header: "Loại từ", key: "pos", width: 30 },
      { header: "IPA", key: "ipa", width: 20 },
      { header: "Nghĩa", key: "meaning", width: 30 },
      { header: "Câu ví dụ", key: "example_sentence", width: 20 },
      { header: "Nghĩa câu ví dụ", key: "example_meaning", width: 30 },
    ];

    const headerRow = sheet.getRow(1);
    headerRow.eachCell((cell) => {
      cell.fill = {
        type: "pattern",
        pattern: "solid",
        fgColor: { argb: "FFC6EFCE" },
      };
      cell.border = {
        top: { style: "thin" },
        left: { style: "thin" },
        bottom: { style: "thin" },
        right: { style: "thin" },
      };
      cell.font = { bold: true };
    });

    const posColumn = sheet.getColumn(2);
    posColumn.dataValidation = {
      type: "list",
      allowBlank: true,
      formulae: [
        '"noun,pronoun,verb,adjective,adverb,preposition,conjunction,interjection"',
      ],
    };

    res.setHeader(
      "Content-Type",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    );
    res.setHeader(
      "Content-Disposition",
      'attachment; filename="vocabulary_template.xlsx"',
    );

    await workbook.xlsx.write(res);
    res.end();
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Lỗi máy chủ nội bộ" });
  }
};

exports.previewImportTemplate = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "Chưa upload file" });
    }
    // đọc file

    const workbook = new ExcelJS.Workbook();
    await workbook.xlsx.load(req.file.buffer);
    const worksheet = workbook.getWorksheet(1);

    const previewData = [];
    const validPos = [
      "noun",
      "pronoun",
      "verb",
      "adjective",
      "adverb",
      "preposition",
      "conjunction",
      "interjection",
    ];

    worksheet.eachRow({ includeEmpty: false }, (row, rowNumber) => {
      if (rowNumber === 1) return;

      const word = row.getCell(1).value;
      const pos = row.getCell(2).value;
      const ipa = row.getCell(3).value;
      const meaning = row.getCell(4).value;
      const example_sentence = row.getCell(5).value;
      const example_meaning = row.getCell(6).value;

      const errors = [];
      if (!word) errors.push("Từ vựng không được để trống");
      if (!ipa) errors.push("IPA không được để trống");
      if (pos && !validPos.includes(pos.toString()))
        errors.push(`Loại từ '${pos}' không hợp lệ`);
      if (!meaning) errors.push("Nghĩa không được để trống");

      previewData.push({
        row: rowNumber,
        data: { word, pos, ipa, meaning, example_sentence, example_meaning },
        isValid: errors.length === 0,
        errors,
      });
    });
    res.status(200).json({
      message: "Kiểm tra dữ liệu import thành công",
      data: previewData,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Lỗi máy chủ nội bộ" });
  }
};

exports.confirmImportTemplate = async (req, res) => {
  try {
    const { collection_id, user_id, vocabularies } = req.body;

    if (
      !vocabularies ||
      !Array.isArray(vocabularies) ||
      vocabularies.length === 0
    ) {
      return res
        .status(400)
        .json({ message: "Dữ liệu import không hợp lệ hoặc trống" });
    }

    if (!collection_id || !user_id) {
      return res
        .status(400)
        .json({ message: "Thiếu collection_id hoặc user_id" });
    }

    const vocabData = vocabularies.map((item) => ({
      collection_id: parseInt(collection_id),
      word: item.word?.toString(),
      pos: item.pos?.toString(),
      ipa: item.ipa?.toString(),
      meaning: item.meaning?.toString(),
      example_sentence: item.example_sentence?.toString(),
      example_meaning: item.example_meaning?.toString(),
    }));

    // Create vocabularies
    const result = await prisma.vocabularies.createMany({
      data: vocabData,
      skipDuplicates: true,
    });

    // To create progress, we need the IDs of the newly created (or existing) vocabularies
    // Since createMany doesn't return IDs, we find them by word and collection_id
    const words = vocabData.map((v) => v.word);
    const allVocabs = await prisma.vocabularies.findMany({
      where: {
        collection_id: parseInt(collection_id),
        word: { in: words },
        is_delete: "0",
      },
      select: { id: true, word: true, pos: true },
    });

    const vocabMap = new Map();
    allVocabs.forEach((v) => vocabMap.set(`${v.word}|${v.pos}`, v.id));

    const progressData = [];
    for (const item of vocabData) {
      const vocabId = vocabMap.get(`${item.word}|${item.pos}`);
      if (vocabId) {
        // Check if progress already exists to avoid duplicates
        const existingProgress =
          await prisma.user_vocabulary_progress.findFirst({
            where: {
              user_id: parseInt(user_id),
              vocabulary_id: vocabId,
              is_delete: "0",
            },
          });

        if (!existingProgress) {
          progressData.push({
            user_id: parseInt(user_id),
            vocabulary_id: vocabId,
            status: "learning",
          });
        }
      }
    }

    if (progressData.length > 0) {
      await prisma.user_vocabulary_progress.createMany({ data: progressData });
    }

    res.status(200).json({
      message: "Nhập dữ liệu thành công",
      data: result,
    });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ error: "Lỗi máy chủ nội bộ", message: error.message });
  }
};
