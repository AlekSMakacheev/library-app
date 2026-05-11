import React from 'react';

function Sidebar({ categories, selectedCategory, setSelectedCategory, books, onAddClick }) {
  return (
    <aside className="w-64 bg-white border-r border-slate-100 p-6 flex flex-col fixed h-full z-20">
      
      {/* Логотип (v1.0 возвращено на место) */}
      <div className="mb-10 px-1">
        <div className="flex items-center gap-3">
          {/* Иконка */}
          <div className="relative group shrink-0">
            <div className="absolute -inset-1 bg-gradient-to-r from-indigo-600 to-blue-600 rounded-xl blur opacity-20 group-hover:opacity-40 transition duration-500"></div>
            <div className="relative w-10 h-10 bg-slate-900 rounded-xl flex items-center justify-center shadow-xl">
              
              <svg className="w-6 h-6 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M6 4v16h8a4 4 0 0 0 4-4 4 4 0 0 0-4-4H6" />
                <path d="M6 12h7a4 4 0 0 0 4-4 4 4 0 0 0-4-4H6" />
                <path d="M10 8v8h4" />
              </svg>
            </div>
          </div>
          {/* Текст логотипа */}
          <div className="flex flex-col items-end overflow-hidden">
            <h1 className="text-xl font-[1000] leading-none tracking-tighter text-slate-900">
              biblio<span className="text-indigo-600 uppercase">Logic</span>
            </h1>
            <span className="text-[9px] font-black tracking-[0.2em] text-slate-400 uppercase mt-1 leading-none">
              v1.0
            </span>
          </div>
        </div>
      </div>

      {/* Навигация */}
      <nav className="flex-1 space-y-1 overflow-y-auto pr-1 mt-2">
        {categories.map(cat => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-bold transition-all ${
              selectedCategory === cat 
              ? "bg-slate-900 text-white shadow-md shadow-slate-300/50" 
              : "text-slate-500 hover:bg-slate-50 hover:text-slate-900"
            }`}
          >
            <span className="truncate mr-2 text-left">{cat}</span>
            <span className={`text-[10px] shrink-0 opacity-60 ${selectedCategory === cat ? "text-white" : "text-slate-400"}`}>
              {books.filter(b => cat === "Все" || b.category === cat).length}
            </span>
          </button>
        ))}
      </nav>

      {/* Кнопка добавления */}
      <button 
        onClick={onAddClick}
        className="mt-6 w-full py-2.5 px-4 bg-indigo-600 text-white rounded-xl font-bold text-xs hover:bg-indigo-700 transition-all shadow-md shadow-indigo-200/50 flex items-center justify-start gap-2.5 shrink-0"
      >
        <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
        </svg>
        <span className="leading-none">Добавить...</span>
      </button>
    </aside>
  );
}

export default Sidebar;