FROM openjdk:23-jre-slim
WORKDIR /app
COPY target/payment-service-1.0.0.jar app.jar
EXPOSE 8004
ENTRYPOINT ["java", "-jar", "app.jar"]
