# build from maven
FROM maven:3.9.6-eclipse-temurin-17 AS builder
WORKDIR /app

# copy pom.xml and install dependencies
COPY pom.xml .
RUN mvn dependency:go-offline -B

# copy source code and build
COPY src ./src
RUN mvn clean package -DskipTests

# create image
FROM eclipse-temurin:17-jdk-alpine
WORKDIR /app

# copy jar file from build stage
COPY --from=builder /app/target/*.jar app.jar

ENV JAVA_OPTS="-Xmx256m -Xms256m"

# expose port
EXPOSE 8761

# run application
ENTRYPOINT ["sh", "-c", "java $JAVA_OPTS -jar app.jar"]