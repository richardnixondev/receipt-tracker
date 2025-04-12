# 🧾 Receipt Tracker — Storage & Expense Analysis System

**Goal:**  
Allow users to upload their **real shopping receipts** (digital or scanned), store them securely, and **analyze their spending** based on the extracted data.

---

## 🔧 Core Features

### 📤 Receipt Upload
- Upload **PDFs or images (JPG/PNG)** or manually input data  
- File storage in **database** or **cloud storage** (e.g., Cloudinary / AWS S3)

### 🧠 Data Extraction (OCR)
- Uses **Optical Character Recognition (OCR)** to extract:
  - 🏪 Store name  
  - 📅 Purchase date  
  - 🛒 Purchased items  
  - 💲 Prices and totals

> Technologies: [Tesseract.js](https://github.com/naptha/tesseract.js) or [OCR.Space API](https://ocr.space/OCRAPI)

### 📊 Financial Dashboard
- Track **spending per store, category, or month**
- **Interactive charts** with React + [Chart.js](https://www.chartjs.org/) or [Recharts](https://recharts.org/)
- Filters by **date range** and **purchase type**

### 👥 User Authentication
- **JWT-based** login & registration system  
- Password hashing with **bcrypt**

### ✍️ Tags & Notes
- Users can assign **custom tags** to receipts:  
  e.g., `food`, `entertainment`, `travel`, etc.

---

## 🚀 Tech Stack — MERN

| Layer         | Tech                                      |
|---------------|-------------------------------------------|
| 🗃️ Database    | **MongoDB** - stores receipts, users, data |
| 🔌 Backend     | **Node.js + Express** - API, OCR, auth    |
| 🎨 Frontend    | **React + Vite** - modern and fast UI     |
| 🔍 OCR         | **Tesseract.js** or **OCR API**           |

---


## 💡 Future Ideas
- 💳 Automatic categorization of spending
- 📦 Receipt itemization
- 📁 Export to PDF/CSV
- 📱 Mobile support with React Native or PWA

---

## 📌 License

MIT — Feel free to use and adapt for your own projects!
