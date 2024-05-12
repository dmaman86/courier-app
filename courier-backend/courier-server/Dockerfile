# build the application
FROM maven:3.8.3-openjdk-17-slim AS build

COPY . .
RUN mvn clean package -DskipTests

# create a slim image
FROM openjdk:17-jdk-slim-buster

# Copy the build JAR from the previous stage
COPY --from=build /target/*.jar /app.jar

# Set the entry point for the application
ENTRYPOINT [ "java", "-jar", "/app.jar" ]

# FROM openjdk:17

# ARG JAR_FILE=target/*.jar

# COPY ${JAR_FILE} app.jar

# ENTRYPOINT [ "java", "-jar", "./app.jar"]

EXPOSE 8081