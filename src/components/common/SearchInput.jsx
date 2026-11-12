import React from 'react';
import { Search, X } from 'lucide-react';

export default function SearchInput({
  value,
  onChange,
  placeholder = 'Search...',
  className = ''
}) {
  return (
    <div className={`relative flex items-center ${className}`}>
      <Search className="w-4 h-4 text-blue-600 dark:text-sky-400 absolute left-3.5 z-10 pointer-events-none" strokeWidth={1.5} />
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full pl-10 pr-9 py-2.5 glass-input rounded-xl text-xs sm:text-sm text-black dark:text-white placeholder:text-slate-600 dark:placeholder:text-slate-400 focus:outline-none transition-all shadow-xs"
      />
      {value && (
        <button
          type="button"
          onClick={() => onChange('')}
          className="absolute right-3 z-10 p-1 rounded-lg text-black/70 dark:text-slate-300 hover:text-blue-600 hover:bg-blue-50/80 dark:hover:bg-slate-800"
          aria-label="Clear search"
        >
          <X className="w-3.5 h-3.5" strokeWidth={1.5} />
        </button>
      )}
    </div>
  );
}
