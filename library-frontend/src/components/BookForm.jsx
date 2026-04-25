import { useState } from "react";

function BookForm({ onSave, editingBook, onCancel, categories, isLoading }) {
  // 1. Инициализируем состояние СРАЗУ из пропса editingBook.
  // Если мы редактируем — поля заполнятся данными книги.
  // Если создаем новую — поля будут пустыми.
  const [formData, setFormData] = useState(
    editingBook || { title: "", author: "", category: "Общее", isbn: "" }
  );
  const [file, setFile] = useState(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    // Передаем данные "наверх" в App.jsx
    onSave(formData, file);
    // Сбрасываем файл локально
    setFile(null);
  };

  return (
    <div className="bg-white p-8 rounded-3xl shadow-xl border border-slate-100">
      <h2 className="text-2xl font-black text-slate-800 mb-6 flex items-center gap-2">
        <span className="bg-blue-600 text-white p-2 rounded-lg text-sm">+</span>
        {editingBook ? "Редактировать ресурс" : "Добавить новый ресурс"}
      </h2>
      
      <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
        {/* Поле: Название */}
        <div className="flex flex-col gap-2">
          <label className="text-xs font-bold text-slate-400 uppercase ml-1">Название</label>
          <input 
            type="text" 
            className="p-3 bg-slate-50 border-none rounded-xl outline-none focus:ring-2 focus:ring-blue-500 transition-all"
            value={formData.title}
            onChange={(e) => setFormData({...formData, title: e.target.value})}
            required 
            placeholder="Введите название..."
          />
        </div>

        {/* Поле: Автор */}
        <div className="flex flex-col gap-2">
          <label className="text-xs font-bold text-slate-400 uppercase ml-1">Автор</label>
          <input 
            type="text" 
            className="p-3 bg-slate-50 border-none rounded-xl outline-none focus:ring-2 focus:ring-blue-500 transition-all"
            value={formData.author}
            onChange={(e) => setFormData({...formData, author: e.target.value})}
            required 
            placeholder="Имя автора..."
          />
        </div>

        {/* Поле: Категория */}
        <div className="flex flex-col gap-2">
          <label className="text-xs font-bold text-slate-400 uppercase ml-1">Категория</label>
          <select 
            className="p-3 bg-slate-50 border-none rounded-xl outline-none focus:ring-2 focus:ring-blue-500 transition-all cursor-pointer"
            value={formData.category}
            onChange={(e) => setFormData({...formData, category: e.target.value})}
          >
            {categories.filter(c => c !== "Все").map(c => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </div>

        {/* Кнопки управления */}
        <div className="flex gap-2">
          <button 
            type="submit" 
            disabled={isLoading}
            className="flex-1 p-3 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 shadow-lg shadow-blue-100 transition-all active:scale-95 disabled:bg-slate-300"
          >
            {isLoading ? "..." : (editingBook ? "Сохранить" : "Создать")}
          </button>
          
          {editingBook && (
            <button 
              type="button" 
              onClick={onCancel} 
              className="p-3 bg-slate-100 text-slate-500 rounded-xl hover:bg-slate-200 transition-all"
              title="Отмена"
            >
              ✖
            </button>
          )}
        </div>

        {/* Загрузка файла */}
        <div className="md:col-span-4 mt-4 p-4 border-2 border-dashed border-slate-100 rounded-2xl bg-slate-50/50">
           <label className="text-xs font-bold text-slate-400 uppercase block mb-2">Прикрепить PDF версию</label>
           <input 
             type="file" 
             accept="application/pdf"
             onChange={(e) => setFile(e.target.files[0])}
             className="text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 cursor-pointer"
           />
        </div>
      </form>
    </div>
  );
}

export default BookForm;