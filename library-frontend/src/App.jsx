import { useState, useEffect } from "react";
import Sidebar from "./components/Sidebar";
import Header from "./components/Header";
import BookForm from "./components/BookForm";
import BookCard from "./components/BookCard";
import BookDetailsModal from "./components/BookDetailsModal";
import AiChat from './components/AiChat';

function App() {
  const [books, setBooks] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("Все");
  const [searchTerm, setSearchTerm] = useState("");
  
  const [viewMode, setViewMode] = useState("grid"); 

  const [editingId, setEditingId] = useState(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [viewingBook, setViewingBook] = useState(null);
  const [isAiOpen, setIsAiOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const categories = [
    "Все", "Токсикология", "Теория и практика йоги", 
    "Спортивная медицина", "Психология", "Художественная литература", "Прочее"
  ];

  useEffect(() => { fetchBooks(); }, []);

  const fetchBooks = async () => {
    try {
      const response = await fetch("http://localhost:8080/api/books");
      setBooks(await response.json());
    } catch (error) {
      console.error("Ошибка загрузки:", error);
    }
  };

  const handleSave = async (bookData, file) => {
    setIsLoading(true);
    const data = new FormData();
    data.append("title", bookData.title);
    data.append("author", bookData.author);
    data.append("category", bookData.category);
    if (file) data.append("file", file);

    const url = editingId ? `http://localhost:8080/api/books/${editingId}` : "http://localhost:8080/api/books";
    try {
      const response = await fetch(url, { method: editingId ? "PUT" : "POST", body: data });
      if (response.ok) {
        await fetchBooks();
        setEditingId(null);
        setIsFormOpen(false);
      }
    } catch (error) {
      console.error("Ошибка сети:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if(confirm("Удалить этот ресурс?")) {
      await fetch(`http://localhost:8080/api/books/${id}`, { method: "DELETE" });
      fetchBooks();
    }
  };

  const filteredBooks = books.filter(book => {
    const matchesCategory = selectedCategory === "Все" || book.category === selectedCategory;
    const matchesSearch = book.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          book.author.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  }).sort((a, b) => a.title.localeCompare(b.title));

  return (
    <div className="flex min-h-screen">
      
      <Sidebar 
        categories={categories}
        selectedCategory={selectedCategory}
        setSelectedCategory={setSelectedCategory}
        books={books}
        onAddClick={() => { setEditingId(null); setIsFormOpen(true); }}
      />

      <main className="flex-1 ml-64 p-8 relative bg-slate-50/50">
        {/* Фоновый водяной знак */}
        <div className="fixed -bottom-4 -right-2 pointer-events-none select-none opacity-[0.03] leading-none z-0">
          <h1 className="text-[5rem] md:text-[6rem] lg:text-[8rem] xl:text-[10rem] font-[1000] text-slate-900 tracking-tighter whitespace-nowrap">
            biblio<span className="uppercase">LOGIC</span>
          </h1>
        </div>ё

        <Header 
          selectedCategory={selectedCategory} 
          filteredCount={filteredBooks.length} 
          onSearch={setSearchTerm} 
          viewMode={viewMode}
          setViewMode={setViewMode}
        />

        {/* Условный рендеринг: Плитка или Список */}
        {viewMode === "grid" ? (
          // Режим: ПЛИТКА 
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-6 relative z-10">
            {filteredBooks.map(book => (
              <BookCard 
                key={book.id} 
                book={book} 
                onView={(b) => setViewingBook(b)}
                onEdit={(b) => { setEditingId(b.id); setIsFormOpen(true); }}
                onDelete={() => handleDelete(book.id)}
              />
            ))}
          </div>
        ) : (
          // Режим: СПИСОК 
          <div className="flex flex-col gap-2.5 relative z-10">
            {filteredBooks.map(book => (
              <div key={book.id} className="group bg-white rounded-xl p-3 shadow-sm hover:shadow-md transition-all border border-slate-100 flex items-center justify-between gap-4">
                
                <div className="flex items-center gap-4 flex-1 min-w-0">
                  {/* Микро-обложка */}
                  <div className="w-10 h-10 rounded-lg bg-indigo-50 flex items-center justify-center shrink-0 border border-indigo-100/50">
                    <span className="text-indigo-400 font-bold text-sm uppercase">
                      {book.title.substring(0, 1)}
                    </span>
                  </div>
                  
                  {/* Инфо (Название, Автор, Категория) */}
                  <div className="flex-1 min-w-0 grid grid-cols-1 md:grid-cols-[2fr_1fr_1fr] gap-4 items-center">
                    <h3 className="text-sm font-bold text-slate-800 truncate group-hover:text-indigo-600 transition-colors">
                      {book.title}
                    </h3>
                    <p className="text-[11px] font-semibold text-slate-400 truncate flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-slate-200"></span>
                      {book.author}
                    </p>
                    <div className="hidden md:flex justify-start">
                      <span className="inline-flex items-center text-[8px] font-black uppercase tracking-[0.1em] text-indigo-500 bg-indigo-50/80 px-2 py-1 rounded-md leading-none">
                        {book.category}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Кнопки списка */}
                <div className="flex items-center gap-1.5 shrink-0">
                  <button onClick={() => setViewingBook(book)} className="px-3 py-2 bg-slate-900 text-white rounded-md text-[9px] font-bold uppercase tracking-wide hover:bg-indigo-600 transition-all shadow-sm">Детали</button>
                  <button onClick={() => { setEditingId(book.id); setIsFormOpen(true); }} className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-md transition-all">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg>
                  </button>
                  <button onClick={() => handleDelete(book.id)} className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-md transition-all">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      {isFormOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-6 backdrop-blur-md bg-slate-900/40">
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

      <BookDetailsModal 
        book={viewingBook} 
        onClose={() => setViewingBook(null)} 
      />
      <div className="fixed bottom-6 right-6 z-40 flex flex-col items-end gap-4">
        {isAiOpen && (
          <div className="animate-in slide-in-from-bottom-5 fade-in duration-300 shadow-2xl rounded-2xl overflow-hidden border border-slate-100">
            <AiChat />
          </div>
        )}
        <button
          onClick={() => setIsAiOpen(!isAiOpen)}
          className={`w-10 h-10 rounded-full flex items-center justify-center shadow-lg transition-all duration-300 ${isAiOpen ? "bg-slate-900 text-white rotate-90" : "bg-indigo-600 text-white hover:scale-110 shadow-indigo-200"}`}
        >
          {isAiOpen ? (
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12" /></svg>
          ) : (
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 00-2.456 2.456zM16.894 20.567L16.5 21.75l-.394-1.183a2.25 2.25 0 00-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 001.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 001.423 1.423l1.183.394-1.183.394a2.25 2.25 0 00-1.423 1.423z" />
            </svg>
          )}
        </button>
      </div>

    </div>
  );
}

export default App;