package library.service.interfaces;

import java.io.IOException;

public interface FileService {

    String extractTextFromPdf(String fileName) throws IOException;
    String generateSummary(String pdfText);
}
