import { useEffect, useState } from "react";
import BookCard from "./components/BookCard";
import BookForm from "./components/BookForm";

function App() {
  const [books, setBooks] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("Все");
  const [isLoading, setIsLoading] = useState(false);

  const categories = ["Все", "Токсикология", "Клинические исследования", "Йога", "Бег", "Психология", "Общее"];

  // 1. ЗАГРУЗКА ДАННЫХ
  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const url = selectedCategory === "Все" 
          ? "http://localhost:8080/api/books" 
          : `http://localhost:8080/api/books?category=${encodeURIComponent(selectedCategory)}`;
        
        const response = await fetch(url);
        const data = await response.json();
        setBooks(data);
      } catch (error) {
        console.error("Ошибка при загрузке книг", error);
      }
    };
    fetchBooks();
  }, [selectedCategory]);

  // 2. СОХРАНЕНИЕ (Эту функцию мы передаем внутрь BookForm)
  const handleSave = async (formData, selectedFile) => {
    setIsLoading(true);
    const isEditing = editingId !== null;

    try {
      let response;
      if (isEditing) {
        response = await fetch(`http://localhost:8080/api/books/${editingId}`, {
          method: "PUT",
          headers: { "Content-type": "application/json" },
          body: JSON.stringify(formData)
        });
      } else {
        const data = new FormData();
        data.append("title", formData.title);
        data.append("author", formData.author);
        data.append("category", formData.category);
        if (selectedFile) data.append("file", selectedFile);

        response = await fetch("http://localhost:8080/api/books", {
          method: "POST",
          body: data
        });
      }

      if (response.ok) {
        const savedBook = await response.json();
        if (isEditing) {
          setBooks(books.map(b => b.id === editingId ? savedBook : b));
          setEditingId(null);
        } else {
          setBooks(prevBooks => [...prevBooks, savedBook]);
        }
      }
    } catch (error) {
      console.error("Ошибка при сохранении:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // 3. УДАЛЕНИЕ (Передаем в BookCard)
  const deleteBook = async (id) => {
    if (window.confirm("Удалить эту книгу?")) {
      try {
        const response = await fetch(`http://localhost:8080/api/books/${id}`, {
          method: "DELETE",
        });
        if (response.ok) {
          setBooks(books.filter(book => book.id !== id));
        }
      } catch (error) {
        console.error("Ошибка при удалении!", error);
      }
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8 font-sans">
      
      {/* КОМПОНЕНТ ФОРМЫ */}
      <div className="max-w-6xl mx-auto mb-12">
        <BookForm 
          key={editingId || 'new'} // ВОТ ЭТА СТРОКА — МАГИЯ
          onSave={handleSave} 
          editingBook={books.find(b => b.id === editingId)} 
          onCancel={() => setEditingId(null)}
          categories={categories}
          isLoading={isLoading}
        />
      </div>

      {/* ПОИСК И ФИЛЬТРЫ */}
      <div className="max-w-6xl mx-auto mb-8 space-y-6">
        <div className="relative">
          <input 
            type="text" 
            placeholder="Поиск по библиотеке..." 
            className="w-full p-4 pl-12 bg-white rounded-2xl shadow-sm border border-slate-200 outline-none focus:ring-2 focus:ring-blue-500"
            value={searchTerm} 
            onChange={(e) => setSearchTerm(e.target.value)} 
          />
          <span className="absolute left-4 top-4">🔍</span>
        </div>

        <div className="flex flex-wrap gap-2">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-6 py-2 rounded-full font-bold transition-all ${
                selectedCategory === cat 
                ? "bg-blue-600 text-white shadow-lg scale-105" 
                : "bg-white text-slate-500 hover:bg-slate-100"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* СЕТКА КНИГ */}
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold text-slate-800 mb-6 border-b-2 pb-2">My library</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {books
            .filter(b => 
              b.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
              b.author.toLowerCase().includes(searchTerm.toLowerCase())
            )
            .map((book) => (
              <BookCard 
                key={book.id} 
                book={book} 
                onEdit={(b) => setEditingId(b.id)} 
                onDelete={deleteBook} 
              />
            ))
          }
        </div>
      </div>
    </div>
  );
}

export default App;