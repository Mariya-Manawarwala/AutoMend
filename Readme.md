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

## � API Reference

### Authentication

- All protected endpoints require `Authorization: Bearer <token>`.
- Login and registration do not require a token.- **Mechanic verification**: Mechanics must be approved by their admin before accessing operational endpoints (accepting requests, managing jobs).
  - Unapproved mechanics receive error: "Your account is not approved yet"

### Mechanic Account Status

- `pending`: Initial status after registration. Cannot access operational APIs.
- `approved`: Admin-approved. Full access to mechanic APIs.
- `rejected`: Admin rejected. Cannot access operational APIs.

### Request creation and location rules

- `POST /api/requests` — create a new repair request.
- `Content-Type`: `multipart/form-data` when uploading `vehicleImage`, otherwise `application/json`.
- Required fields:
  - `vehicle`: object or JSON string containing `brand` and `model`
  - `description`: string
  - `serviceIds`: array of service IDs
  - `serviceType`: `home`, `garage`, or `current`
  - `scheduledDate`: ISO timestamp string
- Optional fields:
  - `vehicleImage`: image file upload
  - `priority`: string
  - `location`: object or JSON string with `address`, `lat`, `lng`

#### Location handling

- `home`: backend uses `user.address` if present; otherwise the request must include `location` with `address`, `lat`, and `lng`.
- `garage`: backend ignores incoming location and uses the admin's `garageLocation` from their profile.
- `current`: backend requires `location` with `address`, `lat`, and `lng`.

### API endpoints

#### Auth

- `POST /api/auth/register`
  - Body: `name`, `email`, `phone`, `password`, `role` (`customer` or `mechanic`), `adminId` for mechanics
- `POST /api/auth/login`
  - Body: `email` or `phone`, `password`

#### Profile

- `GET /api/profile/me`
  - Auth: Bearer token
- `PUT /api/profile/update`
  - Auth: Bearer token
  - Body: `fullName`, `address`, `phone`, `emailId`, `dateOfBirth`, `skills` (mechanic-only), `profilePhoto` (file upload)
- `DELETE /api/profile/delete`
  - Auth: Bearer token

#### Users (Admin)

- `GET /api/users`
  - Auth: Bearer token + admin
- `GET /api/users/:id`
  - Auth: Bearer token + admin

#### Vehicles

- `POST /api/vehicles`
  - Auth: Bearer token + customer
  - Body: `brand`, `model`, `numberPlate`, `fuelType`, `yearBought`
- `GET /api/vehicles/my`
  - Auth: Bearer token + customer
- `GET /api/vehicles/:id`
  - Auth: Bearer token
- `PUT /api/vehicles/:id`
  - Auth: Bearer token + customer
  - Body: `brand`, `model`, `numberPlate`, `fuelType`, `yearBought`
- `DELETE /api/vehicles/:id`
  - Auth: Bearer token + customer

#### Services

- `POST /api/services`
  - Auth: Bearer token + admin
  - Body: `name`, `basePrice`, `category`, `description`
- `GET /api/services`
  - Public
- `PUT /api/services/:id`
  - Auth: Bearer token + admin
  - Body: `name`, `basePrice`, `category`, `description`, `isActive`
- `DELETE /api/services/:id`
  - Auth: Bearer token + admin

#### Parts

- `POST /api/parts`
  - Auth: Bearer token + admin
  - Body: `name`, `unitPrice`, `category`, `unit`, `stock`, `minStock`, `supplier`
- `GET /api/parts`
  - Public
- `PUT /api/parts/:id`
  - Auth: Bearer token + admin
  - Body: `name`, `unitPrice`, `category`, `unit`, `stock`, `minStock`, `supplier`, `isActive`
- `DELETE /api/parts/:id`
  - Auth: Bearer token + admin

#### Requests

- `POST /api/requests`
  - Auth: Bearer token + customer
  - Body: `vehicle`, `description`, `serviceIds`, `serviceType`, `scheduledDate`, `priority` (optional), `location` (depending on serviceType)
- `GET /api/requests`
  - Auth: Bearer token
  - Query: `status`, `role`
- `POST /api/requests/:id/accept`
  - Auth: Bearer token + approved mechanic
- `GET /api/requests/:id`
  - Auth: Bearer token

#### Jobs

- `GET /api/jobs/admin/all`
  - Auth: Bearer token + admin
- `GET /api/jobs/:requestId`
  - Auth: Bearer token + approved mechanic
- `PATCH /api/jobs/:id`
  - Auth: Bearer token + approved mechanic
  - Body: `servicesUsed`, `partsUsed`
- `PUT /api/jobs/:id/submit-bill`
  - Auth: Bearer token + approved mechanic
  - **Workflow:**
    1. Validates job status is `InProgress` and bill not already submitted
    2. Calculates final costs (services + parts - discount)
    3. Creates `Payment` record with status `Pending`
    4. Generates PDF invoice (saved in `server/invoices/`)
    5. Sends invoice email to customer with PDF attachment
    6. Creates in-app notification for customer
    7. Updates job status to `PaymentPending`
    8. Updates repair request status to `Completed`
  - **Response:** `{ success: true, job, payment, message }`
  - **Email:** Uses nodemailer (requires `EMAIL_USER` and `EMAIL_PASSWORD` in .env)
- `POST /api/jobs/:id/apply-coupon`
  - Auth: Bearer token + customer
  - Body: `code`

#### Payments

- `POST /api/payments/create-order`
  - Auth: Bearer token + customer
  - Body: `jobId`, `note`
- `POST /api/payments/verify`
  - Auth: Bearer token
  - Body: `orderId`, `paymentId`
- `GET /api/payments/admin/all`
  - Auth: Bearer token + admin
- `GET /api/payments/mechanic`
  - Auth: Bearer token + approved mechanic
  - **Query:** `month` (1-12), `year` (optional - defaults to current year)
  - **Response:** `{ success: true, totalEarnings, count, earnings: [...] }`
  - **Earnings Filter:** Only completed jobs with completed payments
  - **Example:** `/api/payments/mechanic?month=4&year=2026`

#### Coupons

- `POST /api/coupons`
  - Auth: Bearer token + admin
  - Body: `code`, `discountType`, `discountValue`, `minOrderValue`, `maxDiscountCap`, `usageLimit`, `expiresAt`
- `GET /api/coupons`
  - Auth: Bearer token + admin
- `PUT /api/coupons/:id`
  - Auth: Bearer token + admin
  - Body: `code`, `discountType`, `discountValue`, `minOrderValue`, `maxDiscountCap`, `usageLimit`, `expiresAt`, `isActive`

#### History

- `GET /api/history`
  - Auth: Bearer token

#### Reviews

- `POST /api/reviews`
  - Auth: Bearer token + customer
  - Body: `jobId`, `garageRating`, `garageComment`, `mechanicRating`, `mechanicComment`
- `GET /api/reviews/garage`
  - Public
- `GET /api/reviews/mechanic/:mechanicId`
  - Public
- `GET /api/reviews/admin`
  - Auth: Bearer token + admin

#### Notifications

- `GET /api/notifications/my`
  - Auth: Bearer token
- `PATCH /api/notifications/:id`
  - Auth: Bearer token

#### Dashboard

- `GET /api/admin/dashboard`
  - Auth: Bearer token + admin
- `PUT /api/admin/dashboard/garage-details`
  - Auth: Bearer token + admin
  - Body: `garageLocation: { address, lat, lng }`
- `GET /api/admin/dashboard/mechanics`
  - Auth: Bearer token + admin
- `GET /api/admin/dashboard/mechanics/pending`
  - Auth: Bearer token + admin
  - Returns: Array of pending mechanics with `_id`, `name`, `email`, `phone`, `skills`, `status`
- `PUT /api/admin/dashboard/mechanics/:id/approve`
  - Auth: Bearer token + admin
  - Sets mechanic `status = "approved"`, `isVerified = true`
  - Sends notification: "Your account has been approved"
- `PUT /api/admin/dashboard/mechanics/:id/reject`
  - Auth: Bearer token + admin
  - Sets mechanic `status = "rejected"`
  - Sends notification: "Your account was rejected"

#### Chat

- `POST /api/chat`
  - Auth: Bearer token
  - Body: `message`

---

## �📁 Project Structure

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

# Email Configuration (for invoice delivery)
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=your-app-specific-password
```

**Note:** For Gmail, generate an [App Password](https://myaccount.google.com/apppasswords) instead of using your regular password.

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
