FROM openjdk:23-jre-slim
WORKDIR /app
COPY target/hotel-service-1.0.0.jar app.jar
EXPOSE 8002
ENTRYPOINT ["java", "-jar", "app.jar"]
