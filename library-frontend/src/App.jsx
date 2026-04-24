import { useEffect, useState } from "react"


function App() {

  const[books, setBooks] = useState([]);
  const[newBook, setNewBook] = useState({title: "", author: "", isbn: ""})
  const[editingId, setEditingId] = useState(null);
  const[searchTerm, setSearchTerm] = useState("");
  const[selectedFile, setSelectedFile] = useState(null);
  const[isLoading, setIsLoading] = useState(false);

  // Функция для получения книг с нашего бэкенда
  useEffect(() => {
    const fetchBooks = async() => {
      try {
        const response = await fetch("http://localhost:8080/api/books");
        const data = await response.json();
        setBooks(data);
      } catch (error) {
        console.error("Ошибка при загрузке книг", error)
      }
    }  
    fetchBooks();
  }, []);

  const deleteBook = async(id) => {
    if(window.confirm("Удалить эту книгу?")) {
      try {
        const response = await fetch(`http://localhost:8080/api/books/${id}`, {
          method: "DELETE",
        })
        if(response.ok) {
          setBooks(books.filter(book => book.id !== id))
        }
      } catch (error) {
        console.error("Ошибка при удалении!", error)
      }
    }
  }

  const handleSave = async (e) => {
    e.preventDefault();

    // Если поля пустые — выходим
    if (!newBook.title.trim() || !newBook.author.trim()) {
      alert("Заполните название и автора");
      return;
    } 

    setIsLoading(true); // Включаем загрузку

    // Если editingId не null, значит мы в режиме редактирования
    const isEditing = editingId !== null;

    try {
      let response;

      if (isEditing) {
        response = await fetch(`http://localhost:8080/api/books/${editingId}`, {
          method: "PUT",
          headers: { "Content-type": "application/json" },
          body: JSON.stringify(newBook)
        });
      } else {
        // --- ЛОГИКА СОЗДАНИЯ (новая, через FormData с файлом) ---
        const formData = new FormData();
        formData.append("title", newBook.title);
        formData.append("author", newBook.author);
        if (selectedFile) {
          formData.append("file", selectedFile);          
        }

        response = await fetch("http://localhost:8080/api/books", {
          method: "POST",
          // ВАЖНО: заголовки Content-Type не ставим!
          body: formData
        });
      }

      if (response.ok) {
        const savedBook = await response.json();

        if (isEditing) {
          // Обновляем книгу в списке прямо на экране
          setBooks(books.map(b => b.id === editingId ? savedBook : b));
          setEditingId(null); // Сбрасываем режим редактирования
        } else {
          // Просто добавляем новую книгу в список
          setBooks(prevBooks => [...prevBooks, savedBook]);
        }

        // Очищаем поля формы
        setNewBook({title: "", author: "", isbn: ""});
        // Очищаем состояние файла
        setSelectedFile(null);
        // Очистить визуально input type="file"
        if (e.target.reset) e.target.reset();        
      }
      
    } catch (error) {
      console.error("Ошибка при сохранении]:", error);
      alert("Произошла ошибка при сохранении!")
    } finally {
      setIsLoading(false); // Выключаем загрузку в любом случае (успех или ошибка)
    }
  }

  const startEdit = (book) => {
    setEditingId(book.id);
    setNewBook({title: book.title, author: book.author, isbn: book.isbn})
  }

  const cancelEdit = () => {
    setEditingId(null); // Сбрасываем ID редактируемой книги
    setNewBook({title: "", author: "", isbn: ""}); // Очищаем поля формы  
  }


  return (
    <div className="min-h-screen bg-gray-50 p-8 font-sans">
      <div className="max-w-6xl mx-auto mb-12">
        <div className="bg-white p-8 rounded-3xl shadow-xl border border-slate-100">
          <h2 className="text-2xl font-black text-slate-800 mb-6 flex items-center gap-2">
            <span className="bg-blue-600 text-white p-2 rounded-lg text-sm">+</span>
            {editingId ? "Редактировать книгу" : "Добавить новый ресурс"}
          </h2>
          <form onSubmit={handleSave} className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
            <div className="flex flex-col gap-2">
              <label className="text-xs font-bold text-slate-400 uppercase ml-1">Название</label>
              <input
               type="text"
               placeholder="Например: ..."
               className="p-3 bg-slate-50 border-none rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all"
               value={newBook.title}
               onChange={(e) => setNewBook({...newBook, title: e.target.value})}
               required
              />
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-xs font-bold text-slate-400 uppercase ml-1">Автор</label>
                <input
                  type="text"
                  placeholder="Имя автора"
                  className="p-3 bg-slate-50 border-none rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                  value={newBook.author}
                  onChange={(e) => setNewBook({...newBook, author: e.target.value})}
                  required
                />
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-xs font-bold text-slate-400 uppercase ml-1">Загрузить PDF</label>
              <input
                type="file"
                accept="application/pdf"
                onChange={(e) => setSelectedFile(e.target.files[0])}
                className="p-3 bg-slate-50 rounded-xl text-sm outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="flex gap-2">
              <button
                type="submit"
                disabled={isLoading}
                className={`flex-1 p-3 rounded-xl font-bold shadow-lg transition-all ${
                  isLoading
                  ? "bg-slate-400 cursor-not-allowed shadow-none"
                  : "bg-blue-600 text-white hover:bg-blue-700 shadow-blue-200"
                }`}
              >
                {isLoading ? (
                  <span className="flex items-center justify-center gap-2">
                    <svg className="animate-spin h-5 w-5 text-white" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Загрузка
                  </span>  
                ) : (
                  editingId ? "Обновить" : "Создать" 
                )}
              </button>
              {editingId && (
                <button onClick={cancelEdit} className="bg-slate-100 text-slate-500 p-3 rounded-xl hover:bg-slate-200 transition-all">
                  Отмена
                </button>
              )}
            </div>
          </form>
        </div>
      </div>

      <div className="max-w-6xl mx-auto mb-8">
        <div className="relative">
          <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </span>
          <input
           type="text"
           placeholder="Поиск по названию или автору..."
           className="w-full p-4 pl-10 bg-white border border-slate-200 rounded-2xl shadow-sm focus:ring-2 focus:ring-blue-500 outline-none transition-all text-slate-600"
           value={searchTerm}
           onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>



      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold text-slate-800 mb-6 border-b-2 pb-2">
          My library
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {books
            .filter((book) => 
              book.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
              book.author.toLowerCase().includes(searchTerm.toLowerCase())
            )
            .map((book) => (
            <div
              key={book.id}
              className="bg-white rounded-3xl shadow-sm border border-slate-100 p-6 flex flex-col justify-between hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 group relative overflow-hidden"
            >

              {/* Декоративный элемент - иконка PDF в углу, если файл есть */}
              {book.fileName && (
                <div className="absolute top-4 right-4 text-red-100 group-hover:text-red-500 transition-colors">
                  <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M14,2H6A2,2 0 0,0 4,4V20A2,2 0 0,0 6,22H18A2,2 0 0,0 20,20V8L14,2M18,20H6V4H13V9H18V20Z" />
                  </svg>
                </div>
              )}


              <div>
                {/* Иконка-заглушка вместо обложки */}
                <div className="w-full h-44 bg-gradient-to-br from-slate-50 to-blue-50 rounded-2xl mb-5 flex items-center justify-center text-blue-200 group-hover:from-blue-100 group-hover:to-blue-200 transition-colors">
                  <svg className="w-16 h-16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"/>
                  </svg>
                </div>

                <h3 className="text-xl font-black text-slate-800 mb-1 leading-tight group-hover:text-blue-600 transition-colors">
                  {book.title}
                </h3>
                <p className="text-slate-500 font-medium italic mb-4">by {book.author}</p>
                <div className="flex items-center gap-2 mb-4">
                  <span className="px-2 py-1 bg-slate-100 text-[10px] font-bold text-slate-400 rounded uppercase tracking-wider">
                    ISBN: {book.isbn || "N/A"}
                  </span>
                </div>
              </div>

              <div className="space-y-3 mt-4">
                {/* Кнопка Читать - теперь это полноценная кнопка во всю ширину */}
                {book.fileName ? (
                  <a
                    href={`http://localhost:8080/uploads/${book.fileName}`}
                    target="_blank" // Открывает в новой вкладке
                    rel="noopener noreferrer" // Защита для безопасности
                    className="flex items-center justify-center gap-2 w-full bg-emerald-500 text-white py-3 rounded-xl font-bold hover:bg-emerald-600 shadow-lg shadow-emerald-100 transition-all active:scale-95"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                      Читать PDF
                  </a>
                ) : (
                  <div className="text-center py-3 text-slate-300 text-sm font-medium border-2 border-dashed border-slate-100 rounded-xl">
                    Файл не загружен
                  </div>
                )}

                {/* Маленькие кнопки управления */}
                <div className="flex gap-2">
                  <button
                    onClick={() => startEdit(book)}
                    className="flex-1 text-xs font-bold text-slate-400 hover:text-blue-600 hover:bg-blue-50 py-2 rounded-lg transition-all"
                  >
                    Изменить
                  </button>
                  <button
                    onClick={() => deleteBook(book.id)}
                    className="flex-1 text-xs font-bold text-slate-400 hover:text-red-600 hover:bg-red-50 py-2 rounded-lg transition-all"
                  >
                    Удалить
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

      </div>

    </div>
  )

}

export default App;
