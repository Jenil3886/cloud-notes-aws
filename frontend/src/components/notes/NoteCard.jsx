import React, { useMemo } from "react";
import { Edit2, Trash2, Calendar, Pin, Bell, Play } from "lucide-react";

const NoteCard = ({ note, onEdit, onDelete, onTogglePin, onClick }) => {
  const formatDate = (dateString) => {
    if (!dateString) return "";
    const options = { year: "numeric", month: "short", day: "numeric" };
    return new Date(dateString).toLocaleDateString("en-US", options);
  };

  const formatReminder = (dateString) => {
    if (!dateString) return "";
    const options = { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" };
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

  // Gorgeous color theme profiles for high aesthetics
  const themeClasses = {
    default: {
      border: "border-white/5 group-hover:border-purple-500/30",
      bg: "bg-slate-900/60",
      glow: "group-hover:shadow-[0_10px_30px_-10px_rgba(139,92,246,0.15)]",
      title: "group-hover:text-purple-300",
      pin: "text-slate-500 hover:text-purple-400",
      badge: "border-white/5 text-purple-300 bg-black/40",
    },
    purple: {
      border: "border-purple-500/20 group-hover:border-purple-500/40",
      bg: "bg-purple-950/10 backdrop-blur-md",
      glow: "shadow-[0_10px_20px_-10px_rgba(168,85,247,0.1)] group-hover:shadow-[0_10px_30px_-10px_rgba(168,85,247,0.25)]",
      title: "text-purple-200 group-hover:text-purple-300",
      pin: "text-purple-400 hover:text-purple-300",
      badge: "border-purple-500/30 text-purple-300 bg-purple-950/50",
    },
    emerald: {
      border: "border-emerald-500/20 group-hover:border-emerald-500/40",
      bg: "bg-emerald-950/10 backdrop-blur-md",
      glow: "shadow-[0_10px_20px_-10px_rgba(16,185,129,0.1)] group-hover:shadow-[0_10px_30px_-10px_rgba(16,185,129,0.25)]",
      title: "text-emerald-200 group-hover:text-emerald-300",
      pin: "text-emerald-400 hover:text-emerald-300",
      badge: "border-emerald-500/30 text-emerald-300 bg-emerald-950/50",
    },
    rose: {
      border: "border-rose-500/20 group-hover:border-rose-500/40",
      bg: "bg-rose-950/10 backdrop-blur-md",
      glow: "shadow-[0_10px_20px_-10px_rgba(244,63,94,0.1)] group-hover:shadow-[0_10px_30px_-10px_rgba(244,63,94,0.25)]",
      title: "text-rose-200 group-hover:text-rose-300",
      pin: "text-rose-400 hover:text-rose-300",
      badge: "border-rose-500/30 text-rose-300 bg-rose-950/50",
    },
    blue: {
      border: "border-blue-500/20 group-hover:border-blue-500/40",
      bg: "bg-blue-950/10 backdrop-blur-md",
      glow: "shadow-[0_10px_20px_-10px_rgba(59,130,246,0.1)] group-hover:shadow-[0_10px_30px_-10px_rgba(59,130,246,0.25)]",
      title: "text-blue-200 group-hover:text-blue-300",
      pin: "text-blue-400 hover:text-blue-300",
      badge: "border-blue-500/30 text-blue-300 bg-blue-950/50",
    },
    amber: {
      border: "border-amber-500/20 group-hover:border-amber-500/40",
      bg: "bg-amber-950/10 backdrop-blur-md",
      glow: "shadow-[0_10px_20px_-10px_rgba(245,158,11,0.1)] group-hover:shadow-[0_10px_30px_-10px_rgba(245,158,11,0.25)]",
      title: "text-amber-200 group-hover:text-amber-300",
      pin: "text-amber-400 hover:text-amber-300",
      badge: "border-amber-500/30 text-amber-300 bg-amber-950/50",
    },
  };

  const style = themeClasses[theme] || themeClasses.default;

  return (
    <div
      onClick={() => onClick(note)}
      className={`backdrop-blur-md rounded-2xl overflow-hidden flex flex-col h-full border ${style.border} ${style.bg} ${style.glow} transition-all duration-300 relative group cursor-pointer`}
    >
      {/* Note Image (Optional) */}
      {note.image && (
        <div className="h-44 w-full overflow-hidden relative border-b border-white/5 bg-slate-950">
          <img
            src={note.image}
            alt={note.title || "Note Attachment"}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            loading="lazy"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/40 to-transparent pointer-events-none" />
          
          <span className={`absolute top-3 left-3 border text-[10px] uppercase font-bold tracking-wider px-2.5 py-1 rounded-full ${style.badge}`}>
            Cloud Media
          </span>
        </div>
      )}

      {/* Card Content Area */}
      <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
        <div className="space-y-2.5">
          {/* Title Header with Pin Action */}
          <div className="flex items-start justify-between gap-4">
            <h4 className={`text-lg font-bold text-white tracking-tight leading-snug truncate ${style.title} transition-colors flex-1`}>
              {note.title || <em className="text-slate-500 font-normal">Untitled Note</em>}
            </h4>

            {/* Quick Pin Toggle Button */}
            <button
              onClick={(e) => {
                e.stopPropagation(); // Prevent opening lightbox
                onTogglePin(note._id, note.pinned);
              }}
              title={note.pinned ? "Unpin Note" : "Pin Note"}
              className={`shrink-0 p-1.5 rounded-lg hover:bg-white/5 transition-all duration-200 cursor-pointer ${
                note.pinned
                  ? "text-purple-400 fill-purple-400"
                  : `${style.pin} hover:rotate-12`
              }`}
            >
              <Pin size={15} />
            </button>
          </div>

          {/* Description Body */}
          {note.content && (
            <p className="text-slate-400 text-sm leading-relaxed whitespace-pre-wrap line-clamp-4">
              {note.content}
            </p>
          )}

          {/* Reminder indicator pill */}
          {note.reminder && (
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg border border-amber-500/20 bg-amber-500/10 text-amber-300 text-[10px] font-bold tracking-wide">
              <Bell size={11} className="animate-pulse" />
              <span>Reminder: {formatReminder(note.reminder)}</span>
            </div>
          )}

          {/* YouTube redirect button */}
          {youtubeLink && (
            <div className="pt-1">
              <a
                href={youtubeLink}
                target="_blank"
                rel="noopener noreferrer"
                onClick={(e) => e.stopPropagation()} // Prevent opening lightbox
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-rose-500/30 bg-rose-500/10 text-rose-300 hover:bg-rose-500 text-rose-300 hover:text-white text-xs font-extrabold transition-all duration-200 shadow-sm"
              >
                <Play size={10} className="fill-rose-400 text-rose-400 group-hover:text-white" />
                Play on YouTube
              </a>
            </div>
          )}
        </div>

        {/* Card Footer */}
        <div className="flex items-center justify-between pt-4 border-t border-white/5 mt-auto">
          {/* Created Date */}
          <div className="flex items-center gap-1.5 text-xs text-slate-500 font-semibold">
            <Calendar size={13} />
            <span>{formatDate(note.createdAt)}</span>
          </div>

          {/* Edit / Delete Buttons */}
          <div className="flex items-center gap-1 opacity-80 md:opacity-0 group-hover:opacity-100 transition-opacity duration-200">
            <button
              onClick={(e) => {
                e.stopPropagation();
                onEdit(note);
              }}
              title="Edit Note"
              className="p-2 rounded-lg bg-white/[0.02] border border-white/5 hover:bg-purple-600/10 hover:text-purple-300 text-slate-400 transition-all cursor-pointer"
            >
              <Edit2 size={13} />
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                onDelete(note._id);
              }}
              title="Delete Note"
              className="p-2 rounded-lg bg-white/[0.02] border border-white/5 hover:bg-rose-600/10 hover:text-rose-400 text-slate-400 transition-all cursor-pointer"
            >
              <Trash2 size={13} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NoteCard;
