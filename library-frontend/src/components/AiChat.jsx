import React, { useState, useRef, useEffect } from 'react';

function AiChat() {
  const [messages, setMessages] = useState([
    { role: 'assistant', text: 'Здравствуйте! Я интегрированная нейросеть библиотеки. Могу помочь найти нужные материалы или проанализировать документы в базе.' }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;
    
    const userText = input.trim();
    setMessages(prev => [...prev, { role: 'user', text: userText }]);
    setInput('');
    setIsLoading(true);
    
    try {
      
      const response = await fetch('http://localhost:8080/api/ai/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message: userText }) 
      });

      if (!response.ok) {
        throw new Error(`Ошибка HTTP: ${response.status}`);
      }

      const textResponse = await response.text(); 
      
      setMessages(prev => [...prev, { role: 'assistant', text: textResponse }]);
    } catch (error) {
      console.error("Ошибка при запросе к ИИ:", error);
      setMessages(prev => [...prev, { 
        role: 'assistant', 
        text: 'Извините, произошла ошибка подключения. Проверьте, запущен ли сервер Spring Boot и Ollama.' 
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="absolute bottom-16 right-0 w-80 md:w-96 bg-white rounded-3xl shadow-2xl border border-slate-100 flex flex-col overflow-hidden z-50 transform origin-bottom-right transition-all">
      
      {/* Шапка формы */}
      <div className="px-5 py-4 bg-indigo-600 flex items-center justify-between shadow-sm z-10 relative overflow-hidden">
        <div className="absolute -right-10 -top-10 w-32 h-32 bg-white/10 rounded-full blur-2xl"></div>
        
        <div className="flex items-center gap-3 relative z-10">
          <span className="relative flex h-2.5 w-2.5">
            <span className={`absolute inline-flex h-full w-full rounded-full bg-white opacity-75 ${isLoading ? 'animate-ping' : ''}`}></span>
            <span className={`relative inline-flex rounded-full h-2.5 w-2.5 border border-indigo-600 ${isLoading ? 'bg-yellow-300' : 'bg-green-400'}`}></span>
          </span>
          <h3 className="text-xs font-semibold text-white uppercase tracking-wider">AI-Поиск</h3>
        </div>
        <span className="text-[9px] font-bold text-indigo-100 uppercase tracking-widest bg-indigo-500/50 px-2 py-1 rounded-md relative z-10">
          biblioLOGIC
        </span>
      </div>

      {/* Окно сообщений */}
      <div className="flex-1 p-5 overflow-y-auto min-h-[300px] max-h-[400px] bg-slate-50/80 space-y-4">
        {messages.map((msg, idx) => (
          <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[85%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed ${
              msg.role === 'user' 
                ? 'bg-indigo-600 text-white rounded-tr-sm shadow-md shadow-indigo-200/50' 
                : 'bg-white border border-slate-200/60 text-slate-700 rounded-tl-sm shadow-sm'
            }`}>
              {msg.text}
            </div>
          </div>
        ))}
        
        {/* Анимация "ИИ печатает..." */}
        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-white border border-slate-200/60 text-slate-400 rounded-2xl rounded-tl-sm px-4 py-3 shadow-sm flex items-center gap-1.5">
              <div className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce"></div>
              <div className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '0.15s' }}></div>
              <div className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '0.3s' }}></div>
            </div>
          </div>
        )}
        {/* Невидимый элемент для прокрутки вниз */}
        <div ref={messagesEndRef} />
      </div>

      {/* Поле ввода */}
      <div className="p-3 bg-white border-t border-slate-100">
        <div className="relative h-12 flex items-center bg-slate-100/50 border border-slate-200 rounded-full focus-within:ring-2 focus-within:ring-indigo-500/20 focus-within:border-indigo-500 transition-all">
          
          <input 
            type="text" 
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            placeholder={isLoading ? "Нейросеть думает..." : "Задайте вопрос..."}
            disabled={isLoading}
            className="flex-1 h-full bg-transparent text-sm font-medium text-slate-700 pl-5 pr-12 focus:outline-none placeholder:text-slate-400 disabled:opacity-50"
          />
          
          <div className={`absolute right-1 top-1/2 -translate-y-1/2 transition-all duration-300 ${
              input.trim() && !isLoading ? 'opacity-100 visible' : 'opacity-0 invisible'
          }`}>
              <button 
                onClick={handleSend}
                disabled={!input.trim() || isLoading}
                className="w-10 h-10 flex items-center justify-center text-indigo-600 hover:text-indigo-800 hover:scale-110 transition-transform bg-transparent"
              >
                <svg className="w-5 h-5 relative right-[1px]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M22 12L2 22l4-10-4-10 20 10z"></path>
                  <line x1="6" y1="12" x2="22" y2="12"></line>
                </svg>
              </button>
          </div>
          
        </div>
      </div>
      
    </div>
  );
}

export default AiChat;