import React from 'react';

function BookDetailsModal({ book, onClose }) {
  if (!book) return null;

  const pdfUrl = book.fileName ? `http://localhost:8080/uploads/${book.fileName}` : null;
  const coverUrl = book.coverName ? `http://localhost:8080/uploads/${book.coverName}` : null;

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 sm:p-6 backdrop-blur-md bg-slate-900/40 transition-all">
      {/* Анимация появления */}
      <div className="w-full max-w-4xl bg-white rounded-[2.5rem] shadow-2xl overflow-hidden flex flex-col md:flex-row max-h-[90vh] animate-in fade-in zoom-in duration-300">
        
        {/* Левая колонка: Обложка */}
        <div className="w-full md:w-2/5 bg-slate-50 p-8 flex flex-col items-center justify-center border-r border-slate-100 relative">
          {coverUrl ? (
            <img 
              src={coverUrl} 
              alt={book.title} 
              className="w-full max-w-[250px] rounded-2xl shadow-xl object-cover"
            />
          ) : (
            <div className="w-full max-w-[250px] aspect-[3/4] rounded-2xl bg-gradient-to-br from-indigo-500/10 to-purple-500/10 flex items-center justify-center shadow-inner">
              <span className="text-8xl font-black text-indigo-200">
                {book.title.substring(0, 1).toUpperCase()}
              </span>
            </div>
          )}
        </div>

        {/* Правая колонка: Информация и ИИ-Аннотация */}
        <div className="w-full md:w-3/5 p-8 flex flex-col overflow-y-auto">
          <div className="flex justify-between items-start mb-6">
            <span className="text-xs font-black uppercase tracking-widest text-indigo-500 bg-indigo-50 px-3 py-1.5 rounded-lg">
              {book.category}
            </span>
            <button 
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-full transition-all"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
            </button>
          </div>

          <h2 className="text-3xl font-extrabold text-slate-800 leading-tight mb-2">
            {book.title}
          </h2>
          <p className="text-slate-500 font-bold text-lg mb-8 flex items-center gap-2">
            <span className="w-6 h-[2px] bg-indigo-200"></span>
            {book.author}
          </p>

          {/* Блок ИИ-Аннотации */}
          <div className="flex-1 mb-8">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-6 h-6 rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 flex items-center justify-center shadow-md shadow-indigo-200">
                <svg className="w-3.5 h-3.5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
              </div>
              <h3 className="text-sm font-black text-slate-800 uppercase tracking-widest">Аннотация нейросети</h3>
            </div>
            
            <div className="bg-indigo-50/50 rounded-2xl p-5 border border-indigo-100/50">
              {book.description ? (
                <p className="text-slate-600 text-sm leading-relaxed text-justify">
                  {book.description}
                </p>
              ) : (
                <p className="text-slate-400 text-sm italic">ИИ-описание пока недоступно для этой книги.</p>
              )}
            </div>
          </div>

          {/* Кнопки действий */}
          <div className="flex gap-4 mt-auto pt-4 border-t border-slate-100">
            {pdfUrl ? (
              <a 
                href={pdfUrl} 
                target="_blank" 
                rel="noreferrer"
                className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white text-center py-4 rounded-xl font-bold text-sm uppercase tracking-wider transition-all shadow-lg shadow-indigo-200 active:scale-95"
              >
                Читать PDF
              </a>
            ) : (
              <div className="flex-1 text-center py-4 text-slate-400 text-sm font-bold border border-dashed border-slate-200 rounded-xl uppercase tracking-widest bg-slate-50">
                Файл отсутствует
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}

export default BookDetailsModal;
