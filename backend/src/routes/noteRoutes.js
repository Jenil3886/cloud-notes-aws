import express from "express";
import upload from "../middleware/uploadMiddleware.js";
import {
  createNote,
  getNotes,
  deleteNote,
  updateNote,
} from "../controllers/noteController.js";
import protect from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/", protect, upload.single("image"), createNote);

router.get("/", protect, getNotes);

router.delete("/:id", protect, deleteNote);

router.put("/:id", protect, updateNote);

export default router;
