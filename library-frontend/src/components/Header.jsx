import React from 'react';

function Header({ selectedCategory, filteredCount, onSearch, viewMode, setViewMode }) {
  return (
    <header className="sticky top-0 z-40 bg-slate-50/90 backdrop-blur-md pb-3 pt-2 -mt-8 -mx-8 px-8 mb-6 flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200/50">
      
      {/* Левая часть */}
      <div className="flex items-center gap-2.5">
        <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Каталог</span>
        
        <svg className="w-3.5 h-3.5 text-slate-300 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 5l7 7-7 7" />
        </svg>
        
        {/* Категория */}
        <span className="text-xs font-bold text-slate-800 uppercase tracking-wider truncate max-w-[200px]">
          {selectedCategory}
        </span>
        
        <div className="h-3.5 w-px bg-slate-200 mx-1 shrink-0"></div>
        
        <span className="text-[9px] font-bold text-indigo-500 bg-indigo-50 border border-indigo-100/50 px-2 py-1 rounded-md uppercase tracking-wider leading-none">
          {filteredCount} шт.
        </span>
      </div>

      {/* Правая часть: Поиск и переключатель */}
      <div className="flex items-center gap-3 w-full md:w-auto">
        
        {/* Поиск */}
        <div className="relative w-full md:w-64 group">
          <input 
            type="text" 
            placeholder="Поиск..."
            className="w-full pl-9 pr-4 py-2 bg-white border border-slate-200/60 rounded-xl outline-none focus:border-indigo-300 focus:ring-2 focus:ring-indigo-500/10 transition-all shadow-sm text-xs font-semibold text-slate-700 placeholder:text-slate-400"
            onChange={(e) => onSearch(e.target.value)}
          />
          <svg className="w-4 h-4 text-slate-400 absolute left-3 top-2 group-focus-within:text-indigo-500 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>

        {/* Переключатель Плитка / Список */}
        <div className="flex items-center bg-white border border-slate-200/60 rounded-xl p-1 shadow-sm shrink-0">
          <button 
            onClick={() => setViewMode("grid")}
            className={`p-1.5 rounded-lg transition-all ${viewMode === 'grid' ? 'bg-slate-900 text-white shadow-md' : 'text-slate-400 hover:text-slate-700 hover:bg-slate-50'}`}
            title="Плитка"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" /></svg>
          </button>
          <button 
            onClick={() => setViewMode("list")}
            className={`p-1.5 rounded-lg transition-all ${viewMode === 'list' ? 'bg-slate-900 text-white shadow-md' : 'text-slate-400 hover:text-slate-700 hover:bg-slate-50'}`}
            title="Список"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M4 6h16M4 12h16M4 18h16" /></svg>
          </button>
        </div>

      </div>
    </header>
  );
}

export default Header;