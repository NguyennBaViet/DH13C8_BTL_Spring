FROM openjdk:23-jre-slim
WORKDIR /app
COPY target/user-service-1.0.0.jar app.jar
EXPOSE 8001
ENTRYPOINT ["java", "-jar", "app.jar"]
