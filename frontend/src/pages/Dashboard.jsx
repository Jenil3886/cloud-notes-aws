=import React, { useState, useEffect, useMemo } from "react";
import * as noteService from "../services/noteService";
import { useToast } from "../context/ToastContext";
import useAuth from "../hooks/useAuth";
import NoteCard from "../components/notes/NoteCard";
import NoteModal from "../components/notes/NoteModal";
import NoteDetailModal from "../components/notes/NoteDetailModal";
import EmptyState from "../components/notes/EmptyState";
import Loader from "../components/common/Loader";
import { Plus, Search, Sparkles, Pin, BookOpen } from "lucide-react";

const Dashboard = () => {
  const { user } = useAuth();
  const { showToast } = useToast();
  
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingNote, setEditingNote] = useState(null);
  const [detailedNote, setDetailedNote] = useState(null);
  const [triggeredReminders, setTriggeredReminders] = useState([]);

  // Fetch Notes on Component Mount
  const fetchNotes = async () => {
    try {
      setLoading(true);
      const data = await noteService.getNotes();
      setNotes(data);
    } catch (err) {
      showToast(err.response?.data?.message || "Failed to load notes.", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotes();
  }, []);

  // Request browser permission for native desktop notifications
  useEffect(() => {
    if ("Notification" in window && Notification.permission === "default") {
      Notification.requestPermission();
    }
  }, []);

  // Synthesize a beautiful digital chime audio dynamically without external files
  const playNotificationSound = () => {
    try {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();
      
      const playTone = (freq, time, duration) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = "sine";
        osc.frequency.setValueAtTime(freq, time);
        gain.gain.setValueAtTime(0.04, time);
        gain.gain.exponentialRampToValueAtTime(0.001, time + duration);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(time);
        osc.stop(time + duration);
      };
      
      const now = ctx.currentTime;
      playTone(523.25, now, 0.25);       // C5
      playTone(659.25, now + 0.12, 0.35); // E5
    } catch (e) {
      console.warn("Sound playing blocked or not supported by browser autoplay policies.");
    }
  };

  // Periodic Reminder Alert Checker
  useEffect(() => {
    if (notes.length === 0) return;

    const checkReminders = () => {
      const now = new Date();
      notes.forEach((note) => {
        if (note.reminder) {
          const reminderDate = new Date(note.reminder);
          
          // Trigger reminder if time has arrived and hasn't triggered in this session yet
          if (reminderDate <= now && !triggeredReminders.includes(note._id)) {
            // Register as triggered instantly
            setTriggeredReminders((prev) => [...prev, note._id]);

            // Synthesize notification sound
            playNotificationSound();

            // Display floating warning toast
            showToast(`⏰ Note Reminder: "${note.title || "Untitled Note"}" has arrived!`, "warning", 8000);

            // Display OS native desktop alert if allowed
            if ("Notification" in window && Notification.permission === "granted") {
              try {
                new Notification("⏰ CloudNotes Reminder", {
                  body: note.title 
                    ? `Your reminder for "${note.title}" has arrived!`
                    : `Your note reminder has arrived!`,
                  tag: note._id,
                  requireInteraction: true,
                });
              } catch (e) {
                console.error("OS native notification trigger failed", e);
              }
            }
          }
        }
      });
    };

    const checkerInterval = setInterval(checkReminders, 5000); // Check every 5s
    return () => clearInterval(checkerInterval);
  }, [notes, triggeredReminders, showToast]);

  // Filter Notes based on Search Query
  const filteredNotes = useMemo(() => {
    return notes.filter(
      (note) =>
        (note.title && note.title.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (note.content && note.content.toLowerCase().includes(searchQuery.toLowerCase()))
    );
  }, [notes, searchQuery]);

  // Separate pinned and unpinned notes
  const pinnedNotes = useMemo(() => filteredNotes.filter((n) => n.pinned), [filteredNotes]);
  const unpinnedNotes = useMemo(() => filteredNotes.filter((n) => !n.pinned), [filteredNotes]);

  const handleCreateNote = async (formData) => {
    try {
      const newNote = await noteService.createNote(formData);
      setNotes((prev) => [newNote, ...prev]);
      showToast("Note created successfully!", "success");
    } catch (err) {
      showToast(err.response?.data?.message || "Failed to create note.", "error");
      throw err;
    }
  };

  const handleUpdateNote = async (id, updatedFields) => {
    try {
      const updatedNote = await noteService.updateNote(id, updatedFields);
      
      // Update local notes array
      setNotes((prev) =>
        prev.map((n) => (n._id === id ? { ...n, ...updatedNote } : n))
      );

      // Sync active read-only detail lightbox if open
      setDetailedNote((prev) => (prev && prev._id === id ? { ...prev, ...updatedNote } : prev));

      // Remove from triggered list if reminder changed to future
      if (updatedNote.reminder && new Date(updatedNote.reminder) > new Date()) {
        setTriggeredReminders((prev) => prev.filter((rid) => rid !== id));
      }

      showToast("Note updated successfully!", "success");
    } catch (err) {
      showToast(err.response?.data?.message || "Failed to update note.", "error");
      throw err;
    }
  };

  const handleTogglePin = async (id, currentPinned) => {
    try {
      // Optimistic update for fluid UI transitions
      setNotes((prev) =>
        prev.map((n) => (n._id === id ? { ...n, pinned: !currentPinned } : n))
      );
      setDetailedNote((prev) => (prev && prev._id === id ? { ...prev, pinned: !currentPinned } : prev));

      const updatedNote = await noteService.updateNote(id, { pinned: !currentPinned });
      
      // Update with exact server payload
      setNotes((prev) =>
        prev.map((n) => (n._id === id ? { ...n, ...updatedNote } : n))
      );
      setDetailedNote((prev) => (prev && prev._id === id ? { ...prev, ...updatedNote } : prev));

      showToast(
        !currentPinned ? "Note pinned to top!" : "Note unpinned.",
        "success"
      );
    } catch (err) {
      // Revert optimistic state upon failure
      setNotes((prev) =>
        prev.map((n) => (n._id === id ? { ...n, pinned: currentPinned } : n))
      );
      setDetailedNote((prev) => (prev && prev._id === id ? { ...prev, pinned: currentPinned } : prev));
      showToast(err.response?.data?.message || "Failed to pin note.", "error");
    }
  };

  const handleDeleteNote = async (id) => {
    if (!window.confirm("Are you sure you want to delete this note?")) return;

    try {
      await noteService.deleteNote(id);
      setNotes((prev) => prev.filter((n) => n._id !== id));
      
      // Close lightbox detail modal if the deleted note was being read
      if (detailedNote && detailedNote._id === id) {
        setDetailedNote(null);
      }

      // Cleanup triggered tracking list
      setTriggeredReminders((prev) => prev.filter((rid) => rid !== id));

      showToast("Note deleted successfully", "success");
    } catch (err) {
      showToast(err.response?.data?.message || "Failed to delete note.", "error");
    }
  };

  const openCreateModal = () => {
    setEditingNote(null);
    setIsModalOpen(true);
  };

  const openEditModal = (note) => {
    setEditingNote(note);
    setIsModalOpen(true);
  };

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      {/* Welcome Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="space-y-1 text-left">
          <div className="inline-flex items-center gap-1 text-xs font-bold text-purple-400 uppercase tracking-widest">
            <Sparkles size={12} /> Cloud Vault
          </div>
          <h2 className="text-3xl font-extrabold text-white tracking-tight leading-none">
            Hello, {user?.name || "User"}
          </h2>
          <p className="text-slate-400 text-sm font-medium">
            Manage your personal secure thoughts and ideas
          </p>
        </div>

        {/* Action button */}
        <button
          onClick={openCreateModal}
          className="flex items-center justify-center gap-2 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 text-white font-bold py-3 px-5 rounded-xl text-sm shadow-md hover:shadow-lg shadow-purple-900/20 hover:shadow-purple-900/30 transition-all cursor-pointer select-none"
        >
          <Plus size={16} />
          Create Note
        </button>
      </div>

      {/* Toolbar / Searchbar */}
      {notes.length > 0 && (
        <div className="relative max-w-md w-full text-left">
          <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-500">
            <Search size={16} />
          </span>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search notes by title or keywords..."
            className="w-full pl-10 pr-4 py-3 rounded-xl text-sm glass-input font-semibold tracking-tight shadow-inner"
          />
        </div>
      )}

      {/* Note list or Loader */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-24 gap-4">
          <Loader size="lg" />
          <span className="text-slate-400 text-sm font-semibold animate-pulse">Syncing notes from cloud...</span>
        </div>
      ) : notes.length === 0 ? (
        <EmptyState isSearch={false} onCreateClick={openCreateModal} />
      ) : filteredNotes.length === 0 ? (
        <EmptyState isSearch={true} />
      ) : (
        <div className="space-y-10">
          {/* Pinned Notes Section */}
          {pinnedNotes.length > 0 && (
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-slate-300 font-bold text-sm uppercase tracking-wider text-left pl-1">
                <Pin size={14} className="text-purple-400 fill-purple-400 animate-bounce" />
                <span>Pinned Notes ({pinnedNotes.length})</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 text-left">
                {pinnedNotes.map((note) => (
                  <NoteCard
                    key={note._id}
                    note={note}
                    onEdit={openEditModal}
                    onDelete={handleDeleteNote}
                    onTogglePin={handleTogglePin}
                    onClick={setDetailedNote}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Unpinned Notes / All Notes Section */}
          <div className="space-y-4">
            {pinnedNotes.length > 0 && (
              <div className="flex items-center gap-2 text-slate-400 font-bold text-sm uppercase tracking-wider text-left pl-1">
                <BookOpen size={14} className="text-slate-400" />
                <span>Other Notes ({unpinnedNotes.length})</span>
              </div>
            )}
            {unpinnedNotes.length === 0 ? (
              <div className="text-slate-500 text-sm font-medium py-6 text-center border border-white/5 rounded-2xl bg-white/[0.01]">
                All your notes are currently pinned!
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 text-left">
                {unpinnedNotes.map((note) => (
                  <NoteCard
                    key={note._id}
                    note={note}
                    onEdit={openEditModal}
                    onDelete={handleDeleteNote}
                    onTogglePin={handleTogglePin}
                    onClick={setDetailedNote}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Reusable creation/editing modal */}
      <NoteModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={editingNote ? handleUpdateNote : handleCreateNote}
        note={editingNote}
      />

      {/* Read-Only lightbox viewer modal */}
      <NoteDetailModal
        isOpen={!!detailedNote}
        onClose={() => setDetailedNote(null)}
        note={detailedNote}
        onEditClick={openEditModal}
        onTogglePin={handleTogglePin}
      />
    </div>
  );
};

export default Dashboard;
