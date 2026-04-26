import { useState } from "react";

function BookForm({ onSave, editingBook, onCancel, categories, isLoading }) {
  // 1. Состояние для текстовых полей
  const [formData, setFormData] = useState(
    editingBook || { title: "", author: "", category: "Прочее" }
  );

  // 2. ВОТ ЭТА СТРОЧКА НУЖНА, чтобы убрать подчеркивание у file:
  const [file, setFile] = useState(null); 

  const handleSubmit = (e) => {
    e.preventDefault();
    
    const bookToSave = {
      title: formData.title,
      author: formData.author,
      category: formData.category
    };

    if (editingBook?.id) {
      bookToSave.id = editingBook.id;
    }

    // Теперь file здесь будет доступен
    onSave(bookToSave, file);
  };

  return (
    <div className="bg-white p-10 rounded-[3rem] shadow-2xl relative overflow-hidden border border-slate-100">
      {/* Декоративное пятно на фоне */}
      <div className="absolute -top-24 -right-24 w-64 h-64 bg-indigo-50 rounded-full blur-3xl opacity-50"></div>

      <div className="relative">
        <h2 className="text-3xl font-[900] text-slate-900 mb-8 tracking-tighter">
          {editingBook ? "Редактирование" : "Новый ресурс"}
        </h2>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Название</label>
              <input 
                type="text" 
                className="w-full p-4 bg-slate-50 border-2 border-transparent rounded-2xl outline-none focus:bg-white focus:border-indigo-500/20 focus:ring-4 focus:ring-indigo-500/5 transition-all font-semibold"
                value={formData.title}
                onChange={(e) => setFormData({...formData, title: e.target.value})}
                required 
                placeholder="Введите название..."
              />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Автор</label>
              <input 
                type="text" 
                className="w-full p-4 bg-slate-50 border-2 border-transparent rounded-2xl outline-none focus:bg-white focus:border-indigo-500/20 focus:ring-4 focus:ring-indigo-500/5 transition-all font-semibold"
                value={formData.author}
                onChange={(e) => setFormData({...formData, author: e.target.value})}
                required 
                placeholder="Имя автора..."
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Категория</label>
            <select 
              className="w-full p-4 bg-slate-50 border-2 border-transparent rounded-2xl outline-none focus:bg-white focus:border-indigo-500/20 focus:ring-4 focus:ring-indigo-500/5 transition-all font-semibold cursor-pointer appearance-none"
              value={formData.category}
              onChange={(e) => setFormData({...formData, category: e.target.value})}
            >
              {categories.filter(c => c !== "Все").map(c => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>

          <div className="pt-4">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 mb-3 block">Файл PDF</label>
            <div className="relative group">
              <input 
                type="file" 
                accept="application/pdf"
                onChange={(e) => setFile(e.target.files[0])}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
              />
              <div className="p-6 border-2 border-dashed border-slate-200 rounded-3xl bg-slate-50 group-hover:border-indigo-300 group-hover:bg-indigo-50 transition-all flex items-center justify-center gap-3">
                <svg className="w-6 h-6 text-slate-400 group-hover:text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" /></svg>
                <span className="text-sm font-bold text-slate-500 group-hover:text-indigo-600">
                  {file ? file.name : "Нажмите или перетащите файл"}
                </span>
              </div>
            </div>
          </div>

          <div className="flex gap-4 pt-6">
            <button 
              type="button" 
              onClick={onCancel} 
              className="flex-1 py-4 bg-slate-100 text-slate-500 rounded-2xl font-bold hover:bg-slate-200 transition-all"
            >
              Отмена
            </button>
            <button 
              type="submit" 
              disabled={isLoading}
              className="flex-[2] py-4 bg-indigo-600 text-white rounded-2xl font-black shadow-xl shadow-indigo-100 hover:bg-indigo-700 transition-all disabled:bg-slate-300"
            >
              {isLoading ? "Загрузка..." : (editingBook ? "Сохранить изменения" : "Добавить в библиотеку")}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default BookForm;