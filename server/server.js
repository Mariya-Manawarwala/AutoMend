import "dotenv/config";
import express from "express";
import cors from "cors";
import connectDB from "./config/dbConfg.js";
import errorHandler from "./middleware/errorHandler.js";

import authRoutes from "./routes/authRoutes.js";
import profileRoutes from "./routes/profileRoutes.js";
import vehicleRoutes from "./routes/vehicleRoutes.js";
import serviceRoutes from "./routes/serviceRoutes.js";
import partRoutes from "./routes/partRoutes.js";
import requestRoutes from "./routes/requestRoutes.js";
import jobRoutes from "./routes/jobRoutes.js";
import paymentRoutes from "./routes/paymentRoutes.js";
import historyRoutes from "./routes/historyRoutes.js";
import reviewRoutes from "./routes/reviewRoutes.js";
import notificationRoutes from "./routes/notificationRoutes.js";
import dashboardRoutes from "./routes/dashboardRoutes.js";
import chatRoutes from "./routes/chatRoutes.js";
import path from "path";
import { fileURLToPath } from "url";
import userRoutes from "./routes/userRoutes.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

connectDB();

const app = express();
app.use(
  cors({
    origin: true,
    credentials: true,
  }),
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files from the React app build directory
const distPath = path.join(__dirname, "../client/dist");
app.use(express.static(distPath));

app.use("/api/auth", authRoutes);
app.use("/api/profile", profileRoutes);
app.use("/api/users", userRoutes);
app.use("/api/vehicles", vehicleRoutes);
app.use("/api/services", serviceRoutes);
app.use("/api/parts", partRoutes);
app.use("/api/requests", requestRoutes);
app.use("/api/jobs", jobRoutes);
app.use("/api/payments", paymentRoutes);
app.use("/api/history", historyRoutes);
app.use("/api/reviews", reviewRoutes);
app.use("/api/notifications", notificationRoutes);
app.use("/api/admin/dashboard", dashboardRoutes);
app.use("/api/chat", chatRoutes);

app.use("/invoices", express.static(path.join(__dirname, "invoices")));

app.get("/*splat", (req, res, next) => {
  if (req.path.startsWith("/api")) {
    return next();
  }
  res.sendFile(path.join(distPath, "index.html"), (err) => {
    if (err) {
      res.send("AutoMend API is running");
    }
  });
});

app.use(errorHandler);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
