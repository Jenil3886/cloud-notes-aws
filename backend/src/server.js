import "dotenv/config";
import express from "express";
import cors from "cors";

import connectDB from "./config/db.js";

// routes
import noteRoutes from "./routes/noteRoutes.js";
import authRoutes from "./routes/authRoutes.js";

connectDB();

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/v1/notes", noteRoutes);
app.use("/api/v1/auth", authRoutes);

app.get("/api/v1", (_, res) => {
  res.send("Cloud Notes App Running");
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
