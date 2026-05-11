# biblioLOGIC (Library AI Assistant)

Интеллектуальная цифровая библиотека с AI-ассистентом для работы с книгами и PDF-документами.

## О проекте

biblioLOGIC — это fullstack-приложение, которое объединяет цифровую библиотеку и возможности искусственного интеллекта.

Пользователь может:
- загружать PDF-книги
- просматривать библиотеку
- взаимодействовать с AI-ассистентом
- работать с локальными AI-моделями через Ollama

Проект создан для изучения современных frontend/backend технологий и интеграции AI в веб-приложения.

# Возможности

- Загрузка PDF-книг
- Просмотр библиотеки
- Категории книг
- AI-чат
- Интеграция с Ollama
- REST API
- PostgreSQL
- Современный UI на React


# Технологии

## Frontend
- React
- Vite
- JavaScript
- Tailwind CSS

## Backend
- Java
- Spring Boot
- Spring Data JPA
- Spring Web
- Maven

## Database
- PostgreSQL

## AI
- Ollama
- Spring AI

# Структура проекта

```bash
library/
│
├── library-frontend/   # React frontend
├── src/main/java/      # Spring Boot backend
├── uploads/            # Загруженные PDF
├── pom.xml
└── README.md
```

# Установка и запуск

## 1. Клонирование проекта

```bash
git clone YOUR_REPOSITORY_URL
cd library
```
# Backend запуск

## 1. Создание базы данных

```sql
CREATE DATABASE library_db;
```
## 2. Настройка application.properties

```properties
spring.datasource.url=jdbc:postgresql://localhost:5432/library_db
spring.datasource.username=postgres
spring.datasource.password=your_password
```

## 3. Запуск backend

### Windows

```bash
mvnw.cmd spring-boot:run
```

### Linux / MacOS

```bash
./mvnw spring-boot:run
```

Backend:

```bash
http://localhost:8080
```

# Frontend запуск

## Переход в frontend

```bash
cd library-frontend
```

## Установка зависимостей

```bash
npm install
```

## Запуск проекта

```bash
npm run dev
```

Frontend:

```bash
http://localhost:5173
```

# Ollama Setup

Установите Ollama:
https://ollama.com

Скачайте модель:

```bash
ollama pull llama3
```

Запустите Ollama:

```bash
ollama serve
```

# Будущие улучшения

- AI memory
- JWT authentication
- Docker support
- RAG system
- Semantic search
- AI analysis of uploaded books


# Скриншоты

Добавьте сюда скриншоты интерфейса проекта.

```md
![Главный экран](./screenshots/main_screen.png)
![ИИ](./screenshots/AI_screen.png)
![Добавить источник](./screenshots/add_screen.png)
```

# Цель проекта

Проект создан для изучения:
- Fullstack разработки
- React
- Spring Boot architecture
- REST API
- PostgreSQL
- Интеграции AI

# Автор

AlekSMakacheev
