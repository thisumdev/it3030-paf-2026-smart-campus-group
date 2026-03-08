package com.smart_campus.smart_campus.core.config;


import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.web.SecurityFilterChain;

@Configuration
@EnableWebSecurity
public class SecurityConfig {

    private final CorsConfig corsConfig;

    public SecurityConfig(CorsConfig corsConfig) {
        this.corsConfig = corsConfig;
    }

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
            // ── Disable CSRF (REST API — stateless) ──
            .csrf(AbstractHttpConfigurer::disable)

            // ── Apply CORS config ─────────────────────
            .cors(cors -> cors.configurationSource(
                    corsConfig.corsConfigurationSource()))

            // ── TEMPORARY: permit all routes ──────────
            // TODO: Replace with proper JWT + role rules
            //       after OAuth implementation is done
            .authorizeHttpRequests(auth -> auth
                    .anyRequest().permitAll()
            );

        return http.build();
    }
}