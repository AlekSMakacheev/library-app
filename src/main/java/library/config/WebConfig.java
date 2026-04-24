package library.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class WebConfig implements WebMvcConfigurer {

    public void addResourceHandlers(ResourceHandlerRegistry registry) {
        // Говорим серверу: если запрашивают /uploads/**, ищи файл в папке uploads
        registry.addResourceHandler("uploads/**")
                .addResourceLocations("file:uploads/");
    }
}
