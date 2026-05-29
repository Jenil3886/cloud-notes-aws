import React from "react";
import { Link } from "react-router-dom";
import { AlertCircle, ArrowLeft, Cloud } from "lucide-react";

const NotFound = () => {
  return (
    <div className="min-h-screen bg-mesh flex flex-col justify-center items-center p-6 relative overflow-hidden font-sans">
      {/* Background blobs */}
      <div className="absolute top-1/4 left-1/4 w-[40vw] h-[40vw] rounded-full bg-purple-600/10 blur-[100px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-[40vw] h-[40vw] rounded-full bg-blue-600/10 blur-[100px] pointer-events-none" />

      <div className="relative z-10 text-center max-w-md w-full glass-panel p-8 sm:p-12 rounded-3xl border border-white/5 shadow-2xl animate-float">
        <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-purple-600/10 to-blue-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400 mb-6 mx-auto shadow-inner">
          <AlertCircle size={32} />
        </div>

        <h1 className="text-8xl font-black text-transparent bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text leading-none tracking-tighter mb-4">
          404
        </h1>
        
        <h3 className="text-xl font-bold text-white mb-2">Lost in the Clouds</h3>
        
        <p className="text-slate-400 text-sm leading-relaxed mb-8">
          The page you are looking for doesn't exist or has been shifted to a different security node. Let's get you back on track!
        </p>

        <Link
          to="/dashboard"
          className="inline-flex items-center gap-2.5 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 text-white font-bold py-3 px-6 rounded-xl text-sm shadow-md hover:shadow-lg shadow-purple-900/20 hover:shadow-purple-900/30 transition-all select-none cursor-pointer"
        >
          <ArrowLeft size={16} />
          Back to Dashboard
        </Link>
      </div>

      <div className="absolute bottom-6 text-center text-xs text-slate-600 font-semibold flex items-center gap-2">
        <Cloud size={12} className="text-slate-600" />
        <span>CloudNotes Secure Routing</span>
      </div>
    </div>
  );
};

export default NotFound;
