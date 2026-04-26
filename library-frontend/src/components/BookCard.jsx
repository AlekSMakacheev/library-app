function BookCard({ book, onEdit, onDelete }) {
  const pdfUrl = `http://localhost:8080/uploads/${book.fileName}`;

  return (
    <div className="group bg-white rounded-[2.5rem] p-6 shadow-[0_8px_30px_rgb(0,0,0,0.02)] hover:shadow-[0_20px_50px_rgba(79,70,229,0.1)] transition-all duration-500 border border-slate-50 flex flex-col h-full relative overflow-hidden">
      
      {/* 1. Верхняя часть: Градиентная заглушка */}
      <div className="w-full h-44 rounded-[1.8rem] mb-6 bg-gradient-to-br from-indigo-500/5 to-purple-500/5 flex items-center justify-center relative overflow-hidden group-hover:scale-[1.02] transition-transform duration-500">
        <div className="absolute inset-0 opacity-10 group-hover:opacity-20 transition-opacity bg-[radial-gradient(circle_at_50%_120%,rgba(79,70,229,1),transparent)]"></div>
        <span className="text-6xl font-black text-indigo-100 select-none tracking-tighter group-hover:text-indigo-200 transition-colors">
          {book.title.substring(0, 1).toUpperCase()}
        </span>
      </div>

      <div className="flex-1 flex flex-col">
        {/* 2. Категория */}
        <span className="text-[10px] font-black uppercase tracking-[0.15em] text-indigo-500 bg-indigo-50/50 w-fit px-3 py-1 rounded-lg">
          {book.category}
        </span>
        
        {/* 3. Текст */}
        <h3 className="text-xl font-extrabold text-slate-800 mt-4 leading-tight group-hover:text-indigo-600 transition-colors line-clamp-2">
          {book.title}
        </h3>
        <p className="text-slate-400 text-sm font-bold mt-2 flex items-center gap-2">
          <span className="w-4 h-[2px] bg-indigo-100"></span>
          {book.author}
        </p>

        {/* 4. Кнопки действий */}
        <div className="mt-auto pt-8 flex items-center gap-3">
          {book.fileName ? (
            <a 
              href={pdfUrl} 
              target="_blank" 
              rel="noreferrer"
              className="flex-1 bg-slate-900 text-white text-center py-3.5 rounded-xl font-bold text-[11px] uppercase tracking-wider hover:bg-indigo-600 transition-all shadow-lg shadow-slate-200 active:scale-95"
            >
              Открыть PDF
            </a>
          ) : (
            <div className="flex-1 text-center py-3.5 text-slate-300 text-[10px] font-black border border-dashed border-slate-200 rounded-xl uppercase tracking-widest">
              Файл отсутствует
            </div>
          )}
          
          <button 
            onClick={() => onEdit(book)}
            className="p-3 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-xl transition-all"
            title="Изменить"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg>
          </button>
          
          <button 
            onClick={() => onDelete(book.id)}
            className="p-3 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all"
            title="Удалить"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
          </button>
        </div>
      </div>
    </div>
  );
}

export default BookCard;