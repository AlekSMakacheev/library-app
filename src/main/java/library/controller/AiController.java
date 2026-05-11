package library.controller;

import library.service.interfaces.FileService;
import org.springframework.ai.chat.messages.SystemMessage;
import org.springframework.ai.chat.messages.UserMessage;
import org.springframework.ai.chat.prompt.Prompt;
import org.springframework.ai.ollama.OllamaChatModel;

import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/ai")
@CrossOrigin(origins = "*")
public class AiController {

    private final OllamaChatModel chatModel;
    private final FileService fileService;



    private static final String SYSTEM_PROMPT = """
        Ты — высококвалифицированный ИИ-ассистент цифровой научной библиотеки "BiblioLogic".
        Твоя специализация — медицинская наука, организация здравоохранения, токсикология, фармакология, радиобиология и физическая культура (включая Ashtanga yoga и спортивную медицину).
        
        Правила общения:
        1. Отвечай строго профессионально, авторитетно и лаконично, в академическом или научно-популярном стиле.
        2. Избегай шаблонных фраз вроде "Я просто искусственный интеллект" или "Я не могу работать в библиотеках". Ты РАБОТАЕШЬ в этой библиотеке здесь и сейчас.
        3. Если тебя приветствуют, отвечай вежливо, подтверждая свою готовность помочь с анализом научных материалов.
        4. Если вопрос выходит далеко за рамки твоей специализации, мягко верни пользователя к научной тематике.
        """;

    public AiController(OllamaChatModel chatModel, FileService fileService) {
        this.chatModel = chatModel;
        this.fileService = fileService;
    }

    @PostMapping("/chat")
    public String chat(@RequestBody Map<String, String> request) {

        // Достаем текст пользователя из JSON, который прислал React
        String message = request.getOrDefault("message", "Привет!");

        try {
            // Создаем системное сообщение с инструкцией
            SystemMessage systemMessage = new SystemMessage(SYSTEM_PROMPT);

            // Создаем пользовательское сообщение с вопросом с фронтенда
            UserMessage userMessage = new UserMessage(message);

            // Объединяем их в один запрос (Prompt) для Ollama
            Prompt prompt = new Prompt(List.of(systemMessage, userMessage));

            // Отправляем модельке и возвращаем её ответ
            return chatModel.call(prompt).getResult().getOutput().getText();

        } catch (Exception e) {
            return "Ошибка связи с Ollama: " + e.getMessage() +
                    ". Убедитесь, что программа Ollama запущена и модель qwen2 скачана.";
        }
    }

    @GetMapping("/test-pdf")
    public String testPdf(@RequestParam String fileName) {
        try {
            String text = fileService.extractTextFromPdf(fileName);
            return "Текст из файла (первые 5 стр):\n" + text;
        } catch (Exception e) {
            return "Ошибка при чтении PDF: " + e.getMessage();
        }
    }


}
