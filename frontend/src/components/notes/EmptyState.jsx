import React from "react";
import { StickyNote, Plus, Search } from "lucide-react";

const EmptyState = ({ isSearch = false, onCreateClick }) => {
  return (
    <div className="flex flex-col items-center justify-center text-center p-8 sm:p-12 glass-panel rounded-2xl border border-white/5 max-w-md mx-auto my-8 animate-float">
      <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-purple-600/10 to-blue-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400 mb-6 shadow-inner">
        {isSearch ? <Search size={28} /> : <StickyNote size={28} />}
      </div>

      <h3 className="text-xl font-bold text-white mb-2">
        {isSearch ? "No matching notes" : "No notes yet"}
      </h3>
      
      <p className="text-slate-400 text-sm leading-relaxed mb-6">
        {isSearch
          ? "We couldn't find any notes matching your search query. Try adjusting your terms or check your spelling."
          : "Start creating your notes! Keep your ideas, lists, and thoughts secure in AWS S3 and cloud databases."}
      </p>

      {!isSearch && (
        <button
          onClick={onCreateClick}
          className="flex items-center gap-2 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 text-white py-2.5 px-5 rounded-xl text-sm font-bold shadow-md hover:shadow-lg shadow-purple-900/20 hover:shadow-purple-900/30 transition-all duration-200 cursor-pointer"
        >
          <Plus size={16} />
          Create Note
        </button>
      )}
    </div>
  );
};

export default EmptyState;
