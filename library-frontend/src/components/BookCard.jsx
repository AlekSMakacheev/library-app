import React from 'react';

function BookCard({ book, onEdit, onDelete, onView }) {
  const pdfUrl = book.fileName ? `http://localhost:8080/uploads/${book.fileName}` : null;
  const coverUrl = book.coverName ? `http://localhost:8080/uploads/${book.coverName}` : null;

  return (
    
    <div className="group bg-white rounded-2xl p-4 shadow-[0_8px_30px_rgb(0,0,0,0.02)] hover:shadow-[0_20px_50px_rgba(79,70,229,0.1)] transition-all duration-500 border border-slate-50 flex flex-col h-full relative overflow-hidden">
      
      {/* Обложка */}
      {coverUrl ? (
        <div className="w-full h-40 mb-3 bg-slate-50/50 rounded-lg flex items-center justify-center overflow-hidden border border-slate-100 group-hover:shadow-sm transition-all">
          <img 
            src={coverUrl} 
            alt={book.title} 
            className="w-full h-full object-contain p-1.5 group-hover:scale-[1.03] transition-transform duration-500"
          />
        </div>
      ) : (
        <div className="w-full h-40 rounded-lg mb-3 bg-gradient-to-br from-indigo-500/5 to-purple-500/5 flex items-center justify-center relative overflow-hidden group-hover:scale-[1.02] transition-transform">
          <div className="absolute inset-0 opacity-10 group-hover:opacity-20 transition-opacity bg-[radial-gradient(circle_at_50%_120%,rgba(79,70,229,0.4),transparent)]"></div>
          <span className="text-4xl font-black text-indigo-100 select-none tracking-tighter group-hover:text-indigo-200 transition-colors">
            {book.title.substring(0, 1).toUpperCase()}
          </span>
        </div>
      )}

      <div className="flex-1 flex flex-col">
        {/* Категория */}
        <div className="mb-2 w-full flex justify-center">
          <span className="inline-flex items-center justify-center text-[8px] font-black uppercase tracking-[0.1em] text-indigo-500 bg-indigo-50/80 px-2 py-1 rounded-md leading-none">
            {book.category}
          </span>
        </div>
        
        {/* Текст */}
        <h3 className="text-sm font-bold text-slate-800 text-center leading-snug group-hover:text-indigo-600 transition-colors line-clamp-2 px-1 mt-1">
          {book.title}
        </h3>
        <p className="text-slate-400 text-[11px] font-semibold mt-1.5 flex items-center justify-center gap-1.5 line-clamp-1 w-full">
          <span className="w-2 h-[2px] bg-indigo-100 shrink-0"></span>
          {book.author}
          <span className="w-2 h-[2px] bg-indigo-100 shrink-0"></span>
        </p>

        {/* Кнопки */}
        <div className="mt-auto pt-4 flex items-center gap-1.5">
          {pdfUrl ? (
            <button 
              onClick={() => onView(book)}
              className="flex-1 bg-slate-900 text-white flex items-center justify-center py-2 px-1 rounded-md font-bold text-[9px] uppercase tracking-wide hover:bg-indigo-600 transition-all shadow-md shadow-slate-200/50 active:scale-95"
            >
               Детали
            </button>
          ) : (
            <div className="flex-1 flex items-center justify-center py-2 px-1 text-slate-300 text-[8px] font-black border border-dashed border-slate-200 rounded-md uppercase tracking-widest">
              Нет файла
            </div>
          )}
          
          <a 
            href={pdfUrl} 
            target="_blank" 
            rel="noreferrer"
            className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-md transition-all shrink-0"
            title="Открыть PDF"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" /></svg>
          </a>

          <button 
            onClick={() => onEdit(book)}
            className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-md transition-all shrink-0"
            title="Изменить"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg>
          </button>
          
          <button 
            onClick={() => onDelete(book.id)}
            className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-md transition-all shrink-0"
            title="Удалить"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
          </button>
        </div>
      </div>
    </div>
  );
}

export default BookCard;