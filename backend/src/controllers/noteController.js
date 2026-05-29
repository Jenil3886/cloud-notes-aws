import Note from "../models/noteModel.js";
import { PutObjectCommand } from "@aws-sdk/client-s3";

import { v4 as uuidv4 } from "uuid";

import s3 from "../config/s3.js";

export const createNote = async (req, res) => {
  try {
    const { title, content, pinned, color, reminder } = req.body;

    if (!title && !content) {
      return res.status(400).json({
        message: "Either title or content is required",
      });
    }

    let imageUrl = "";

    if (req.file) {
      const fileName = `${uuidv4()}-${req.file.originalname}`;

      const params = {
        Bucket: process.env.AWS_BUCKET_NAME,
        Key: fileName,
        Body: req.file.buffer,
        ContentType: req.file.mimetype,
      };

      await s3.send(new PutObjectCommand(params));

      imageUrl = `https://${process.env.AWS_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${fileName}`;
    }
    const note = await Note.create({
      title,
      content,
      image: imageUrl,
      user: req.user._id,
      pinned: pinned === "true" || pinned === true,
      color: color || "default",
      reminder: reminder || null,
    });

    res.status(201).json(note);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

export const getNotes = async (req, res) => {
  try {
    const notes = await Note.find({
      user: req.user._id,
    }).sort({ createdAt: -1 });

    res.status(200).json(notes);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

export const deleteNote = async (req, res) => {
  try {
    const note = await Note.findById(req.params.id);

    if (!note) {
      return res.status(404).json({
        message: "Note not found",
      });
    }

    await note.deleteOne();

    res.status(200).json({
      message: "Note deleted",
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

export const updateNote = async (req, res) => {
  try {
    const { title, content, pinned, color, reminder } = req.body;

    const note = await Note.findById(req.params.id);

    if (!note) {
      return res.status(404).json({
        message: "Note not found",
      });
    }

    note.title = title !== undefined ? title : note.title;
    note.content = content !== undefined ? content : note.content;
    note.pinned = pinned !== undefined ? pinned : note.pinned;
    note.color = color !== undefined ? color : note.color;
    note.reminder = reminder !== undefined ? reminder : note.reminder;

    // Validate that the updated note won't end up empty
    if (!note.title && !note.content) {
      return res.status(400).json({
        message: "Either title or content is required",
      });
    }

    const updatedNote = await note.save();

    res.status(200).json(updatedNote);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};
