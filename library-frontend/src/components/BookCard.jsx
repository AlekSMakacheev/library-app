// src/components/BookCard.jsx

function BookCard({ book, onEdit, onDelete }) {
  // 1. Формируем полный путь к PDF файлу
  const pdfUrl = `http://localhost:8080/uploads/${book.fileName}`;

  return (
    <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm hover:shadow-xl transition-all group">
      
      {/* 2. Визуальная обложка */}
      <div className="w-full h-40 bg-slate-50 rounded-2xl mb-4 flex items-center justify-center text-blue-200 group-hover:bg-blue-50 transition-colors">
         <span className="text-4xl" role="img" aria-label="book-icon">📚</span>
      </div>

      {/* 3. Бейдж категории */}
      <div className="flex justify-between items-start mb-2">
        <span className="px-3 py-1 bg-blue-50 text-blue-600 text-[10px] font-black uppercase rounded-lg">
          {book.category || "Общее"}
        </span>
      </div>

      {/* 4. Информация о книге */}
      <h3 className="text-xl font-black text-slate-800 leading-tight">{book.title}</h3>
      <p className="text-slate-400 italic mb-4">by {book.author}</p>
      
      <div className="flex flex-col gap-2">
        {/* 5. Условный рендеринг кнопки Читать */}
        {book.fileName && (
          <a 
            href={pdfUrl} 
            target="_blank" 
            rel="noreferrer"
            className="w-full py-3 bg-emerald-500 text-white rounded-xl text-center font-bold hover:bg-emerald-600 transition-all"
          >
             Читать PDF
          </a>
        )}

        {/* 6. Кнопки управления */}
        <div className="flex gap-2">
          <button 
            onClick={() => onEdit(book)} 
            className="flex-1 text-xs text-slate-400 hover:text-blue-600 py-2 font-bold transition-colors"
          >
            Изменить
          </button>
          <button 
            onClick={() => onDelete(book.id)} 
            className="flex-1 text-xs text-slate-400 hover:text-red-600 py-2 font-bold transition-colors"
          >
            Удалить
          </button>
        </div>
      </div>
    </div>
  );
}

export default BookCard;