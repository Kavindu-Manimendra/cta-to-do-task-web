FROM maven:3.9.9-eclipse-temurin-21 AS builder

LABEL authors="Kavindu Manimendra"

WORKDIR /app

COPY pom.xml .

RUN mvn dependency:go-offline -B

COPY src ./src

RUN mvn clean package -DskipTests

FROM eclipse-temurin:17-jdk-jammy AS runner

WORKDIR /app

COPY --from=builder /app/target/backend-app.jar /app/app.jar

EXPOSE 9090

ENTRYPOINT ["java", "-jar", "/app/app.jar"]
