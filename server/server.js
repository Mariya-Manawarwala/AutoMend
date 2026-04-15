import express from "express";
import dotenv from "dotenv";
import colors from "colors";
import connectDB from "./config/dbConfig.js";
dotenv.config();
// DB CONNECION
connectDB();
const PORT = process.env.PORT || 5000;
const app = express();
//default routes
app.get("/", (req, res) => {
  res.json({
    message: "Welcome to AutoMend API",
  });
});
app.listen(PORT, () =>
  console.log(`Server is running on port ${PORT}`.bgBlue.white),
);
