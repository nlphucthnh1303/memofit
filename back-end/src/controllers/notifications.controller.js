const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

exports.getDueReviews = async (req, res) => {
  try {
    const userId = req.user.userId;
    const now = new Date();

    const dueItems = await prisma.user_vocabulary_progress.findMany({
      where: {
        user_id: userId,
        is_delete: "0",
        next_review_date: {
          lte: now,
        },
      },
      select: {
        vocabulary_id: true,
        interval_days: true,
        ease_factor: true,
        next_review_date: true,
        status: true,
        vocabularies: {
          select: {
            word: true,
            meaning: true,
            collections: {
              select: {
                title: true,
              },
            },
          },
        },
      },
      orderBy: {
        next_review_date: "asc",
      },
    });

    const notifications = dueItems.map((item) => ({
      vocabularyId: item.vocabulary_id,
      word: item.vocabularies?.word || "",
      meaning: item.vocabularies?.meaning || "",
      collectionTitle: item.vocabularies?.collections?.title || "N/A",
      intervalDays: item.interval_days,
      easeFactor: item.ease_factor,
      nextReviewDate: item.next_review_date,
      status: item.status,
    }));

    return res.status(200).json({
      success: true,
      total: notifications.length,
      data: notifications,
    });
  } catch (error) {
    console.error("Notification Error:", error);
    return res.status(500).json({
      success: false,
      message: "Đã xảy ra lỗi khi lấy danh sách thông báo ôn tập.",
    });
  }
};
