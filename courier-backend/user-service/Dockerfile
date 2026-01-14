# build service with maven
FROM maven:3.9.6-eclipse-temurin-17 AS builder
WORKDIR /app
COPY pom.xml .
RUN mvn dependency:go-offline -B
COPY src ./src
RUN mvn clean package -DskipTests

# create image
FROM eclipse-temurin:17-jdk-alpine
WORKDIR /app

# copy jar file from build stage
COPY --from=builder /app/target/*.jar app.jar

ENV JAVA_OPTS="-Xmx256m -Xms256m"

# expose port
EXPOSE 8088

# run application
ENTRYPOINT ["sh", "-c", "java $JAVA_OPTS -jar app.jar"]
