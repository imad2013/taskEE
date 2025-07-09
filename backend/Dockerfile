# Use Maven to build the app
FROM maven:3.9.6-eclipse-temurin-17 AS build
WORKDIR /app
COPY . .
RUN mvn clean package -DskipTests

# Use a lightweight Java image to run the app
FROM eclipse-temurin:17-jre
WORKDIR /app
COPY --from=build /app/target/taskmanager.war /app/taskmanager.war
EXPOSE 8080
CMD ["java", "-jar", "/app/taskmanager.war"] 