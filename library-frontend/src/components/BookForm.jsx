import React, { useState } from 'react';

function BookForm({ onSave, onCancel, editingBook, categories, isLoading }) {
  
  const [title, setTitle] = useState(editingBook?.title || '');
  const [author, setAuthor] = useState(editingBook?.author || '');
  const [category, setCategory] = useState(editingBook?.category || categories[1] || 'Все');
  const [file, setFile] = useState(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave({ title, author, category }, file);
  };

  return (
    <div className="bg-white rounded-2xl shadow-2xl border border-slate-100 overflow-hidden w-full max-w-lg mx-auto">
      
      {/* Шапка формы */}
      <div className="px-6 py-4 border-b border-slate-100 bg-slate-50/50 flex justify-between items-center">
        <h2 className="text-base font-black text-slate-800 tracking-tight uppercase">
          {editingBook ? 'Редактировать запись' : 'Новый источник'}
        </h2>
        <button onClick={onCancel} className="text-slate-400 hover:text-slate-700 transition-colors bg-white shadow-sm border border-slate-200 p-1.5 rounded-md">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12" /></svg>
        </button>
      </div>

      {/* Тело формы */}
      <form onSubmit={handleSubmit} className="p-6 space-y-4">
        
        {/* Название и Автор в один ряд */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Название</label>
            <input required type="text" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Введите название..." className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm font-semibold focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all placeholder:text-slate-400 placeholder:font-normal" />
          </div>
          <div className="space-y-1.5">
            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Автор</label>
            <input required type="text" value={author} onChange={(e) => setAuthor(e.target.value)} placeholder="Имя автора..." className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm font-semibold focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all placeholder:text-slate-400 placeholder:font-normal" />
          </div>
        </div>

        {/* Категория */}
        <div className="space-y-1.5">
          <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Категория</label>
          <select value={category} onChange={(e) => setCategory(e.target.value)} className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm font-semibold text-slate-700 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all cursor-pointer appearance-none">
            {categories.filter(c => c !== 'Все').map(cat => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
        </div>

        {/* Компактный Файл PDF */}
        <div className="space-y-1.5">
          <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Файл PDF</label>
          <div className="relative border border-dashed border-slate-300 rounded-lg bg-slate-50 hover:bg-slate-100 hover:border-indigo-300 transition-all group cursor-pointer">
            <input type="file" accept=".pdf" onChange={(e) => setFile(e.target.files[0])} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" />
            <div className="flex items-center justify-center py-3 gap-2">
              <svg className="w-5 h-5 text-slate-400 group-hover:text-indigo-500 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" /></svg>
              <span className="text-xs font-semibold text-slate-500 group-hover:text-indigo-600 truncate max-w-[200px]">
                {file ? file.name : "Выбрать или перетащить..."}
              </span>
            </div>
          </div>
        </div>

        {/* Кнопки */}
        <div className="pt-3 flex gap-3">
          <button type="button" onClick={onCancel} className="px-5 py-2.5 bg-white border border-slate-200 text-slate-600 rounded-lg text-xs font-bold hover:bg-slate-50 hover:text-slate-900 transition-colors">
            Отмена
          </button>
          <button type="submit" disabled={isLoading} className="flex-1 px-4 py-2.5 bg-slate-900 text-white rounded-lg text-xs font-bold hover:bg-indigo-600 transition-all shadow-md shadow-slate-200/50 disabled:opacity-50">
            {isLoading ? 'Сохранение...' : (editingBook ? 'Сохранить изменения' : 'Добавить в библиотеку')}
          </button>
        </div>

      </form>
    </div>
  );
}

export default BookForm;