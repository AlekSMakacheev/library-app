package library.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

import java.util.Objects;

@Entity
@Table(name = "books")
public class Book {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    @NotBlank(message = "Название книги не может быть пустым!")
    @Size(min = 2, max = 100, message = "Название книги должно содержать от 2 до 100 символов!")
    private String title;

    @Column(nullable = false)
    @NotBlank(message = "Автора необходимо обязательно указать!")
    private String author;

    @Column(nullable = false)
    @NotBlank(message = "Категорию необходимо обязательно указать")
    private String category;

    @Column(columnDefinition = "TEXT")
    private  String description;
    private String isbn;

    private String fileName;

    public Book() {
    }

    public Book(String title, String author, String category, String description, String isbn, String fileName) {
        this.title = title;
        this.author = author;
        this.category = category;
        this.description = description;
        this.isbn = isbn;
        this.fileName = fileName;
    }

    @Override
    public String toString() {
        return "Book{" +
                "id=" + id +
                ", title='" + title + '\'' +
                ", author='" + author + '\'' +
                ", description='" + description + '\'' +
                ", isbn='" + isbn + '\'' +
                ", fileName='" + fileName + '\'' +
                '}';
    }

    @Override
    public boolean equals(Object o) {
        if (!(o instanceof Book book)) return false;
        return Objects.equals(id, book.id) && Objects.equals(title, book.title) && Objects.equals(author, book.author) && Objects.equals(description, book.description) && Objects.equals(isbn, book.isbn) && Objects.equals(fileName, book.fileName);
    }

    @Override
    public int hashCode() {
        return Objects.hash(id, title, author, description, isbn, fileName);
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getAuthor() {
        return author;
    }

    public void setAuthor(String author) {
        this.author = author;
    }

    public String getCategory() {
        return category;
    }

    public void setCategory(@NotBlank(message = "Категорию необходимо обязательно указать") String category) {
        this.category = category;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getIsbn() {
        return isbn;
    }

    public void setIsbn(String isbn) {
        this.isbn = isbn;
    }

    public String getFileName() {
        return fileName;
    }

    public void setFileName(String fileName) {
        this.fileName = fileName;
    }
}
