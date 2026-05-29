import React, { useState, useEffect } from "react";
import useAuth from "../hooks/useAuth";
import * as noteService from "../services/noteService";
import { useToast } from "../context/ToastContext";
import Loader from "../components/common/Loader";
import { User, Mail, Shield, Calendar, StickyNote, Image, Sparkles } from "lucide-react";

const Profile = () => {
  const { user } = useAuth();
  const { showToast } = useToast();
  
  const [stats, setStats] = useState({ totalNotes: 0, imageNotes: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const notes = await noteService.getNotes();
        const imageNotes = notes.filter((n) => n.image).length;
        setStats({
          totalNotes: notes.length,
          imageNotes: imageNotes,
        });
      } catch (err) {
        showToast("Failed to fetch stats.", "error");
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, [showToast]);

  return (
    <div className="max-w-4xl mx-auto space-y-8 text-left">
      {/* Page Title */}
      <div className="space-y-1">
        <div className="inline-flex items-center gap-1 text-xs font-bold text-purple-400 uppercase tracking-widest">
          <Sparkles size={12} /> Account
        </div>
        <h2 className="text-3xl font-extrabold text-white tracking-tight leading-none">
          My Profile
        </h2>
        <p className="text-slate-400 text-sm font-medium">
          View your secure account credentials and cloud statistics
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* User Card */}
        <div className="md:col-span-2 glass-panel p-6 sm:p-8 rounded-2xl border border-white/5 shadow-lg relative flex flex-col justify-between">
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-purple-600 to-blue-500 flex items-center justify-center text-white font-extrabold text-2xl shadow-lg shadow-purple-500/20">
                {user?.name?.charAt(0).toUpperCase() || "U"}
              </div>
              <div className="space-y-1">
                <h3 className="text-xl font-bold text-white">{user?.name || "User"}</h3>
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-500/10 border border-emerald-500/20 text-emerald-300">
                  <Shield size={12} /> Active AWS Secure Node
                </span>
              </div>
            </div>

            <div className="border-t border-white/5 pt-6 space-y-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-white/[0.03] border border-white/5 rounded-xl text-slate-400">
                  <Mail size={16} />
                </div>
                <div>
                  <p className="text-[10px] uppercase font-bold text-slate-500 tracking-wider">Email Address</p>
                  <p className="text-sm font-semibold text-slate-200">{user?.email || "user@cloudnotes.com"}</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="p-2 bg-white/[0.03] border border-white/5 rounded-xl text-slate-400">
                  <Calendar size={16} />
                </div>
                <div>
                  <p className="text-[10px] uppercase font-bold text-slate-500 tracking-wider">Network Connection</p>
                  <p className="text-sm font-semibold text-slate-200">AWS Cloud VPC Node</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Cloud Stats Card */}
        <div className="glass-panel p-6 rounded-2xl border border-white/5 shadow-lg flex flex-col justify-between">
          <div className="space-y-6">
            <h4 className="text-sm font-bold text-slate-400 uppercase tracking-widest">
              Usage Statistics
            </h4>

            {loading ? (
              <div className="flex justify-center items-center py-12">
                <Loader size="md" />
              </div>
            ) : (
              <div className="space-y-5">
                {/* Stats 1 */}
                <div className="flex items-center justify-between p-4 rounded-xl border border-white/5 bg-white/[0.01]">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-purple-500/10 border border-purple-500/25 rounded-lg text-purple-400">
                      <StickyNote size={16} />
                    </div>
                    <span className="text-sm font-semibold text-slate-300">Total Notes</span>
                  </div>
                  <span className="text-lg font-extrabold text-white bg-purple-500/10 border border-purple-500/30 px-3 py-1 rounded-lg">
                    {stats.totalNotes}
                  </span>
                </div>

                {/* Stats 2 */}
                <div className="flex items-center justify-between p-4 rounded-xl border border-white/5 bg-white/[0.01]">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-blue-500/10 border border-blue-500/25 rounded-lg text-blue-400">
                      <Image size={16} />
                    </div>
                    <span className="text-sm font-semibold text-slate-300">AWS Attachments</span>
                  </div>
                  <span className="text-lg font-extrabold text-white bg-blue-500/10 border border-blue-500/30 px-3 py-1 rounded-lg">
                    {stats.imageNotes}
                  </span>
                </div>
              </div>
            )}
          </div>

          <div className="text-[10px] text-slate-500 font-semibold text-center mt-6 border-t border-white/5 pt-4">
            Security sync is active
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
