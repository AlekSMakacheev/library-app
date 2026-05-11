package library.service;

import library.entity.Book;
import library.repository.BookRepository;
import library.service.interfaces.BookService;
import library.service.interfaces.FileService;
import org.apache.pdfbox.Loader;
import org.apache.pdfbox.pdmodel.PDDocument;
import org.apache.pdfbox.rendering.PDFRenderer;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;


import javax.imageio.ImageIO;
import java.awt.image.BufferedImage;
import java.io.File;
import java.io.IOException;
import java.util.List;
import java.util.UUID;

@Service
public class BookServiceImpl implements BookService {

    @Value("${upload.path}")
    private String uploadPath;

    private final BookRepository bookRepository;
    private final FileService fileService;

    public BookServiceImpl(BookRepository bookRepository, FileService fileService) {
        this.bookRepository = bookRepository;
        this.fileService = fileService;
    }

    @Override
    public List<Book> findAllBooks() {
        return bookRepository.findAll();
    }

    @Override
    public Book saveBook(Book book, MultipartFile file) throws  IOException {

        try {
            Thread.sleep(5000);
        } catch (InterruptedException e) {
            e.printStackTrace();
        }

        if (file != null && !file.isEmpty()) {

            String extension = "";
            String originalName = file.getOriginalFilename();
            if (originalName != null && originalName.contains(".")) {
                extension = originalName.substring(originalName.lastIndexOf("."));
            }
            String resultFileName = UUID.randomUUID().toString() + extension;

            File uploadDir = new File(uploadPath);
            if (!uploadDir.exists()) uploadDir.mkdirs();
            file.transferTo(new File(uploadDir.getAbsolutePath() + "/" + resultFileName));

            book.setFileName(resultFileName);

            String coverName = generateCover(resultFileName);
            book.setCoverName(coverName);

            try {
                String extractedText = fileService.extractTextFromPdf(resultFileName);

                String aiDescription = fileService.generateSummary(extractedText);

                book.setDescription(aiDescription);

            } catch (Exception e) {
                book.setDescription("Книга загружена, но ИИ не смог проанализировать текст.");
                e.printStackTrace();
            }
        }
        return bookRepository.save(book);
    }

    @Override
    public void deleteBook(Long id) {
        bookRepository.findById(id).ifPresent(book -> {
            if (book.getFileName() != null) {
                try {

                    java.nio.file.Files.deleteIfExists(java.nio.file.Paths.get(uploadPath).resolve(book.getFileName()));
                } catch (IOException e) {
                    e.printStackTrace();
                }
            }
            bookRepository.delete(book);
        });
    }

    @Override
    public Book updateBooK(Long id, Book book, MultipartFile file) throws IOException {

        Book updateBook = bookRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Book not found with id: " + id));
        updateBook.setTitle(book.getTitle());
        updateBook.setAuthor(book.getAuthor());
        updateBook.setCategory(book.getCategory());

        if (file != null && !file.isEmpty()) {

            if (updateBook.getFileName() != null) {
                java.nio.file.Files.deleteIfExists(java.nio.file.Paths.get(uploadPath).resolve(updateBook.getFileName()));
            }

            String extension = "";
            String originalName = file.getOriginalFilename();
            if (originalName != null && originalName.contains(".")) {
                extension = originalName.substring(originalName.lastIndexOf("."));
            }

            String resultFileName = UUID.randomUUID().toString() + extension;

            File uploadDir = new File(uploadPath);
            if (!uploadDir.exists()) uploadDir.mkdirs();
            file.transferTo(new File(uploadDir.getAbsolutePath() + "/" + resultFileName));

            String coverName = generateCover(resultFileName);
            updateBook.setCoverName(coverName);

            updateBook.setFileName(resultFileName);
        }

        return bookRepository.save(updateBook);
    }

    @Override
    public List<Book> findByCategory(String category) {
        return bookRepository.findByCategory(category);
    }

    private String generateCover(String pdfFileName) throws IOException {

        java.nio.file.Path pdfPath = java.nio.file.Paths.get(uploadPath).resolve(pdfFileName);
        String coverName = pdfFileName.replace(".pdf", "") + "_cover.jpg";
        java.nio.file.Path coverPath = java.nio.file.Paths.get(uploadPath).resolve(coverName);

        try (PDDocument document = Loader.loadPDF(pdfPath.toFile())) {
            PDFRenderer pdfRenderer = new PDFRenderer(document);

            BufferedImage bim = pdfRenderer.renderImageWithDPI(0, 300);

            ImageIO.write(bim, "jpg", coverPath.toFile());
        }

        return coverName;
    }
}
