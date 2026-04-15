# 🚗 AutoMend — AI-Powered Garage Management System

AutoMend is a full-stack MERN application designed to streamline vehicle repair services and garage operations. It provides a centralized platform where customers, mechanics, and admin interact seamlessly to manage repair workflows, bookings, and payments.

---

## ✨ Features

### 👤 Customer

- Register & Login
- Add and manage vehicles
- Create repair requests (Home Service / Garage Visit)
- Track repair status in real-time
- View service history
- Chat with AI assistant for support

---

### 🔧 Mechanic

- View assigned repair jobs
- Update job status:
  - `Queued → In Progress → Waiting Parts → Completed`

- Add repair notes and parts used
- Manage daily workload efficiently

---

### 🧑‍💼 Admin

- Manage mechanics (add/update/remove)
- View and approve/decline repair requests
- Assign jobs to mechanics
- Monitor complete workflow
- Manage payments and invoices
- Access dashboard analytics

---

## 🤖 AI Integration

- AI-powered chatbot for:
  - Customer support
  - Basic troubleshooting suggestions
  - Service guidance

---

## 🏗️ Tech Stack

### Frontend

- React.js
- Tailwind CSS
- TanStack Query (State Management)

### Backend

- Node.js
- Express.js
- MongoDB (Mongoose)

### Other Tools

- JWT Authentication
- Cloudinary (File Uploads)
- PDFKit (Invoice Generation)
- OpenAI API (AI Chatbot)

---

## 🔄 Workflow Overview

1. Customer registers and adds vehicle
2. Customer creates repair request
3. Admin reviews and approves request
4. Admin assigns mechanic
5. Mechanic performs repair and updates status
6. System calculates cost
7. Admin manages payment
8. Service history is updated
9. Invoice is generated

---

## 💰 Payment System

- Payment is controlled by admin
- Supports secure online transactions
- Prevents unauthorized handling of payments by mechanics

---

## 📁 Project Structure

```
AutoMend/
│
├── backend/
│   ├── models/
│   ├── controllers/
│   ├── routes/
│   ├── middleware/
│   ├── services/
│   ├── utils/
│   └── server.js
│
├── frontend/
│   ├── components/
│   ├── pages/
│   ├── hooks/
│   ├── services/
│   └── App.jsx
```

---

## 🚀 Getting Started

### 1. Clone the repository

```
git clone https://github.com/your-username/AutoMend.git
cd AutoMend
```

### 2. Install dependencies

#### Backend

```
cd backend
npm install
```

#### Frontend

```
cd frontend
npm install
```

---

### 3. Environment Variables

Create a `.env` file in backend:

```
PORT=5000
MONGO_URI=your_mongodb_uri
JWT_SECRET=your_secret_key

CLOUD_NAME=your_cloudinary_name
CLOUD_KEY=your_cloudinary_key
CLOUD_SECRET=your_cloudinary_secret

OPENAI_API_KEY=your_openai_api_key
```

---

### 4. Run the project

#### Backend

```
npm run dev
```

#### Frontend

```
npm run dev
```

---

## 📊 Future Enhancements

- Emergency service requests 🚨
- Real-time notifications 🔔
- Multi-garage support 🌐
- Mechanic performance analytics 📈
- Advanced AI diagnostics 🤖

---

## 🎯 Project Goal

To build a real-world garage management system that:

- Reduces manual work
- Improves transparency
- Enhances customer experience
- Provides scalable architecture

---

## 📌 Author

Developed by **[Your Name]**
Final Year MERN Stack Project

---

## ⭐ Support

If you like this project, give it a ⭐ on GitHub!
