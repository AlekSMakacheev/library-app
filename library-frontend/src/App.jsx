import { useState, useEffect } from "react";
import BookForm from "./components/BookForm";
import BookCard from "./components/BookCard";

function App() {
  const [books, setBooks] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("Все");
  const [searchTerm, setSearchTerm] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  
  // НОВЫЙ СТЕЙТ: Контроль видимости формы
  const [isFormOpen, setIsFormOpen] = useState(false);

  const categories = [
    "Все",
    "Токсикология",
    "Теория и практика йоги",
    "Спортивная медицина",
    "Психология",
    "Художественная литература",
    "Прочее",
  ];

  useEffect(() => {
    fetchBooks();
  }, []);

  const fetchBooks = async () => {
    try {
      const response = await fetch("http://localhost:8080/api/books");
      const data = await response.json();
      setBooks(data);
    } catch (error) {
      console.error("Ошибка загрузки:", error);
    }
  };

  const handleSave = async (bookData, file) => {
  setIsLoading(true);
  const data = new FormData();

  // Раскладываем объект на отдельные параметры, как ждет Java (@RequestParam)
  data.append("title", bookData.title);
  data.append("author", bookData.author);
  data.append("category", bookData.category);

  // Добавляем файл, если он есть
  if (file) {
    data.append("file", file);
  }

  const url = editingId 
    ? `http://localhost:8080/api/books/${editingId}`
    : "http://localhost:8080/api/books";
  
  const method = editingId ? "PUT" : "POST";

  try {
    const response = await fetch(url, { method, body: data });

    if (response.ok) {
      await fetchBooks();
      setEditingId(null);
      setIsFormOpen(false);
    } else {
      const errorText = await response.text();
      console.error("Ошибка сервера:", response.status, errorText);
    }
  } catch (error) {
    console.error("Ошибка сети:", error);
  } finally {
    setIsLoading(false);
  }
};

  const filteredBooks = books.filter(book => {
    const matchesCategory = selectedCategory === "Все" || book.category === selectedCategory;
    const matchesSearch = book.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          book.author.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="flex min-h-screen">
      
      {/* 1. SIDEBAR (Боковая панель) */}
      <aside className="w-80 bg-white border-r border-slate-100 p-8 flex flex-col fixed h-full z-20">
        {/* Логотип BiblioLogic */}
        <div className="mb-14 px-2">
          <div className="flex items-center gap-4">
            <div className="relative group">
              <div className="absolute -inset-1 bg-gradient-to-r from-indigo-600 to-blue-600 rounded-2xl blur opacity-20 group-hover:opacity-40 transition duration-500"></div>
                <div className="relative w-12 h-12 bg-slate-900 rounded-2xl flex items-center justify-center shadow-xl">
                  <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                  </svg>
                </div>
              </div>
            <div className="flex flex-col items-end">
              <h1 className="text-2xl font-[1000] leading-none tracking-tighter text-slate-900 uppercase">
                Biblio<span className="text-indigo-600">Logic</span>
              </h1>
              <span className="text-[10px] font-black tracking-[0.2em] text-slate-300 uppercase mt-1 leading-none">
                v1.0
              </span>
            </div>
          </div>
        </div>

        {/* Навигация по категориям */}
        <nav className="flex-1 space-y-1">
          <p className="text-[10px] font-black text-slate-300 uppercase tracking-[0.2em] mb-4 ml-4">Категории</p>
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`w-full flex items-center justify-between px-4 py-3.5 rounded-2xl text-sm font-bold transition-all ${
                selectedCategory === cat 
                ? "bg-slate-900 text-white shadow-xl shadow-slate-200" 
                : "text-slate-500 hover:bg-slate-50 hover:text-slate-900"
              }`}
            >
              {cat}
              <span className={`text-[10px] opacity-50 ${selectedCategory === cat ? "text-white" : "text-slate-400"}`}>
                {books.filter(b => cat === "Все" || b.category === cat).length}
              </span>
            </button>
          ))}
        </nav>

        {/* Кнопка добавления внизу сайдбара */}
        <button 
          onClick={() => { setEditingId(null); setIsFormOpen(true); }}
          className="mt-8 w-full py-4 px-4 bg-indigo-600 text-white rounded-2xl font-[800] text-sm hover:bg-indigo-700 transition-all shadow-xl shadow-indigo-100 flex items-center justify-start gap-3"
          >
          {/* Добавляем SVG иконку плюса для стиля */}
          <svg className="w-5 h-5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
          <span className="leading-none">Добавить...</span>
        </button>
      </aside>

      {/* 2. MAIN CONTENT (Основная область) */}
      <main className="flex-1 ml-80 p-12 relative overflow-hidden bg-slate-50/50">
        
        {/* Фоновая надпись для стиля */}
        <div className="fixed -bottom-10 -right-10 pointer-events-none select-none opacity-[0.02] leading-none z-0">
          <h1 className="text-[22rem] font-black text-slate-900 tracking-tighter">LIBRARY</h1>
        </div>

        <div className="relative z-10">
          {/* Шапка с поиском */}
          <header className="flex flex-col md:flex-row md:items-center justify-between gap-8 mb-16">
            <div>
              <h2 className="text-5xl font-black text-slate-900 tracking-tight mb-2">
                {selectedCategory === "Все" ? "Моя библиотека" : selectedCategory}
              </h2>
              <p className="text-slate-400 font-semibold tracking-wide">
                Всего доступно {filteredBooks.length} материалов
              </p>
            </div>

            <div className="relative w-full md:w-80 group">
              <input 
                type="text" 
                placeholder="Поиск..."
                className="w-full pl-14 pr-6 py-4 bg-white border border-slate-100 rounded-[1.25rem] outline-none focus:border-indigo-300 focus:ring-4 focus:ring-indigo-500/5 transition-all shadow-sm"
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <svg className="w-6 h-6 text-slate-300 absolute left-5 top-4 group-focus-within:text-indigo-500 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
          </header>

          {/* Сетка карточек */}
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-8">
            {filteredBooks.map(book => (
              <BookCard 
                key={book.id} 
                book={book} 
                onEdit={(b) => { setEditingId(b.id); setIsFormOpen(true); }}
                onDelete={async (id) => { 
                  if(confirm("Удалить этот ресурс?")) {
                    await fetch(`http://localhost:8080/api/books/${id}`, { method: "DELETE" });
                    fetchBooks();
                  }
                }}
              />
            ))}
          </div>
        </div>
      </main>

      {/* 3. MODAL (Всплывающая форма) */}
      {isFormOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-6 backdrop-blur-md bg-slate-900/40 transition-all duration-300">
          <div className="w-full max-w-2xl animate-in fade-in zoom-in duration-300">
            <BookForm 
              key={editingId || 'new'}
              onSave={handleSave} 
              editingBook={books.find(b => b.id === editingId)} 
              onCancel={() => { setIsFormOpen(false); setEditingId(null); }}
              categories={categories}
              isLoading={isLoading}
            />
          </div>
        </div>
      )}
    </div>
  );
}

export default App;