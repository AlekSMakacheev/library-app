package library.service;

import library.entity.Book;
import library.repository.BookRepository;
import library.service.interfaces.BookService;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;


import java.io.File;
import java.io.IOException;
import java.util.List;
import java.util.UUID;

@Service
public class BookServiceImpl implements BookService {

    @Value("${upload.path}")
    private String uploadPath;

    private final BookRepository bookRepository;

    public BookServiceImpl(BookRepository bookRepository) {
        this.bookRepository = bookRepository;
    }

    @Override
    public List<Book> findAllBooks() {
        return bookRepository.findAll();
    }

    @Override
    public Book saveBook(Book book, MultipartFile file) throws  IOException {

        try {
            Thread.sleep(10000); // Заставляем сервер ждать 3 секунды
        } catch (InterruptedException e) {
            e.printStackTrace();
        }

        if (file != null && !file.isEmpty()) {
            // 1. UUID для безопасности и уникальности
            String extension = "";
            String originalName = file.getOriginalFilename();
            if (originalName != null && originalName.contains(".")) {
                extension = originalName.substring(originalName.lastIndexOf("."));
            }
            String resultFileName = UUID.randomUUID().toString() + extension;

            // 2. Физическое сохранение
            File uploadDir = new File(uploadPath);
            if (!uploadDir.exists()) uploadDir.mkdirs();
            file.transferTo(new File(uploadDir.getAbsolutePath() + "/" + resultFileName));

            book.setFileName(resultFileName);
        }
        return bookRepository.save(book);
    }

    @Override
    public void deleteBook(Long id) {
        bookRepository.findById(id).ifPresent(book -> {
            if (book.getFileName() != null) {
                try {
                    // Удаляем физический файл
                    java.nio.file.Files.deleteIfExists(java.nio.file.Paths.get(uploadPath).resolve(book.getFileName()));
                } catch (IOException e) {
                    e.printStackTrace();
                }
            }
            bookRepository.delete(book);
        });
    }

    @Override
    public Book updateBooK(Long id, Book book) {
        Book updateBook = bookRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Book not found with id: " + id));
        updateBook.setTitle(book.getTitle());
        updateBook.setAuthor(book.getAuthor());
        updateBook.setIsbn(book.getIsbn());

        return bookRepository.save(updateBook);
    }

    @Override
    public List<Book> findByCategory(String category) {
        return bookRepository.findByCategory(category);
    }
}
