package library.service;

import library.service.interfaces.FileService;
import org.apache.pdfbox.Loader;
import org.apache.pdfbox.pdmodel.PDDocument;
import org.apache.pdfbox.text.PDFTextStripper;
import org.springframework.ai.ollama.OllamaChatModel;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.io.File;
import java.io.IOException;
import java.nio.file.Path;
import java.nio.file.Paths;

@Service
public class FileServiceImpl implements FileService {

    @Value("${file/upload-dir:uploads}")
    private String uploadDir;

    private final OllamaChatModel chatModel;

    public FileServiceImpl(OllamaChatModel chatModel) {
        this.chatModel = chatModel;
    }

    @Override
    public String extractTextFromPdf(String fileName) throws IOException {

        Path filePath = Paths.get(uploadDir).resolve(fileName);
        File file = filePath.toFile();

        if(!file.exists()) {
            throw new IOException("File not found" + fileName);
        }

        try(PDDocument document = Loader.loadPDF(file)) {
            PDFTextStripper stripper = new PDFTextStripper();

            stripper.setStartPage(1);
            stripper.setEndPage(5);

            return stripper.getText(document);
        }
    }

    @Override
    public String generateSummary(String pdfText) {
        if (pdfText == null || pdfText.isBlank()) {
            return "Текст для анализа не найден.";
        }

        String cleanText = pdfText.replaceAll("\\s+", " ").trim();


        String textToAnalyze = cleanText.length() > 2000 ? cleanText.substring(0, 2000) : cleanText;

        String prompt = """
        Ты — профессиональный редактор и библиотекарь. Твоя задача — написать красивую и связную аннотацию к книге на основе фрагмента её текста.
        
        ЖЕСТКИЕ ПРАВИЛА:
        1. Напиши строго 2-3 полных, осмысленных предложения.
        2. ЗАПРЕЩЕНО использовать списки, пункты, тире или просто перечислять слова.
        3. Пиши строго на литературном русском языке.
        4. Выведи ТОЛЬКО саму аннотацию. Никаких вступительных фраз вроде "Вот аннотация" или "Конечно".
        
        Текст для анализа:
        "%s"
        """.formatted(textToAnalyze);

        try {
            String response = chatModel.call(prompt);

            return response
                    .replace("Вот аннотация:", "")
                    .replace("Аннотация:", "")
                    .trim();
        } catch (Exception e) {
            return "Ошибка генерации аннотации: " + e.getMessage();
        }
    }
}
