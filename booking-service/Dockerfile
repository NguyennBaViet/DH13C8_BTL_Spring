FROM openjdk:23-jre-slim
WORKDIR /app
COPY target/booking-service-1.0.0.jar app.jar
EXPOSE 8003
ENTRYPOINT ["java", "-jar", "app.jar"]
