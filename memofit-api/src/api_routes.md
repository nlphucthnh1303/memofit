# DANH SÁCH CÁC API ROUTERS & CONTROLLERS (MEMOFIT BACK-END)

Tài liệu này liệt kê chi tiết toàn bộ các tuyến đường (routes), phương thức (HTTP Method), hàm xử lý trong Controller, yêu cầu xác thực và chức năng chính của từng API trong dự án Memofit.

---

## Tóm tắt các Router của hệ thống
Hệ thống router được khai báo cấu hình tại `app.js` và được phân phối theo sơ đồ tiền tố (Base Path):

| Nhóm chức năng | Base Path | File Route gốc | File Controller tương ứng |
| :--- | :--- | :--- | :--- |
| **Xác thực (Auth)** | `/api/auth` | `auth.route.js` | `auth.controller.js` |
| **Tổng quan Dashboard** | `/api/dashboard` | `dashboard.route.js` | `dashboard.controller.js` |
| **Người dùng (Users)** | `/api/users` | `users.route.js` | `users.controller.js` |
| **Bộ sưu tập (Collections)** | `/api/collections` | `collections.route.js` | `collections.controller.js` |
| **Từ vựng (Vocabularies)** | `/api/vocabularies` | `vocabularies.route.js` | `vocabularies.controller.js` |
| **Tiến độ học từ (SM-2 Progress)** | `/api/user-vocabulary-progress` | `user_vocabulary_progress.route.js` | `user_vocabulary_progress.controller.js` |
| **Đề thi (Exams)** | `/api/exams` | `exams.route.js` | `exams.controller.js` |
| **Gán câu hỏi đề thi (Exam Questions)** | `/api/exam-questions` | `exam_questions.route.js` | `exam_questions.controller.js` |
| **Câu hỏi (Questions)** | `/api/questions` | `questions.route.js` | `questions.controller.js` |
| **Phiên làm bài (Quiz Sessions)** | `/api/quiz-sessions` | `quiz_sessions.route.js` | `quiz_sessions.controller.js` |
| **Kết quả bài tập (Quiz Results)** | `/api/quiz-results` | `quiz_results.route.js` | `quiz_results.controller.js` |
| **Thông báo ôn tập (Notifications)** | `/api/notifications` | `notifications.route.js` | `notifications.controller.js` |
| **Tải tệp đa phương tiện (Media)** | `/api/media` | `media.route.js` | `media.controller.js` |

---

## Chi tiết danh sách API Endpoint

### 1. Xác thực (Auth) - `/api/auth`
Cung cấp các API đăng ký, đăng nhập, khôi phục mật khẩu và hệ thống gửi/xác thực mã OTP qua Email.

| # | Phương thức | Endpoint | Yêu cầu xác thực | Hàm xử lý Controller | Chức năng chính |
| :---: | :---: | :--- | :---: | :--- | :--- |
| 1 | `POST` | `/api/auth/register` | Không | `register` | Đăng ký tài khoản người dùng mới trong hệ thống. |
| 2 | `POST` | `/api/auth/login` | Không | `login` | Đăng nhập tài khoản hệ thống, trả về JWT Token và thông tin người dùng. |
| 3 | `POST` | `/api/auth/send-register-otp` | Không | `sendRegisterAuthOTP` | Gửi mã OTP xác thực tới Email của người dùng lúc đăng ký tài khoản. |
| 4 | `POST` | `/api/auth/send-forgot-otp` | Không | `sendForgotAuthOTP` | Gửi mã OTP khôi phục mật khẩu tới Email của người dùng bị quên mật khẩu. |
| 5 | `POST` | `/api/auth/verify-otp` | Không | `verifyOtp` | Xác minh tính hợp lệ của mã OTP mà người dùng nhập vào. |
| 6 | `POST` | `/api/auth/reset-password` | Không | `resetPassword` | Thực hiện thay đổi mật khẩu mới cho người dùng sau khi OTP được xác thực. |

---

### 2. Tổng quan Dashboard - `/api/dashboard`
Cung cấp số liệu thống kê tình hình học tập tổng thể của người học.

| # | Phương thức | Endpoint | Yêu cầu xác thực | Hàm xử lý Controller | Chức năng chính |
| :---: | :---: | :--- | :---: | :--- | :--- |
| 7 | `GET` | `/api/dashboard/overview` | Có (JWT Token) | `getDashboardOverview` | Lấy dữ liệu tổng quan Dashboard (tổng số từ đã học, chuỗi streak hiện tại/dài nhất, tỉ lệ trả lời đúng câu hỏi, thống kê sức khỏe từ vựng theo trạng thái thuật toán SM-2, dữ liệu biểu đồ tiến trình 7 ngày gần nhất và danh sách từ vựng mới ôn tập). |

---

### 3. Người dùng (Users) - `/api/users`
Cung cấp các API CRUD liên quan tới quản lý tài khoản người dùng và thiết lập dữ liệu cá nhân.

| # | Phương thức | Endpoint | Yêu cầu xác thực | Hàm xử lý Controller | Chức năng chính |
| :---: | :---: | :--- | :---: | :--- | :--- |
| 8 | `GET` | `/api/users` | Không | `getUsers` | Lấy danh sách toàn bộ người dùng trong cơ sở dữ liệu. |
| 9 | `POST` | `/api/users` | Không | `createUser` | Tạo mới thông tin tài khoản người dùng (chức năng quản trị). |
| 10 | `POST` | `/api/users/reset-data` | Có (JWT Token) | `resetUserData` | Làm sạch (xóa toàn bộ) dữ liệu học tập cá nhân của người dùng đăng nhập hiện tại. |
| 11 | `GET` | `/api/users/:id` | Không | `getUser` | Lấy thông tin cá nhân chi tiết của người dùng cụ thể bằng ID. |
| 12 | `PUT` | `/api/users/:id` | Không | `updateUser` | Cập nhật thông tin tài khoản cá nhân (tên, email, ảnh đại diện, streak...) theo ID. |
| 13 | `DELETE` | `/api/users/:id` | Không | `deleteUser` | Xóa vĩnh viễn (hoặc đánh dấu xóa) người dùng khỏi hệ thống bằng ID. |
| 14 | `PUT` | `/api/users/:id/otp-verify-id` | Không | `updateOtpVerifyById` | Cập nhật trạng thái xác thực mã OTP của người dùng dựa theo ID tài khoản. |
| 15 | `PUT` | `/api/users/:email/otp-verify-email` | Không | `updateOtpVerifyByEmail` | Cập nhật trạng thái xác thực mã OTP của người dùng dựa theo Email tài khoản. |

---

### 4. Bộ sưu tập từ vựng (Collections) - `/api/collections`
Quản lý các nhóm/bộ sưu tập lưu trữ từ vựng tiếng Anh theo các nhóm chủ đề học tập.

| # | Phương thức | Endpoint | Yêu cầu xác thực | Hàm xử lý Controller | Chức năng chính |
| :---: | :---: | :--- | :---: | :--- | :--- |
| 16 | `GET` | `/api/collections` | Không | `getCollections` | Lấy danh sách tất cả các bộ sưu tập từ vựng hiện đang active. |
| 17 | `POST` | `/api/collections` | Không | `createCollection` | Tạo mới một bộ sưu tập từ vựng (đường dẫn ảnh, tiêu đề, mô tả...). |
| 18 | `GET` | `/api/collections/:id` | Không | `getCollection` | Lấy thông tin chi tiết một bộ sưu tập theo ID của bộ sưu tập đó. |
| 19 | `PUT` | `/api/collections/:id` | Không | `updateCollection` | Cập nhật thông tin tiêu đề, mô tả, ảnh bìa của bộ sưu tập bằng ID. |
| 20 | `DELETE` | `/api/collections/:id` | Không | `deleteCollection` | Xóa bộ sưu tập (đánh dấu xóa mềm) bằng ID. |

---

### 5. Từ vựng (Vocabularies) - `/api/vocabularies`
Quản lý dữ liệu từ vựng trong hệ thống, cấu hình học tập và hỗ trợ các công cụ Import từ Excel hàng loạt.

| # | Phương thức | Endpoint | Yêu cầu xác thực | Hàm xử lý Controller | Chức năng chính |
| :---: | :---: | :--- | :---: | :--- | :--- |
| 21 | `GET` | `/api/vocabularies` | Không | `getVocabularies` | Lấy danh sách toàn bộ từ vựng hiện có trong toàn hệ thống. |
| 22 | `POST` | `/api/vocabularies` | Không | `createVocabulary` | Thêm mới thủ công một từ vựng đơn lẻ (word, meaning, ipa, audio...). |
| 23 | `GET` | `/api/vocabularies/detail/collection/:collection_id` | Có (JWT Token) | `getVocabulariesDetailByCollectionId` | Lấy danh sách từ vựng chi tiết kèm theo thông số tiến trình học cá nhân (interval, repetitions, next_review_date, status) trong một bộ sưu tập cụ thể của người dùng đó. |
| 24 | `GET` | `/api/vocabularies/detail/:vocabulary_id` | Có (JWT Token) | `getVocabularyDetail` | Lấy thông tin chi tiết về một từ vựng kèm theo thông số lịch sử tiến trình học tập của chính người dùng đăng đăng nhập theo ID từ vựng. |
| 25 | `GET` | `/api/vocabularies/:id` | Không | `getVocabulary` | Lấy dữ liệu cơ học (Word, IPA, Audio, Meaning) của một từ vựng cụ thể theo ID. |
| 26 | `PUT` | `/api/vocabularies/:id` | Không | `updateVocabulary` | Cập nhật thông tin (Chính tả, nghĩa dịch, ví dụ, bộ sưu tập gốc) của từ vựng theo ID. |
| 27 | `DELETE` | `/api/vocabularies/:id` | Không | `deleteVocabulary` | Đánh dấu xóa từ vựng trong cơ sở dữ liệu theo ID. |
| 28 | `GET` | `/api/vocabularies/collection/:id` | Không | `getVocabulariesByCollectionId` | Lấy danh sách cấu trúc từ vựng cơ bản thuộc về bộ sưu tập cụ thể bằng ID bộ sưu tập. |
| 29 | `GET` | `/api/vocabularies/search/:keyword/:limit` | Không | `getVocabulariesSearch` | Tìm kiếm nhanh từ vựng dựa vào từ khóa nhập vào cơ sở dữ liệu kèm theo giới hạn trả về. |
| 30 | `GET` | `/api/vocabularies/import/template` | Không | `downloadImportTemplate` | Xuất và tải về tệp Excel mẫu để người dùng nhập thông tin tự vựng đồng loạt. |
| 31 | `POST` | `/api/vocabularies/import/preview` | Không (Sử dụng Multer Memory) | `previewImportTemplate` | Đọc file Excel từ vựng do người dùng upload lên, phân tích và hiển thị trước danh sách kết quả lên màn hình. |
| 32 | `POST` | `/api/vocabularies/import/confirm` | Không | `confirmImportTemplate` | Xác nhận đồng loạt chèn dữ liệu các dòng từ vựng từ tệp Excel đã xem trước vào database. |

---

### 6. Tiến độ học từ vựng (Vocabulary Progress) - `/api/user-vocabulary-progress`
Quản lý lịch học tập thẻ nhớ (Flashcard) theo thuật toán lặp lại ngắt quãng SuperMemo-2 (SM-2).

| # | Phương thức | Endpoint | Yêu cầu xác thực | Hàm xử lý Controller | Chức năng chính |
| :---: | :---: | :--- | :---: | :--- | :--- |
| 33 | `POST` | `/api/user-vocabulary-progress` | Không | `createUserVocabularyProgress` | Tạo mới một thực thể tiến trình học từ vựng cho người dùng (Khởi tạo: `ease_factor` = 2.5, `status` = "learning", `repetitions` = 0, `interval_days` = 0...). |
| 34 | `GET` | `/api/user-vocabulary-progress/:id` | Không | `getUserVocabularyProgress` | Lấy chi tiết thông số thuật toán SM-2 (khoảng thời gian ôn tập, độ dễ factor...) của một từ vựng đã đăng ký. |
| 35 | `PUT` | `/api/user-vocabulary-progress/:id` | Không | `updateUserVocabularyProgress` | Cập nhật dữ liệu lặp lại ngắt quãng (SM-2) của từ vựng dựa trên mức độ trả lời / đánh giá từ người dùng (quality: từ 0-5), từ đó tự tính toán ra ngày ôn tập tiếp theo (`next_review_date`). |
| 36 | `DELETE` | `/api/user-vocabulary-progress/:id` | Không | `deleteUserVocabularyProgress` | Xóa thông tin tiến độ học và lịch sử ôn tập từ vựng này của người dùng. |

---

### 7. Đề thi (Exams) - `/api/exams`
Quản lý các đợt thi, các đề kiểm tra năng lực ngữ pháp hoặc từ vựng trong hệ thống.

| # | Phương thức | Endpoint | Yêu cầu xác thực | Hàm xử lý Controller | Chức năng chính |
| :---: | :---: | :--- | :---: | :--- | :--- |
| 37 | `GET` | `/api/exams` | Không | `getExams` | Lấy danh sách toàn bộ đề thi có sẵn trong hệ thống. |
| 38 | `POST` | `/api/exams` | Không | `createExam` | Khởi tạo một đề kiểm tra / bài thi mới (tiêu đề, thời gian làm bài, cấu hình loại bài thi...). |
| 39 | `GET` | `/api/exams/:id` | Không | `getExam` | Lấy thông tin chi tiết một đề kiểm tra chi tiết theo ID. |
| 40 | `PUT` | `/api/exams/:id` | Không | `updateExam` | Cập nhật cấu hình và nội dung của đề thi theo ID đề thi. |
| 41 | `DELETE` | `/api/exams/:id` | Không | `deleteExam` | Xóa đề thi cụ thể khỏi cơ sở dữ liệu bằng ID. |

---

### 8. Gán câu hỏi đề thi (Exam Questions) - `/api/exam-questions`
Quản lý mối liên quan nhiều - nhiều (Many-to-Many) liên kết các câu hỏi nằm trong đề thi nào.

| # | Phương thức | Endpoint | Yêu cầu xác thực | Hàm xử lý Controller | Chức năng chính |
| :---: | :---: | :--- | :---: | :--- | :--- |
| 42 | `GET` | `/api/exam-questions` | Không | `getExamQuestions` | Tìm kiếm và hiển thị toàn bộ bản ghi liên quan liên kết giữa câu hỏi và danh đề thi. |
| 43 | `POST` | `/api/exam-questions` | Không | `createExamQuestion` | Gán một câu hỏi đơn lẻ vào đề kiểm tra chỉ định. |
| 44 | `GET` | `/api/exam-questions/:id` | Không | `getExamQuestion` | Lấy chi tiết liên kết thông tin gán câu hỏi - đề thi theo ID bản ghi. |
| 45 | `PUT` | `/api/exam-questions/:id` | Không | `updateExamQuestion` | Chỉnh sửa cập nhật thông tin liên kết câu hỏi - đề thi. |
| 46 | `DELETE` | `/api/exam-questions/:id` | Không | `deleteExamQuestion` | Hủy gán (xóa liên kết) của một câu hỏi ra khỏi bài thi theo ID bản ghi. |
| 47 | `POST` | `/api/exam-questions/multiple` | Không | `createMultipleExamQuestions` | Gán nhanh đồng loạt nhiều câu hỏi vào một bài thi chỉ định cùng lúc. |

---

### 9. Câu hỏi ôn tập (Questions) - `/api/questions`
Quản lý thư viện câu hỏi học tập và kiểm tra (Trắc nghiệm Tiếng Anh). Hỗ trợ cơ chế tự động sinh câu hỏi thông minh bằng Thuật toán Tĩnh hoặc Trí tuệ nhân tạo (AI-Generated).

| # | Phương thức | Endpoint | Yêu cầu xác thực | Hàm xử lý Controller | Chức năng chính |
| :---: | :---: | :--- | :---: | :--- | :--- |
| 48 | `POST` | `/api/questions/multiple` | Không | `createMultipleQuestions` | Thêm mới hàng loạt câu hỏi trắc nghiệm tự tạo thông thường qua mảng. |
| 49 | `POST` | `/api/questions/generate-ai` | Không | `generateAiQuestions` | Sử dụng dịch vụ trí tuệ nhân tạo (AI) để tự động sinh thiết kế câu hỏi chất lượng cao từ các từ vựng đã chọn. |
| 50 | `POST` | `/api/questions/generate-static` | Không | `generateStaticQuestions` | Sử dụng thuật toán sinh tĩnh để tự sinh câu hỏi cơ bản (chọn từ, nghĩa, phát âm) tự động bằng cách lấy đáp án nhiễu trực tiếp từ database. |
| 51 | `GET` | `/api/questions` | Không | `getQuestions` | Lấy toàn bộ danh sách các câu hỏi hiện có. |
| 52 | `POST` | `/api/questions` | Không | `createQuestion` | Khởi tạo mới một câu hỏi trắc nghiệm đơn lẻ. |
| 53 | `GET` | `/api/questions/:id` | Không | `getQuestion` | Lấy thông tin đáp án và câu hỏi chi tiết theo ID câu hỏi. |
| 54 | `PUT` | `/api/questions/:id` | Không | `updateQuestion` | Cập nhật chỉnh sửa nội dung/đáp án của một câu hỏi theo ID. |
| 55 | `DELETE` | `/api/questions/:id` | Không | `deleteQuestion` | Thao tác xóa câu hỏi theo ID. |
| 56 | `GET` | `/api/questions/quizs/:exam_id/:session_id` | Có (JWT Token) | `getQuizBySessionIdAndExamId` | Lấy danh sách câu hỏi kiểm tra được liên kết với một phiên làm bài (`session_id`) và đề thi (`exam_id`) dành riêng cho người dùng. |

---

### 10. Phiên làm bài quiz (Quiz Sessions) - `/api/quiz-sessions`
Quản lý lịch sử và quá trình thực hiện một lượt làm bài kiểm tra trắc nghiệm của học viên.

| # | Phương thức | Endpoint | Yêu cầu xác thực | Hàm xử lý Controller | Chức năng chính |
| :---: | :---: | :--- | :---: | :--- | :--- |
| 57 | `GET` | `/api/quiz-sessions` | Không | `getQuizSessions` | Lấy danh sách tất cả các phiên làm bài thi. |
| 58 | `POST` | `/api/quiz-sessions` | Không | `createQuizSession` | Tạo một sự kiện / phiên bắt đầu làm bài thi của người dùng cụ thể. |
| 59 | `GET` | `/api/quiz-sessions/:id` | Không | `getQuizSession` | Lấy chi tiết trạng thái của phiên làm bài theo ID phiên. |
| 60 | `PUT` | `/api/quiz-sessions/:id` | Không | `updateQuizSession` | Cập nhật tiến độ của phiên thi hiện tại theo ID. |
| 61 | `DELETE` | `/api/quiz-sessions/:id` | Không | `deleteQuizSession` | Xóa bỏ lịch sử phiên làm bài theo ID phiên. |
| 62 | `PUT` | `/api/quiz-sessions/time-end/:id` | Không | `updateTimeEndQuizSession` | Xác nhận và cập nhật mốc thời gian kết thúc hoặc nộp bài của một phiên thi kiểm tra theo ID. |

---

### 11. Kết quả làm bài tập (Quiz Results) - `/api/quiz-results`
Ghi lại kết quả chi tiết từng câu trả lời đúng hay sai trong mỗi phiên làm bài của người dùng.

| # | Phương thức | Endpoint | Yêu cầu xác thực | Hàm xử lý Controller | Chức năng chính |
| :---: | :---: | :--- | :---: | :--- | :--- |
| 63 | `GET` | `/api/quiz-results` | Không | `getQuizResults` | Tải về danh sách tất cả các kết quả làm bài tập. |
| 64 | `POST` | `/api/quiz-results` | Có (JWT Token) | `createQuizResult` | Lưu lại câu trả lời và trạng thái đúng/sai cho một câu hỏi cụ thể người dùng vừa thực hiện; tự động liên kết với lịch sử phiên thi. |
| 65 | `GET` | `/api/quiz-results/:id` | Không | `getQuizResult` | Lấy kết quả một câu hỏi cụ thể đã trả lời bằng ID kết quả. |
| 66 | `PUT` | `/api/quiz-results/:id` | Không | `updateQuizResult` | Cập nhật điều chỉnh kết quả bài tập theo ID. |
| 67 | `DELETE` | `/api/quiz-results/:id` | Không | `deleteQuizResult` | Xóa bản ghi câu trả lời này theo ID. |

---

### 12. Thông báo ôn tập (Notifications) - `/api/notifications`
Cảnh báo và liệt kê các từ vựng đến hạn học hoặc đến hạn ôn tập trong ngày.

| # | Phương thức | Endpoint | Yêu cầu xác thực | Hàm xử lý Controller | Chức năng chính |
| :---: | :---: | :--- | :---: | :--- | :--- |
| 68 | `GET` | `/api/notifications/due-reviews` | Có (JWT Token) | `getDueReviews` | Lấy danh sách tất cả các từ vựng đã đến lịch cần ôn tập theo tính toán của thuật toán SM-2 (tiến độ lọc theo ngày hiện tại `next_review_date <= hiện tại` và chưa bị xóa). |

---

### 13. Tải tệp đa phương tiện (Media) - `/api/media`
Hỗ trợ upload ảnh/phương tiện phục vụ ảnh bìa bộ sưu tập, ảnh thẻ từ vựng hoặc ảnh đại diện cá nhân.

| # | Phương thức | Endpoint | Yêu cầu xác thực | Hàm xử lý Controller | Chức năng chính |
| :---: | :---: | :--- | :---: | :--- | :--- |
| 69 | `POST` | `/api/media/upload` | Không (Sử dụng Multer Disk) | `handleUpload` | Đón dữ liệu tệp tin ảnh từ client (`image`), lưu trữ vào máy chủ thông qua middleware Upload và trả về địa chỉ liên kết tệp tin tĩnh (static URL). |
