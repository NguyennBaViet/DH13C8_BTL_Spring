FROM openjdk:23-jre-slim
WORKDIR /app
COPY target/review-service-1.0.0.jar app.jar
EXPOSE 8005
ENTRYPOINT ["java", "-jar", "app.jar"]
