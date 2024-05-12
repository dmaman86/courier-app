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

# Expose the port the config server will run on
EXPOSE 8082