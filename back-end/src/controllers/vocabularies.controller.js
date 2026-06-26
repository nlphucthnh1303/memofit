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

exports.getVocabulariesDetail = async (req, res) => {
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
    if (!req.file) {
      return res.status(400).json({ message: "Chưa upload file" });
    }
    const { collection_id, user_id } = req.params;
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
    const vocabData = [];
    worksheet.eachRow({ includeEmpty: false }, (row, rowNumber) => {
      if (rowNumber === 1) return;

      const word = row.getCell(1).value;
      const pos = row.getCell(2).value;
      const ipa = row.getCell(3).value;
      const meaning = row.getCell(4).value;

      if (!word || !ipa || !meaning) {
        throw new Error(
          `Dữ liệu không hợp lệ tại dòng ${rowNumber}: Thiếu thông tin bắt buộc`,
        );
      }

      if (pos && !validPos.includes(pos.toString())) {
        throw new Error(
          `Dữ liệu không hợp lệ tại dòng ${rowNumber}: Loại từ '${pos}' không hợp lệ`,
        );
      }
      vocabData.push({
        collection_id: parseInt(collection_id),
        word: row.getCell(1).value?.toString(),
        pos: row.getCell(2).value?.toString(),
        ipa: row.getCell(3).value?.toString(),
        meaning: row.getCell(4).value?.toString(),
        example_sentence: row.getCell(5).value?.toString(),
        example_meaning: row.getCell(6).value?.toString(),
      });
    });

    const result = await prisma.vocabularies.createMany({
      data: vocabData,
      skipDuplicates: true,
    });

    const allVocabs = await prisma.vocabularies.findMany({
      where: { collection_id: parseInt(collection_id) },
      select: { id: true, word: true, pos: true },
    });

    const vocabMap = new Map();
    allVocabs.forEach((v) => vocabMap.set(`${v.word}|${v.pos}`, v.id));

    const progressData = vocabData.map((item) => ({
      user_id: parseInt(user_id),
      vocabulary_id: vocabMap.get(`${item.word}|${item.pos}`),
      status: "learning",
    }));
    await prisma.user_vocabulary_progress.createMany({ data: progressData });

    res.status(200).json({
      message: "Kiểm tra dữ liệu import thành công",
      data: result,
    });
  } catch (error) {
    console.error(error);
    res.status(400).json({ error: error.message });
  }
};
