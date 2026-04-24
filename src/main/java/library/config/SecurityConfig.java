package library.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.web.SecurityFilterChain;

@Configuration
@EnableWebSecurity
public class SecurityConfig {

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
                .csrf(AbstractHttpConfigurer::disable) // Отключаем защиту для POST запросов
                .authorizeHttpRequests(auth -> auth
                        .requestMatchers("/api/books/**", "/swagger-ui/**", "/v3/api-docs/**", "/uploads/**").permitAll() // Разрешаем доступ к API и Swagger
                        .anyRequest().permitAll()
                )
                .formLogin(AbstractHttpConfigurer::disable) // Отключаем ту самую форму логина
                .httpBasic(AbstractHttpConfigurer::disable); // Оставляем базовую аутентификацию (на всякий случай)

        return http.build();
    }

}
