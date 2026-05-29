import React, { useMemo } from "react";
import { X, Calendar, Bell, ExternalLink, Play, Edit3, Pin } from "lucide-react";

const NoteDetailModal = ({ isOpen, onClose, note, onEditClick, onTogglePin }) => {
  if (!isOpen || !note) return null;

  const formatDate = (dateString) => {
    if (!dateString) return "";
    const options = {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    };
    return new Date(dateString).toLocaleDateString("en-US", options);
  };

  const formatReminder = (dateString) => {
    if (!dateString) return "";
    const options = {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    };
    return new Date(dateString).toLocaleDateString("en-US", options);
  };

  // Scan content for YouTube link
  const youtubeLink = useMemo(() => {
    if (!note.content) return null;
    const regex = /(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/watch\?v=|youtu\.be\/)([a-zA-Z0-9_-]{11})/i;
    const match = note.content.match(regex);
    return match ? match[0] : null;
  }, [note.content]);

  const theme = note.color || "default";

  const themeClasses = {
    default: {
      border: "border-white/10",
      accent: "text-purple-400 bg-purple-500/10 border-purple-500/20",
      header: "bg-slate-900/80 border-white/5",
    },
    purple: {
      border: "border-purple-500/25",
      accent: "text-purple-300 bg-purple-500/20 border-purple-500/30",
      header: "bg-purple-950/40 border-purple-500/20",
    },
    emerald: {
      border: "border-emerald-500/25",
      accent: "text-emerald-300 bg-emerald-500/20 border-emerald-500/30",
      header: "bg-emerald-950/40 border-emerald-500/20",
    },
    rose: {
      border: "border-rose-500/25",
      accent: "text-rose-300 bg-rose-500/20 border-rose-500/30",
      header: "bg-rose-950/40 border-rose-500/20",
    },
    blue: {
      border: "border-blue-500/25",
      accent: "text-blue-300 bg-blue-500/20 border-blue-500/30",
      header: "bg-blue-950/40 border-blue-500/20",
    },
    amber: {
      border: "border-amber-500/25",
      accent: "text-amber-300 bg-amber-500/20 border-amber-500/30",
      header: "bg-amber-950/40 border-amber-500/20",
    },
  };

  const style = themeClasses[theme] || themeClasses.default;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/80 backdrop-blur-md transition-opacity"
        onClick={onClose}
      />

      {/* Modal Container */}
      <div
        className={`w-full max-w-2xl glass-panel rounded-3xl border ${style.border} shadow-2xl relative z-10 overflow-hidden animate-fade-in max-h-[90vh] flex flex-col`}
      >
        {/* Dynamic Themed Banner */}
        <div className={`p-5 ${style.header} border-b flex items-center justify-between`}>
          <div className="flex items-center gap-3">
            <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold border uppercase tracking-wider ${style.accent}`}>
              {theme} theme
            </span>
            {note.pinned && (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-purple-500/15 border border-purple-500/20 text-purple-300">
                <Pin size={12} className="fill-purple-400" /> Pinned
              </span>
            )}
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => onTogglePin(note._id, note.pinned)}
              className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white transition-all cursor-pointer"
              title={note.pinned ? "Unpin Note" : "Pin Note"}
            >
              <Pin size={16} className={note.pinned ? "fill-purple-400 text-purple-400" : ""} />
            </button>
            <button
              onClick={() => {
                onEditClick(note);
                onClose();
              }}
              className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white transition-all cursor-pointer"
              title="Edit Note"
            >
              <Edit3 size={16} />
            </button>
            <button
              onClick={onClose}
              className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 hover:text-rose-400 transition-all cursor-pointer"
              title="Close"
            >
              <X size={16} />
            </button>
          </div>
        </div>

        {/* Scrollable Content Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Note Image (Optional) */}
          {note.image && (
            <div className="w-full rounded-2xl overflow-hidden border border-white/5 bg-slate-950/40">
              <img
                src={note.image}
                alt={note.title || "Note attachment"}
                className="w-full max-h-80 object-contain mx-auto"
              />
            </div>
          )}

          {/* Typography area */}
          <div className="space-y-4 text-left">
            {note.title && (
              <h2 className="text-3xl font-extrabold text-white tracking-tight leading-snug">
                {note.title}
              </h2>
            )}

            {/* Created & Reminder Badges */}
            <div className="flex flex-wrap gap-4 pt-1 pb-3 border-b border-white/5 text-xs font-semibold text-slate-500">
              <span className="flex items-center gap-1.5">
                <Calendar size={14} /> Created on {formatDate(note.createdAt)}
              </span>

              {note.reminder && (
                <span className="flex items-center gap-1.5 text-amber-400 bg-amber-400/10 border border-amber-400/25 px-2.5 py-1 rounded-lg">
                  <Bell size={13} className="animate-swing" /> Reminder: {formatReminder(note.reminder)}
                </span>
              )}
            </div>

            {/* Main Description */}
            <div className="text-slate-300 text-base leading-relaxed whitespace-pre-wrap font-medium pt-2">
              {note.content || <em className="text-slate-500 font-normal">No description provided.</em>}
            </div>
          </div>

          {/* YouTube Video Link Promo Block */}
          {youtubeLink && (
            <div className="p-5 rounded-2xl border border-rose-500/20 bg-rose-950/10 flex flex-col sm:flex-row items-center sm:justify-between gap-4 text-left">
              <div className="space-y-1">
                <div className="flex items-center gap-2 text-rose-400 font-bold text-sm">
                  <Play size={16} className="fill-rose-500 text-rose-500" />
                  <span>YouTube Video Link Detected</span>
                </div>
                <p className="text-slate-400 text-xs leading-relaxed font-semibold">
                  A playable video link was found inside your note details. Redirect to YouTube to watch the stream.
                </p>
              </div>

              <a
                href={youtubeLink}
                target="_blank"
                rel="noopener noreferrer"
                className="shrink-0 flex items-center gap-2 px-5 py-3 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-extrabold text-sm shadow-lg shadow-rose-900/30 hover:shadow-rose-900/40 transition-all cursor-pointer"
              >
                Watch Video <ExternalLink size={14} />
              </a>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-white/5 bg-[#0b0f19]/40 flex justify-end">
          <button
            onClick={onClose}
            className="px-6 py-2.5 rounded-xl border border-white/10 hover:bg-white/5 text-slate-300 hover:text-white text-sm font-bold transition-all cursor-pointer"
          >
            Close Viewer
          </button>
        </div>
      </div>
    </div>
  );
};

export default NoteDetailModal;
