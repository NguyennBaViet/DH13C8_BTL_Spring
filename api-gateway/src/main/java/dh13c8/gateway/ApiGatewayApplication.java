package dh13c8.gateway;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.gateway.route.RouteLocator;
import org.springframework.cloud.gateway.route.builder.RouteLocatorBuilder;
import org.springframework.context.annotation.Bean;

@SpringBootApplication
public class ApiGatewayApplication {

    public static void main(String[] args) {
        SpringApplication.run(ApiGatewayApplication.class, args);
    }

    @Bean
    public RouteLocator customRouteLocator(RouteLocatorBuilder builder) {
        return builder.routes()
                // User Service routes
                .route("user-service", r -> r.path("/api/auth/**", "/api/users/**")
                        .uri("http://localhost:8001"))

                // Hotel Service routes
                .route("hotel-service", r -> r.path("/api/hotels/**", "/api/rooms/**", "/api/amenities/**")
                        .uri("http://localhost:8002"))

                // Booking Service routes
                .route("booking-service", r -> r.path("/api/bookings/**", "/api/availability/**")
                        .uri("http://localhost:8003"))

                // Payment Service routes
                .route("payment-service", r -> r.path("/api/payments/**", "/api/invoices/**")
                        .uri("http://localhost:8004"))

                // Review Service routes
                .route("review-service", r -> r.path("/api/reviews/**", "/api/ratings/**")
                        .uri("http://localhost:8005"))

                .build();
    }
}
