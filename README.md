# 🛒 ShopSmart - Chatbot AI Hỗ Trợ Mua Sắm

<div align="center">

![AI Agent](https://img.shields.io/badge/AI-Chatbot-blue?style=for-the-badge&logo=openai)
![LangGraph](https://img.shields.io/badge/LangGraph-JS-green?style=for-the-badge)
![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-green?style=for-the-badge&logo=mongodb)
![React](https://img.shields.io/badge/React-Frontend-blue?style=for-the-badge&logo=react)

**Chatbot AI thông minh cho cửa hàng nội thất**

</div>

---

## 📖 Giới Thiệu

**ShopSmart** là một ứng dụng web thương mại điện tử tích hợp chatbot AI thông minh, giúp khách hàng tìm kiếm và mua sắm sản phẩm nội thất một cách dễ dàng. Chatbot sử dụng công nghệ AI hiện đại để hiểu ngữ cảnh và hỗ trợ khách hàng như một nhân viên bán hàng thực sự.

### 🎯 Mục Tiêu Dự Án

- Xây dựng chatbot AI có khả năng tương tác tự nhiên với khách hàng
- Hỗ trợ tìm kiếm sản phẩm thông minh bằng ngôn ngữ tự nhiên
- Cung cấp trải nghiệm mua sắm trực tuyến hiện đại và tiện lợi

---

## ✨ Tính Năng Chính

### 🤖 Chatbot AI

| Tính năng                 | Mô tả                                                  |
| ------------------------- | ------------------------------------------------------ |
| **Trả lời thông minh**    | Hiểu ngữ cảnh và trả lời tự nhiên như người thật       |
| **Tìm kiếm ngữ nghĩa**    | Tìm sản phẩm theo ý nghĩa, không cần từ khóa chính xác |
| **Lưu lịch sử hội thoại** | Nhớ những gì đã nói trong cuộc trò chuyện              |
| **Thêm vào giỏ hàng**     | Khách có thể yêu cầu chatbot thêm sản phẩm vào giỏ     |
| **Quick Replies**         | Các nút gợi ý nhanh giúp khách hàng dễ dàng tương tác  |
| **Typing Indicator**      | Hiển thị trạng thái "đang gõ" khi chờ bot trả lời      |

---

## 🛠️ Công Nghệ Sử Dụng

### Frontend

- **React.js** - Thư viện xây dựng giao diện người dùng
- **React Router DOM** - Điều hướng trang trong ứng dụng
- **React Icons** - Bộ icon đẹp mắt
- **React Markdown** - Hiển thị nội dung markdown trong chat

### Backend

- **Node.js & Express.js** - Server và API
- **TypeScript** - Ngôn ngữ lập trình có kiểu dữ liệu

### AI & Machine Learning

- **Groq API (Llama 3.3 70B)** - Mô hình ngôn ngữ lớn xử lý hội thoại
- **LangChain & LangGraph** - Framework xây dựng AI Agent
- **HuggingFace Embeddings** - Tạo vector nhúng cho tìm kiếm ngữ nghĩa

### Database

- **MongoDB Atlas** - Cơ sở dữ liệu đám mây
- **MongoDB Vector Search** - Tìm kiếm ngữ nghĩa dựa trên vector

---

## 🏗️ Kiến Trúc Hệ Thống

```
┌─────────────────────────────────────────────────────────────────┐
│                         CLIENT (React.js)                       │
├─────────────────────────────────────────────────────────────────┤
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────────────────┐  │
│  │ Ecommerce.  │  │ProductDetail│  │     ChatWidget          │  │
│  │  - Products │  │  - Details  │  │  - Messages             │  │
│  │  - Cart     │  │  - Reviews  │  │  - Quick Replies        │  │
│  │  - Wishlist │  │  - Related  │  │  - Typing Indicator     │  │
│  └─────────────┘  └─────────────┘  └─────────────────────────┘  │
└──────────────────────────┬──────────────────────────────────────┘
                           │ HTTP REST API
┌──────────────────────────▼──────────────────────────────────────┐
│                      SERVER (Node.js/Express)                   │
├─────────────────────────────────────────────────────────────────┤
│  ┌─────────────────────────────────────────────────────────┐    │
│  │                    AI Agent (LangGraph)                 │    │
│  │  ┌─────────────┐  ┌─────────────┐  ┌─────────────────┐  │    │
│  │  │  Groq LLM   │  │ Tool Node   │  │  State Manager  │  │    │
│  │  │  (Llama)    │  │  (Search)   │  │  (Checkpointer) │  │    │
│  │  └─────────────┘  └─────────────┘  └─────────────────┘  │    │
│  └─────────────────────────────────────────────────────────┘    │
└──────────────────────────┬──────────────────────────────────────┘
                           │
┌──────────────────────────▼──────────────────────────────────────┐
│                     MongoDB Atlas (Cloud)                       │
├─────────────────────────────────────────────────────────────────┤
│  ┌─────────────────┐  ┌─────────────────┐  ┌─────────────────┐  │
│  │  items          │  │  checkpoints    │  │  vector_index   │  │
│  │  (Products)     │  │  (Chat History) │  │  (Embeddings)   │  │
│  └─────────────────┘  └─────────────────┘  └─────────────────┘  │
└─────────────────────────────────────────────────────────────────┘
```

---

## 📊 Luồng Hoạt Động Chatbot

```
┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│   Người     │     │   AI Agent  │     │  MongoDB    │
│   Dùng      │     │  (LangGraph)│     │   Atlas     │
└──────┬──────┘     └──────┬──────┘     └──────┬──────┘
       │                   │                   │
       │  "Tìm ghế sofa"   │                   │
       │──────────────────>│                   │
       │                   │                   │
       │                   │  Vector Search    │
       │                   │──────────────────>│
       │                   │                   │
       │                   │  Kết quả sản phẩm │
       │                   │<──────────────────│
       │                   │                   │
       │  Danh sách sofa   │                   │
       │  với link sản phẩm│                   │
       │<──────────────────│                   │
       │                   │                   │
       │  "Thêm cái đầu    │                   │
       │   vào giỏ hàng"   │                   │
       │──────────────────>│                   │
       │                   │                   │
       │  [[ACTION:        │                   │
       │  ADD_TO_CART:ID]] │                   │
       │<──────────────────│                   │
       │                   │                   │
       │  ✅Đã thêm vào    │                   │
       │     giỏ hàng!     │                   │
       └───────────────────┴───────────────────┘
```

---

## 📁 Cấu Trúc Thư Mục

```
ecommerce-chat-helper/
├── client/                     # Frontend React
│   ├── public/
│   │   └── index.html
│   ├── src/
│   │   ├── components/
│   │   │   ├── ChatWidget.js      # Component chatbot
│   │   │   ├── EcommerceStore.js  # Trang chủ cửa hàng
│   │   │   └── ProductDetail.js   # Trang chi tiết sản phẩm
│   │   ├── App.js                 # Component chính với routing
│   │   ├── App.css                # Styles toàn ứng dụng
│   │   └── index.js               # Entry point
│   └── package.json
│
├── server/                     # Backend Node.js
│   ├── agent.ts                   # AI Agent với LangGraph
│   ├── index.ts                   # Express server & API routes
│   ├── huggingface-embeddings.ts  # HuggingFace embeddings
│   ├── seed-database.ts           # Script tạo dữ liệu mẫu
│   ├── .env                       # Biến môi trường (API keys)
│   ├── tsconfig.json
│   └── package.json
│
└── README.md
```

---

## 🔌 API Endpoints

| Method | Endpoint          | Mô tả                           |
| ------ | ----------------- | ------------------------------- |
| `GET`  | `/`               | Kiểm tra server hoạt động       |
| `GET`  | `/products`       | Lấy danh sách tất cả sản phẩm   |
| `GET`  | `/products/:id`   | Lấy thông tin chi tiết sản phẩm |
| `POST` | `/chat`           | Bắt đầu cuộc hội thoại mới      |
| `POST` | `/chat/:threadId` | Tiếp tục cuộc hội thoại         |

---

## 🎨 Giao Diện Người Dùng

### Trang Chủ

- Hiển thị banner khuyến mãi
- Bộ lọc danh mục sản phẩm (có thể mở rộng/thu gọn)
- Lưới sản phẩm với thông tin cơ bản
- Nút thêm vào giỏ hàng/yêu thích

### Trang Chi Tiết Sản Phẩm

- Hình ảnh sản phẩm lớn
- Thông tin đầy đủ: giá, mô tả, đánh giá
- Chọn số lượng
- Sản phẩm liên quan

### Chatbot Widget

- Nút chat nổi góc phải màn hình
- Nút Hide (ẩn tạm) và Close (đóng + xóa chat)
- Quick reply buttons
- Typing indicator animation
- Hỗ trợ markdown và link click được

---

## 🧪 Ví Dụ Tương Tác Chatbot

```
👤 User: Tìm ghế sofa

🤖 Bot: Đây là một số ghế sofa tuyệt vời cho bạn:
   - [Modern Leather Sofa](/product/SOFA001) - **$999.99**
   - [Classic Velvet Couch](/product/SOFA002) - **$1,299.99**
   ...

👤 User: Thêm cái đầu tiên vào giỏ hàng

🤖 Bot: Đã thêm Modern Leather Sofa vào giỏ hàng của bạn! ✅
```

---

## 👨‍💻 Tác Giả

Đặng Gia Nguyên
Nguyễn Thanh Mạnh Hùng

---

<div align="center">

**Cảm ơn bạn đã quan tâm đến dự án!** 🙏

</div>
