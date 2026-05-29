import React, { useState, useEffect, useRef } from "react";
import { X, Save, Image, Sparkles, Check, Pin, Bell, CalendarClock } from "lucide-react";
import Loader from "../common/Loader";

const getCurrentLocalDateTimeString = () => {
  const date = new Date();
  const offset = date.getTimezoneOffset();
  const localDate = new Date(date.getTime() - offset * 60 * 1000);
  return localDate.toISOString().slice(0, 16);
};

const NoteModal = ({ isOpen, onClose, onSubmit, note = null }) => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [color, setColor] = useState("default");
  const [pinned, setPinned] = useState(false);
  const [reminder, setReminder] = useState("");
  const [hasReminder, setHasReminder] = useState(false);
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const fileInputRef = useRef(null);

  const isEditMode = !!note;

  const colorOptions = [
    { id: "default", name: "Classic", bg: "bg-slate-800 border-slate-700", ring: "ring-slate-500" },
    { id: "purple", name: "Lavender", bg: "bg-purple-600/30 border-purple-500/50", ring: "ring-purple-500" },
    { id: "emerald", name: "Emerald", bg: "bg-emerald-600/30 border-emerald-500/50", ring: "ring-emerald-500" },
    { id: "rose", name: "Rose", bg: "bg-rose-600/30 border-rose-500/50", ring: "ring-rose-500" },
    { id: "blue", name: "Cosmic", bg: "bg-blue-600/30 border-blue-500/50", ring: "ring-blue-500" },
    { id: "amber", name: "Sunset", bg: "bg-amber-600/30 border-amber-500/50", ring: "ring-amber-500" },
  ];

  // Sync state with open modal / editing note
  useEffect(() => {
    if (isOpen) {
      if (note) {
        setTitle(note.title || "");
        setContent(note.content || "");
        setColor(note.color || "default");
        setPinned(note.pinned || false);
        setImageFile(null);
        setImagePreview(null);

        // Sync reminder safely with timezone offset adjustments
        if (note.reminder) {
          const date = new Date(note.reminder);
          const offset = date.getTimezoneOffset();
          const localDate = new Date(date.getTime() - offset * 60 * 1000);
          setReminder(localDate.toISOString().slice(0, 16));
          setHasReminder(true);
        } else {
          setReminder("");
          setHasReminder(false);
        }
      } else {
        setTitle("");
        setContent("");
        setColor("default");
        setPinned(false);
        setReminder("");
        setHasReminder(false);
        setImageFile(null);
        setImagePreview(null);
      }
      setError("");
    }
  }, [isOpen, note]);

  if (!isOpen) return null;

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (!file.type.startsWith("image/")) {
        setError("Please select an image file.");
        return;
      }
      if (file.size > 5 * 1024 * 1024) {
        setError("Image size should be less than 5MB.");
        return;
      }
      setError("");
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file) {
      if (!file.type.startsWith("image/")) {
        setError("Please select an image file.");
        return;
      }
      if (file.size > 5 * 1024 * 1024) {
        setError("Image size should be less than 5MB.");
        return;
      }
      setError("");
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const removeSelectedImage = () => {
    setImageFile(null);
    setImagePreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Loosened validation: at least one of title or content is required
    if (!title.trim() && !content.trim()) {
      setError("Please enter a Title or a Description. Your note cannot be empty.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      if (isEditMode) {
        // Edit mode (JSON PUT request)
        await onSubmit(note._id, {
          title,
          content,
          color,
          pinned,
          reminder: hasReminder ? reminder : null,
        });
      } else {
        // Create mode (FormData multipart request)
        const formData = new FormData();
        formData.append("title", title);
        formData.append("content", content);
        formData.append("color", color);
        formData.append("pinned", pinned);
        if (hasReminder && reminder) {
          formData.append("reminder", reminder);
        }
        if (imageFile) {
          formData.append("image", imageFile);
        }
        await onSubmit(formData);
      }
      onClose();
    } catch (err) {
      setError(err.response?.data?.message || "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/70 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      {/* Modal Container */}
      <div className="w-full max-w-xl glass-panel rounded-2xl border border-white/10 shadow-2xl relative z-10 overflow-hidden animate-fade-in max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="p-6 border-b border-white/5 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles size={16} className="text-purple-400 animate-pulse" />
            <h3 className="text-xl font-bold text-white tracking-tight">
              {isEditMode ? "Edit Note" : "Create New Note"}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg hover:bg-white/5 text-slate-400 hover:text-white transition-colors cursor-pointer"
          >
            <X size={18} />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-5">
          {error && (
            <div className="p-3.5 rounded-xl border border-rose-500/30 bg-rose-950/20 text-rose-300 text-xs font-semibold">
              {error}
            </div>
          )}

          {/* Title and Pin Toggle Switch in Header row */}
          <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
            {/* Title Input */}
            <div className="space-y-1.5 text-left flex-1 w-full">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                Note Title
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Keep it catchy..."
                className="w-full px-4 py-3 rounded-xl text-sm glass-input font-bold tracking-tight"
              />
            </div>

            {/* Premium Pin Toggle */}
            <div className="flex items-center gap-2.5 pt-2 sm:pt-4">
              <button
                type="button"
                onClick={() => setPinned(!pinned)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-bold border transition-all duration-200 cursor-pointer select-none ${
                  pinned
                    ? "bg-purple-600/15 border-purple-500/30 text-purple-300 shadow-inner shadow-purple-500/10"
                    : "border-white/10 hover:border-white/20 text-slate-400 hover:text-slate-300"
                }`}
              >
                <Pin size={14} className={pinned ? "fill-purple-400" : ""} />
                <span>Pinned</span>
              </button>
            </div>
          </div>

          {/* Color Selector Pills */}
          <div className="space-y-2 text-left">
            <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              Choose Card Theme
            </label>
            <div className="flex flex-wrap gap-2.5">
              {colorOptions.map((opt) => (
                <button
                  key={opt.id}
                  type="button"
                  onClick={() => setColor(opt.id)}
                  title={opt.name}
                  className={`w-10 h-10 rounded-full border cursor-pointer flex items-center justify-center transition-all ${opt.bg} ${
                    color === opt.id
                      ? `ring-4 ring-offset-4 ring-offset-[#0b0f19] ${opt.ring} scale-105 border-white/40`
                      : "hover:scale-105 border-white/10"
                  }`}
                >
                  {color === opt.id && <Check size={16} className="text-white drop-shadow" />}
                </button>
              ))}
            </div>
          </div>

          {/* Note Reminder Alarm Toggle & Input */}
          <div className="space-y-3 text-left">
            <div className="flex items-center justify-between p-3.5 rounded-xl border border-white/5 bg-white/[0.01]">
              <div className="flex items-center gap-2.5">
                <Bell size={16} className={`transition-colors ${hasReminder ? "text-amber-400 fill-amber-400/20" : "text-slate-400"}`} />
                <div className="space-y-0.5">
                  <span className="text-xs font-bold text-slate-200 uppercase tracking-wider block">Set Reminder Alarm</span>
                  <span className="text-[10px] text-slate-500 font-semibold block">Schedule a visual & sound chime notification</span>
                </div>
              </div>

              {/* Premium Slider Switch Toggle */}
              <button
                type="button"
                onClick={() => {
                  const newHasReminder = !hasReminder;
                  setHasReminder(newHasReminder);
                  if (newHasReminder) {
                    setReminder(getCurrentLocalDateTimeString());
                  } else {
                    setReminder("");
                  }
                }}
                className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                  hasReminder ? "bg-purple-600" : "bg-slate-700"
                }`}
              >
                <span
                  className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                    hasReminder ? "translate-x-5" : "translate-x-0"
                  }`}
                />
              </button>
            </div>

            {/* Date Time Picker displayed only when toggle is enabled */}
            {hasReminder && (
              <div className="relative animate-fade-in pl-1">
                <input
                  type="datetime-local"
                  value={reminder}
                  onChange={(e) => setReminder(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl text-sm glass-input font-bold tracking-tight"
                  required
                />
              </div>
            )}
          </div>

          {/* Description input */}
          <div className="space-y-1.5 text-left">
            <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              Description
            </label>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Pen your thoughts here..."
              rows={5}
              className="w-full px-4 py-3 rounded-xl text-sm glass-input font-medium leading-relaxed resize-none"
            />
          </div>

          {/* Image Upload (Create Mode Only) */}
          {!isEditMode && (
            <div className="space-y-2 text-left">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                Attach Image (Optional)
              </label>

              {imagePreview ? (
                <div className="relative rounded-xl overflow-hidden border border-white/15 bg-slate-950/60 p-2">
                  <img
                    src={imagePreview}
                    alt="Preview"
                    className="w-full max-h-52 object-contain rounded-lg"
                  />
                  <button
                    type="button"
                    onClick={removeSelectedImage}
                    className="absolute top-4 right-4 p-1.5 bg-black/70 hover:bg-black text-white hover:text-rose-400 border border-white/5 rounded-full shadow-lg transition-colors cursor-pointer"
                  >
                    <X size={14} />
                  </button>
                </div>
              ) : (
                <div
                  onDragOver={handleDragOver}
                  onDrop={handleDrop}
                  onClick={() => fileInputRef.current?.click()}
                  className="border-2 border-dashed border-white/10 hover:border-purple-500/40 bg-white/[0.01] hover:bg-purple-600/[0.02] rounded-xl p-6 flex flex-col items-center justify-center gap-2 cursor-pointer transition-all group"
                >
                  <div className="p-3 bg-white/[0.03] group-hover:bg-purple-500/10 rounded-xl border border-white/5 group-hover:border-purple-500/20 text-slate-400 group-hover:text-purple-300 transition-all">
                    <Image size={22} />
                  </div>
                  <span className="text-sm font-semibold text-slate-300">
                    Drag & drop or <span className="text-purple-400 group-hover:underline">browse</span>
                  </span>
                  <span className="text-xs text-slate-500 font-medium">
                    Supports PNG, JPG, GIF up to 5MB
                  </span>
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleImageChange}
                    accept="image/*"
                    className="hidden"
                  />
                </div>
              )}
            </div>
          )}

          {/* Actions */}
          <div className="pt-4 border-t border-white/5 flex items-center justify-end gap-3 mt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl border border-white/10 hover:bg-white/5 text-slate-300 hover:text-white text-sm font-bold transition-all cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex items-center justify-center gap-2 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 text-white py-2.5 px-5 rounded-xl text-sm font-bold shadow-md shadow-purple-900/20 transition-all duration-200 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <Loader size="sm" className="text-white" />
              ) : (
                <>
                  <Save size={16} />
                  {isEditMode ? "Save Changes" : "Save Note"}
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default NoteModal;
