# BlogMaster PRO

**BlogMaster PRO** is a comprehensive Fullstack Blog application designed for creating, managing, and sharing articles. It features secure authentication, real-time comments, PDF export, and a responsive modern UI.

![Project Status](https://img.shields.io/badge/status-active-success.svg)
![License](https://img.shields.io/badge/license-MIT-blue.svg)

---

## 🚀 Features

### 🔐 Authentication & Security
- **Secure Access**: JWT-based authentication with HTTP-only cookies/local storage.
- **Route Protection**: Protected routes for authenticated users.
- **Data Security**: Password hashing with Bcrypt.

### 📝 Article Management (CRUD)
- **Create**: Rich text editor for writing articles with cover image upload.
- **Read**: Beautiful article view with pagination and details.
- **Update**: Edit existing articles and metadata.
- **Delete**: Remove articles securely.

### 💾 Advanced Capabilities
- **PDF Export**: Download any article as a professionally formatted PDF.
- **Comments System**: Real-time discussions on articles.
- **Smart Search**: Filter articles by title, content, or tags.
- **Auto-Save**: Drafts are automatically saved locally every 30 seconds.
- **Dashboard**: Analytics and article management center.

---

## 🛠 Tech Stack

The project is built on the **MERN Stack** (MongoDB, Express, React, Node.js).

### Frontend (Client)
- **React 18** (Vite): Fast and modern UI library.
- **Redux Toolkit**: State management for Auth and Articles.
- **Tailwind CSS**: Utility-first styling framework.
- **Axios**: HTTP client with interceptors.
- **Lucide React**: Modern iconography.
- **React Hot Toast**: User notifications.

### Backend (Server)
- **Node.js & Express**: Robust REST API.
- **MongoDB & Mongoose**: NoSQL database and ODM.
- **JWT**: Secure stateless authentication.
- **Multer**: File upload handling.
- **PDFKit**: Server-side PDF generation.

---

## 📂 Project Structure

```
BlogMaster_PRO/
├── client/                 # React Frontend
│   ├── src/
│   │   ├── components/     # Reusable UI components
│   │   ├── pages/          # Application pages
│   │   ├── redux/          # Global state management
│   │   └── utils/          # Helpers (Axios, etc.)
│
├── server/                 # Node.js Backend
│   ├── controllers/        # Business logic
│   ├── models/             # Database schemas
│   ├── routes/             # API endpoints
│   └── uploads/            # Static file storage
```

---

## ⚡️ Installation & Setup

### Prerequisites
- Node.js (v14+)
- MongoDB (Local or Atlas)

### 1. Clone the Repository
```bash
git clone <repository-url>
cd BlogMaster_PRO
```

### 2. Backend Setup
```bash
cd server
npm install
```

Create a `.env` file in `server/`:
```env
PORT=5001
MONGO_URI=mongodb://localhost:27017/blogmaster_pro
JWT_SECRET=your_super_secret_key
JWT_EXPIRE=7d
```
*Note: Port 5001 is used to avoid conflicts with macOS AirPlay.*

Start the server:
```bash
npm run dev
```

### 3. Frontend Setup
Open a new terminal:
```bash
cd client
npm install
npm run dev
```

---

## 📖 How to Use

1.  **Access the App**: Open `http://localhost:5173` in your browser.
2.  **Login / Register**:
    *   **Test Account**:
        *   Email: `testuser@example.com`
        *   Password: `password123`
    *   Or register a new account via the Sign Up page.
3.  **Create an Article**:
    *   Navigate to **Dashboard** -> **Create New Article**.
    *   Fill in the title, content, and upload a cover image.
    *   The **Auto-save** feature will keep your draft safe.
4.  **Interact**:
    *   View your article on the home page.
    *   Leave a comment.
    *   Click **"Download PDF"** to get a copy of the article.

---

## 📡 API Endpoints

| Method | Endpoint                   | Description                |
| :------| :--------------------------| :--------------------------|
| `POST` | `/api/auth/register`       | Register a new user        |
| `POST` | `/api/auth/login`          | Authenticate user          |
| `POST` | `/api/articles`            | Create a new article       |
| `GET`  | `/api/articles`            | Fetch all articles         |
| `GET`  | `/api/articles/:id`        | Get single article details |
| `GET`  | `/api/articles/:id/pdf`    | Download article PDF       |
| `POST` | `/api/comments/:articleId` | Add a comment              |

---

## 📄 License

MIT License

---

## 📞 Support

For support, contact [youssefessediqtaj@gmail.com].

