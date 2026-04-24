package library.service.interfaces;

import library.entity.Book;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;

public interface BookService {

    List<Book> findAllBooks();
    Book saveBook(Book book, MultipartFile file) throws IOException;
    void deleteBook(Long id);
    Book updateBooK(Long id, Book book);
    List<Book> findByCategory(String category);
}
