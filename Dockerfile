# Step 1: Use a Java Runtime environment
FROM eclipse-temurin:21-jre-alpine

# Step 2: Create a place for your persistent H2 data inside the container
RUN mkdir -p /opt/h2-data

# Step 3: Copy your compiled JAR file into the image
# Note: You must run './mvnw package' before building the docker image
COPY target/*.jar app.jar

# Step 4: Start the application
ENTRYPOINT ["java", "-jar", "/app.jar"]
