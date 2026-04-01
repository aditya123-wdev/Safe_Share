# 🔐 SafeShare

A secure file sharing web application that allows users to upload files, protect them with a PIN, and share them using encrypted, auto-expiring links.

---

## 🚀 Features

* 🔒 **AES-256 Encryption** for secure file storage
* 🔑 **PIN-protected downloads** (mandatory for access)
* ⏳ **Auto-expiring links**
* 📥 **Download limits** (self-destruct after limit reached)
* 🛡️ Secure backend with validation & hashing
* ⚡ Fast streaming download using Node.js pipeline
* 🎨 Minimal and clean UI using Tailwind CSS

---

## 🛠️ Tech Stack

### Backend

* Node.js
* Express.js
* MongoDB (Mongoose)

### Security & Utilities

* Crypto (AES-256-GCM encryption)
* Bcrypt (PIN hashing)
* UUID (unique file IDs)
* Multer (file uploads)
* Node-cron (expiry handling)

### Frontend

* HTML
* Tailwind CSS

---

## 📦 Dependencies Used

```json
{
  "bcrypt": "^6.0.0",
  "cors": "^2.8.5",
  "dotenv": "^17.3.1",
  "express": "^5.2.1",
  "mongoose": "^9.3.3",
  "multer": "^2.1.1",
  "node-cron": "^4.2.1",
  "stream": "^0.0.3",
  "uuid": "^13.0.0"
}
```

---

## 📂 Project Structure

```
SafeShare/
│
├── backend/
│   ├── controllers/
│   ├── models/
│   ├── routes/
│   ├── uploads/
│   └── server.js
│
├── frontend/
│   ├── index.html
│   ├── download.html
│   ├── success.html
│   └── 404.html
```

---

## ⚙️ Installation & Setup

### 1️⃣ Clone Repository

```bash
git clone https://github.com/your-username/SafeShare.git
cd SafeShare
```

---

### 2️⃣ Install Dependencies

```bash
cd backend
npm install
```

---

### 3️⃣ Setup Environment Variables

Create a `.env` file inside `backend/`:

```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
APP_SECRET=your_32_byte_secret_key
```

---

### 4️⃣ Start Server

```bash
npm start
```

Server runs at:

```
http://localhost:5000
```

---

## 🧪 How It Works

1. User uploads a file with a PIN
2. File is encrypted using AES-256-GCM
3. Stored securely on server
4. Unique download link is generated
5. User shares the link
6. Receiver enters PIN to download
7. File gets deleted after:

   * Download limit reached
   * Expiry time exceeded

---

## 🔗 Application Flow

```
Upload → Encrypt → Generate Link → Share → Enter PIN → Download → Auto Delete
```

---

## 🔐 Security Features

* End-to-end encryption using AES-256-GCM
* Secure IV and Auth Tag handling
* Password hashing using bcrypt
* Protected API routes
* File auto-deletion after usage

---

## ⚠️ Error Handling

* Invalid PIN → User alerted
* Expired link → Redirect to 404 page
* Missing file → Safe failure response

---

## 📸 Screenshots (Add Later)

```
Add images like:
frontend/screenshots/upload.png
frontend/screenshots/download.png
```

---

## 🚧 Future Improvements

* 📧 Email-based file sharing
* ☁️ Cloud storage (AWS S3 / Firebase)
* 📊 Download analytics dashboard
* 🔐 User authentication system
* 📱 Fully responsive UI
* 🌐 Deploy on cloud (Render / AWS / Vercel)

---

## 👨‍💻 Author

**Aditya Om**

---

## ⭐ Support

If you like this project, give it a ⭐ on GitHub!
